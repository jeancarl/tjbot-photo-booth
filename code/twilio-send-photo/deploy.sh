#!/bin/bash

############################################################################
# Copyright 2017 IBM
#
#   TJBot Photo Booth - Deploy Script for Send Twilio MMS Cloud Function
#
#   By JeanCarl Bisson (@dothewww)
#   More info: https://ibm.biz/tjbot-photo-booth
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
############################################################################

source local.env

function usage() {
  echo "Usage: $0 [--build,--install,--uninstall,--update,--env]"
}

function build() {
  rm -rf node_modules
  rm twilio_send_message.zip
  npm install
  zip -r twilio_send_message node_modules package.json main.js
}

function install() {
  echo "Adding action"
  wsk package create public
  wsk action create public/twilio_send_message --kind nodejs:6 twilio_send_message.zip\
    -p ACCOUNT_SID "$ACCOUNT_SID"\
    -p AUTH_TOKEN "$AUTH_TOKEN"\
    -a final true\
    -a web-export true
}

function update() {
  echo "Updating action"
  wsk action update public/twilio_send_message --kind nodejs:6 twilio_send_message.zip\
    -p ACCOUNT_SID "$ACCOUNT_SID"\
    -p AUTH_TOKEN "$AUTH_TOKEN"\
    -a final true\
    -a web-export true
}

function uninstall() {
  echo "Removing actions..."
  wsk action delete public/twilio_send_message

  echo "Done"
  wsk list
}

function showenv() {
  echo ACCOUNT_SID=$ACCOUNT_SID
  echo AUTH_TOKEN=$AUTH_TOKEN
}

  case "$1" in
  "--install" )
  install
  ;;
  "--uninstall" )
  uninstall
  ;;
  "--update" )
  update
  ;;
  "--env" )
  showenv
  ;;
  "--build" )
  build
  ;;
  * )
  usage
  ;;
  esac
