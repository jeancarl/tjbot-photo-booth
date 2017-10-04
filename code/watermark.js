/**
****************************************************************************
* Copyright 2017 IBM
*
*   TJBot Photo Booth - Watermark Cloud Function
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

var fs = require("fs");
var request = require("request");
var gm = require("gm").subClass({imageMagick: true});

function main(params) {
  return new Promise(function(resolve, reject) {
    request(params.watermark, {encoding: "binary"}, function(error, response, body) {
      fs.writeFile("./watermark.png", body, "binary", function (err) {
        if(err) {
          resolve({
            statusCode: 500,
            body: err
          });
        } else {
          gm(request(params.image))
          .command("composite")
          .in("-gravity", "center")
          .in("./watermark.png")
          .toBuffer("JPEG", function (err, buffer) {
            if(err) {
              resolve({
                statusCode: 500,
                body: err
              });
            } else {
              resolve({
                headers: {"Content-Type": "image/jpeg"},
                statusCode: 200,
                body: buffer.toString("base64")
              });
            }
          });
        }
      });
    });
  });
}

exports.main = main;
