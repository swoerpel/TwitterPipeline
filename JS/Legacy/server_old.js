var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    chroma = require('chroma-js'),

var T = new Twit(config);
console.log('server running...')

master_colors = chroma.brewer['oranges']

// debug tweet
// let code = Math.floor(Math.random() * 1000).toString();
// T.post('statuses/update',
//     { status: code },
//     (err, data, response) => {
//         console.log('debug tweet', code)
//     }
// );

// for uploading image
console.log('Opening an image...');
var image_path = path.join(__dirname, '/images/2_circle.png'),
    b64content = fs.readFileSync(image_path, { encoding: 'base64' });
console.log('Uploading Image')
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err) {
        console.log('ERROR:');
        console.log(err);
    }
    else {
        console.log('Image uploaded!');
        console.log('Now tweeting it...');
        T.post('statuses/update', {
            media_ids: new Array(data.media_id_string)
        },
            function (err, data, response) {
                if (err) {
                    console.log('ERROR:');
                    console.log(err);
                }
                else {
                    console.log('Posted an image!');
                }
            }
        );

    }
});


