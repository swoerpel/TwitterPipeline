var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    MasterController = require('./MasterController.js'),
    config = require('./config.js');
let loop = true;

// 0: Square
// 1: Circle
// 2: Triangle
let step_shape = 0;

let master_controller = new MasterController();
while (loop) { //setInterval(4hrs)
    console.log('image iteration started...')
    let image_id = master_controller.GenerateImage(step_shape);
    img_path = "C:\\Files\\Programming\\TwitterPipeline\\images\\" + image_id + '.png'
    // let img_path = path.resolve("../images/")
    // PostImage(img_path);
    loop = false;
}


//untested
function PostImage(img_path) {
    console.lo
    var T = new Twit(config);
    var image_path = img_path
    // var image_path = path.join(__dirname, "..\\images\\"),
    var b64content = fs.readFileSync(image_path, { encoding: 'base64' });
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