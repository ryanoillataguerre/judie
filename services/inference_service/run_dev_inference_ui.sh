#!/bin/bash

# Run an interactive terminal-based chat session against the inference service.
#
# Usage:
#   ./run_dev_inference_ui.py [--build] [--windows]
#
#   --build [-b] will rebuild the Docker container for the inference service
#     Use this option if you made code changes that you want to test
#
#   --windows [-w] will run the dev ui in multiple tmux windows vs. separate panes
#     in the same window
#
# This requires that you have tmux installed, which can be done with
#   brew install tmux
#
# Date: 2023-11-02

# Trap CTRL+C and other termination signals to ensure cleanup
trap cleanup EXIT SIGINT SIGTERM

# Default values
BUILD=""
BUILD_MSG=""
STARTUP_DURATION=5
HEALTH_CHECK_TIMEOUT=10
WINDOWS=false

# Check for flags
for arg in "$@"
do
    case $arg in
        -b|--build)
            BUILD="--build"
            BUILD_MSG="Building the container ..."
            STARTUP_DURATION=60
            HEALTH_CHECK_TIMEOUT=60
            ;;
        -w|--windows)
            WINDOWS=true
            ;;
    esac
done

# Capture the current directory
current_dir=$(pwd)

# Functions

# Cleanup will be triggered by the trap
cleanup() {
    echo "Cleaning up..."
    # Shut down services
    docker-compose down

    # Remove temporary SQL directory and file
    rm -r test_client/dev_init_sql_tmp
}

# Wait for services to start by performing a health check
wait_for_server_readiness() {
    # Get the start time
    start_time=$(date +%s)

    # Set PYTHONPATH
    export PYTHONPATH=$current_dir:../:$PYTHONPATH
    echo $PYTHONPATH

    while : ; do
        # Get the current time
        current_time=$(date +%s)

        # Calculate the elapsed time
        elapsed_time=$((current_time - start_time))

        # Break the loop if the timeout has been reached
        if (( elapsed_time >= "${HEALTH_CHECK_TIMEOUT}")); then
            echo "Services health check timed out."
            exit 1
        fi

        # Attempt to run the health check
        python -m test_client.dev_inference_ui --health-check
        if [[ $? -eq 0 ]]; then
            echo "Services are ready."
            break
        fi
        echo "Waiting for services to start ..."
        sleep 2
    done

}

echo "Starting (takes $STARTUP_DURATION seconds or so) ..."
if [[ -n "${BUILD_MSG}" ]]; then
    echo $BUILD_MSG
fi

# Concatenate SQL migration files
mkdir -p test_client/dev_init_sql_tmp
find ../app-service/prisma/migrations -type f -name "migration.sql" | \
sort | xargs cat > test_client/dev_init_sql_tmp/combined_init.sql

# Create a new tmux session named 'dev_session'
tmux new-session -d -s dev_session

if [ "${WINDOWS}" = true ]; then
    # Create new windows for each stream
    tmux new-window -t dev_session:1 -n 'logs'
    tmux send-keys -t dev_session:1 "cd $current_dir; docker-compose up $BUILD" C-m

    wait_for_server_readiness

    tmux new-window -t dev_session:2 -n 'psql'
    tmux send-keys -t dev_session:2 "cd $current_dir; docker exec -it dev_postgres_container psql -U postgres -d postgres" C-m

    tmux new-window -t dev_session:3 -n 'chat'
    tmux send-keys -t dev_session:3 "cd $current_dir; export PYTHONPATH=\"$PYTHONPATH:../\"; python -m test_client.dev_inference_ui" C-m

else
    # Create one window will separate panes

    #Full-width pane for docker-compose up
    tmux send-keys -t dev_session:0 "cd $current_dir; docker-compose up $BUILD" C-m

    wait_for_server_readiness

    # Split the window horizontally for the other two streams
    tmux split-window -t dev_session:0 -v -p 66

    # Send command for psql to the new pane
    tmux send-keys -t dev_session:0.1 "cd $current_dir; docker exec -it dev_postgres_container psql -U postgres -d postgres" C-m

    # Split the bottom pane and send command for python ui
    tmux split-window -t dev_session:0.1 -h
    tmux send-keys -t dev_session:0.2 "cd $current_dir; export PYTHONPATH=\"$PYTHONPATH:../\"; python -m test_client.dev_inference_ui" C-m
fi

# Attach to the tmux session
tmux attach -t dev_session

