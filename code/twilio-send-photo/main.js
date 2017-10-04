/**
****************************************************************************
* Copyright 2017 IBM
*
*   TJBot Photo Booth - Send Twilio MMS Cloud Function
*
*   By JeanCarl Bisson (@dothewww)
*   More info: https://ibm.biz/tjbot-photo-booth
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
****************************************************************************
*/

'use strict';

function main(params) {
  const client = require("twilio")(params.ACCOUNT_SID, params.AUTH_TOKEN);

  return new Promise((resolve, reject) => {
    client.messages.create({
      to: params.to,
      from: params.from,
      body: params.body,
      mediaUrl: params.image,
    }, function(err, message) {
      if(err) {
        reject({error: err});
      } else {
        resolve({
          headers: {
            "content-type": "application/json"
          },
          body: {
            sid: message.sid,
            status: message.status
          }
        });
      }
    });
  });
}

exports.main = main;
