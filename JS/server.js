var fs = require('fs'),
    path = require('path'),
    paper = require('paper-jsdom-canvas'),
    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    express = require('express');
let loop = true;

// 0: Square
// 1: Circle
// 2: Triangle
let step_shape = 2;

let master_controller = new MasterController();
while (loop) { //setInterval(4hrs)
    console.log('image iteration started...')
    let img_path = master_controller.GenerateImage(step_shape);
    // PostImage(img_path);
    loop = false;
}


//untested
function PostImage(img_path) {
    var T = new Twit(config);
    var image_path = path.join(__dirname, img_path),
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });
    console.log('Uploading Image from ', img_path)
    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err) {
            console.log('ERROR:', err);
        }
        else {
            console.log('Image uploaded!');
            console.log('Now tweeting it...');
            T.post('statuses/update', {
                media_ids: new Array(data.media_id_string)
            },
                function (err, data, response) {
                    if (err)
                        console.log('ERROR:', err);
                    else
                        console.log('Posted an image!');
                }
            );
        }
    });
}