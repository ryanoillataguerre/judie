#!/usr/bin/env bash
cd "${0%/*}"

brew install protobuf


if [[ ! -d ../python/ve ]]; then
  echo "No Python virtual environment installed. Installing ...."
  if [[ $(python3 --version | cut -d ' ' -f2 | cut -d '.' -f2) == 10 ]]; then
    echo "Building new python ve ...."
    python3 -m venv ../python/ve
    echo "New ve built"
  else
    echo "Please install python 3.10 or set the alias for python3"
    exit 1
  fi
fi

source ../python/ve/bin/activate
pip install -r ../python/requirements.txt

exit 0