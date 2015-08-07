#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cp RIA.js ria
cp RIA.js RIA

echo "export PATH=\"\$PATH\":$DIR" >> ~/.profile
echo "export PATH=\"\$PATH\":$DIR" >> ~/.bashrc

echo "!!! Open new terminal to be able to use RIA command line tool, you may need to reboot"

cp RIA.js ria
cp RIA.js RIA
