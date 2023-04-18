#!/usr/bin/env bash
cd "${0%/*}"
ROOT_DIR="$(cd ../..; pwd)"

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
pip install -r ../python/dev_requirements.txt

cd $(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")
echo $ROOT_DIR/services > services.pth

exit 0