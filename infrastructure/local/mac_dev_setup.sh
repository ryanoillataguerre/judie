#!/usr/bin/env bash
cd "${0%/*}"
ROOT_DIR="$(cd ../..; pwd)"
echo $ROOT_DIR

brew install protobuf
brew install node
brew install yarn
brew install terraform


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
else
  echo "ve already exists"
fi

source ../python/ve/bin/activate
pip install -r $ROOT_DIR/infrastructure/python/dev_requirements.txt

cd $(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")
echo $ROOT_DIR/services > services.pth

cd $ROOT_DIR/services/app-service
yarn

exit 0