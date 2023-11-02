#!/bin/bash

# Default values
BUILD=""
SLEEP_DURATION=10

# Check for --build flag
if [[ $1 == "--build" ]]; then
    BUILD="--build"
    SLEEP_DURATION=60
fi

echo "Starting (takes $SLEEP_DURATION seconds or so) ..."

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

# Concatenate SQL migration files
mkdir -p dev_init_sql_tmp
find ../app-service/prisma/migrations -type f -name "migration.sql" | \
sort | xargs cat > dev_init_sql_tmp/combined_init.sql

# Capture the current directory
current_dir=$(pwd)

# Create a new tmux session named 'dev_session'
tmux new-session -d -s dev_session

# Split the window into three panes:
# The top half-pane on the left is for the Docker services
# The bottom half-pane no the left is for the PostgreSQL DB
# The full-length right-hand pane is for the inference service chat interaction
tmux split-window -t dev_session:0 -v
tmux split-window -t dev_session:0 -hf

# In the top-left pane, change to the correct directory and run docker-compose up
tmux send-keys -t dev_session:0.0 "cd $current_dir; docker-compose up $BUILD" C-m

# Wait for services to start by performing a health check
#while : ; do
#    # Attempt to run the health check
#    <run health check>
#    echo "Waiting for services to start..."
#    sleep 2
#done
sleep $SLEEP_DURATION

# In the bottom-left pane, change to the correct directory and start the postgres interface
tmux send-keys -t dev_session:0.1 "cd $current_dir; docker exec -it dev_postgres_container psql -U postgres -d postgres" C-m

# In the right pane, change to the correct directory, set PYTHONPATH, and run Python script
tmux send-keys -t dev_session:0.2 "cd $current_dir; export PYTHONPATH=\"$PYTHONPATH:../\"; python -m run_dev_inference_ui" C-m

# Attach to the tmux session
tmux attach -t dev_session

