var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    config = require('./config.js');

let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"

let iteration_time = 1; //minutes
iteration_time *= 60; //seconds
iteration_time *= 1000; //miliseconds
let master_controller = new MasterController();
let palettes = Object.keys(chroma.brewer)
let counter = 0;
let live_tweeting = false;
if (live_tweeting) {
    master_controller.SetPaths(svg_path, png_path)
    setInterval(() => {
        let timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19).replace(/\s/g, '_')
        let rand_shape = Math.floor(Math.random() * 3)
        counter = counter % palettes.length
        let rand_palette = palettes[Math.floor(Math.random() * palettes.length)];
        // let rand_palette = 'RdBu'
        let color_machine = chroma.scale(rand_palette)
        console.log('image -> shape - color - index', rand_shape, rand_palette, counter)

        try {
            fs.readdir(png_path, (err, files) => {
                master_controller.GenerateImage(rand_shape, color_machine);
                let random_image_index = Math.round(Math.random() * files.length)
                let image_name = files[random_image_index]
                console.log('posting tweet at ', timestamp)
                TweetImage(png_path + image_name);
            });
        }
        catch (error) {
            console.log('error generating/tweeting image..', error)
        }
    }, iteration_time);
}
else {
    master_controller.SetPaths(dbg_path, dbg_path)
    let palette = 'RdBu'
    let color_machine = chroma.scale(palette)
    master_controller.GenerateImage(0, color_machine);
}


function TweetImage(img_path) {
    var T = new Twit(config);
    var b64content = fs.readFileSync(img_path, { encoding: 'base64' });
    console.log('posting image from', img_path);
    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err) {
            console.log('ERROR:', err);
        }
        else {
            console.log('Image uploaded! \n Now tweeting it...');
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