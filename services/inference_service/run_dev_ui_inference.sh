#!/bin/bash

echo "Starting ..."

# Trap CTRL+C and other termination signals to ensure cleanup
trap cleanup EXIT SIGINT SIGTERM

# Cleanup will be triggered by the trap
cleanup() {
    echo "Cleaning up..."
    # Shut down services
    docker-compose down
    
    # Remove temporary SQL directory and file
    rm -r dev_init_sql_tmp
}

# Concatenate SQL migration files (only pulling those that will be used)
mkdir -p dev_init_sql_tmp
cat ../app-service/prisma/migrations/20230319033407_initial_schema/migration.sql \
    ../app-service/prisma/migrations/20230401193520_user_info/migration.sql \
    ../app-service/prisma/migrations/20230425002048_chat_subjects/migration.sql \
    ../app-service/prisma/migrations/20230523205347_users_cleanup/migration.sql \
    ../app-service/prisma/migrations/20230713221638_add_last_message_timestamp/migration.sql \
    ../app-service/prisma/migrations/20230830173628_chat_assignments/migration.sql \
    > dev_init_sql_tmp/combined_init.sql

# Capture the current directory
current_dir=$(pwd)

# Create a new tmux session named 'dev_session'
tmux new-session -d -s dev_session

# Create a window for Docker services and Python interaction
#tmux new-window -t dev_session:0 -n 'DevWindow'

# Split the window into two panes: one for Docker services, one for Python interaction
tmux split-window -t dev_session:0 -v

# In the left pane, change to the correct directory and run docker-compose up
tmux send-keys -t dev_session:0.0 "cd $current_dir; docker-compose up" C-m

# Wait for services to start by performing a health check
#while : ; do
#    # Attempt to run the health check script
#    python3 health_check.py && break
#    echo "Waiting for services to start..."
#    sleep 5
#done
sleep 10

# In the right pane, change to the correct directory, set PYTHONPATH and run Python script
tmux send-keys -t dev_session:0.1 "cd $current_dir; export PYTHONPATH=\"$PYTHONPATH:../\"; python -m run_dev_inference_ui" C-m

# Attach to the tmux session
tmux attach -t dev_session

# Access psql
# docker exec -it dev_postgres_container psql -U postgres -d postgres

# prisma generate --schema $ROOT_DIR/services/app-service/prisma/schema.prisma --generator client-py

