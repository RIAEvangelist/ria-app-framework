#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if grep -F $DIR ~/.bashrc
	then
		echo "!!! RIA command line tool ready to use"
		exit 0
fi

echo "export PATH=\"\$PATH\":$DIR" >> ~/.bashrc

echo "!!! Open new terminal to be able to use RIA command line tool"

