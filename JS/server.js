var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    schedule = require('node-schedule'),

    config = require('./config.js');


var T1 = new schedule.RecurrenceRule();
var T2 = new schedule.RecurrenceRule();
var T3 = new schedule.RecurrenceRule();
let min = 2
T1.minute = min;
T2.minute = min;
T3.minute = min;
T2.second = 5;
T3.second = 10;


let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
let png_posted_path = "C:\\Files\\Art\\Tweets\\Posted\\"
let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"

let iteration_time = .25; //minutes
iteration_time *= 60; //seconds
iteration_time *= 1000; //miliseconds
let master_controller = new MasterController();
var T = new Twit(config);
let palettes = Object.keys(chroma.brewer)
let counter = 0;
let tweet_path;
let tweet_image_name;

let debugging = false;
if (debugging) {

    master_controller.SetPaths(dbg_path, dbg_path)
    let palette = 'RdBu'
    let color_machine = chroma.scale(palette)
    master_controller.GenerateImage(0, color_machine);
}
else {
    let J1 = schedule.scheduleJob(T1, () => {
        master_controller.SetPaths(svg_path, png_path)
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
                let random_image_index = Math.floor(Math.random() * files.length)
                let image_name = files[random_image_index]
                tweet_path = png_path;
                tweet_image_name = image_name;
            });
        }
        catch (error) {
            console.log('error generating image..', error)
        }
    });


    let J2 = schedule.scheduleJob(T2, () => {    //send tweet

        var b64content = fs.readFileSync(tweet_path + tweet_image_name, { encoding: 'base64' });
        console.log('tweeting image from', tweet_path + tweet_image_name);
        T.post('media/upload', { media_data: b64content }, (err, data, response) => {
            if (err) {
                console.log('ERROR:', err);
            }
            else {
                console.log('Image uploaded! \n Now tweeting it...');
                T.post('statuses/update', {
                    status: tweet_image_name.replace(/\..+$/, ''),
                    media_ids: new Array(data.media_id_string)
                })
            }
        })
    });

    let J3 = schedule.scheduleJob(T3, () => {

        let current_path = png_path + tweet_image_name
        let new_path = png_posted_path + tweet_image_name
        console.log('moving', current_path, 'to', new_path)
        fs.rename(current_path, new_path, (err) => {
            if (err) console.log('ERROR: ' + err);
        });
        console.log('And now we wait...')
    });
}
// let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
// let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
// let png_posted_path = "C:\\Files\\Art\\Tweets\\Posted\\"
// let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"

// let iteration_time = .25; //minutes
// iteration_time *= 60; //seconds
// iteration_time *= 1000; //miliseconds
// let master_controller = new MasterController();
// let palettes = Object.keys(chroma.brewer)
// let counter = 0;
// let live_tweeting = false;
// if (live_tweeting) {

//     master_controller.SetPaths(dbg_path, dbg_path)
//     let palette = 'RdBu'
//     let color_machine = chroma.scale(palette)
//     master_controller.GenerateImage(0, color_machine);
// }

// var TweetImage = (img_path, image_name) => {
//     var T = new Twit(config);
//     var b64content = fs.readFileSync(img_path, { encoding: 'base64' });
//     console.log('posting image from', img_path);
//     T.post('media/upload', { media_data: b64content }, (err, data, response) => {
//         if (err) {
//             console.log('ERROR:', err);
//         }
//         else {
//             console.log('Image uploaded! \n Now tweeting it...');
//             T.post('statuses/update', {
//                 status: image_name.replace(/\..+$/, ''),
//                 media_ids: new Array(data.media_id_string)
//             },
//                 function (err, data, response) {
//                     if (err)
//                         console.log('ERROR:', err);
//                     else
//                         console.log('Posted an image!');
//                 }
//             )
//         }
//     })
// }






// // working section++++++++++++++++++++++++++++++++++++
// let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
// let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
// let png_posted_path = "C:\\Files\\Art\\Tweets\\Posted\\"
// let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"

// let iteration_time = .25; //minutes
// iteration_time *= 60; //seconds
// iteration_time *= 1000; //miliseconds
// let master_controller = new MasterController();
// let palettes = Object.keys(chroma.brewer)
// let counter = 0;
// let live_tweeting = true;
// if (live_tweeting) {
//     master_controller.SetPaths(svg_path, png_path)
//     setInterval(() => {
//         let timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19).replace(/\s/g, '_')
//         let rand_shape = Math.floor(Math.random() * 3)
//         counter = counter % palettes.length
//         let rand_palette = palettes[Math.floor(Math.random() * palettes.length)];
//         // let rand_palette = 'RdBu'
//         let color_machine = chroma.scale(rand_palette)
//         console.log('image -> shape - color - index', rand_shape, rand_palette, counter)

//         try {
//             fs.readdir(png_path, (err, files) => {
//                 master_controller.GenerateImage(rand_shape, color_machine);
//                 let random_image_index = Math.floor(Math.random() * files.length)
//                 let image_name = files[random_image_index]
//                 // console.log(files, image_name, !image_name.includes('posted'))
//                 while (image_name.includes('posted')) {
//                     random_image_index = Math.round(Math.random() * files.length)
//                     image_name = files[random_image_index]
//                 }

//                 console.log('posting tweet at ', timestamp)
//                 TweetImage(png_path + image_name, image_name);
//                 // new_image_name = image_name//.replace(/\..+$/, '_posted.png');
//                 fs.rename(png_path + image_name, png_posted_path + image_name, function (err) {
//                     if (err) console.log('ERROR: ' + err);
//                 });
//             });
//         }
//         catch (error) {
//             console.log('error generating/tweeting image..', error)
//         }
//     }, iteration_time);
// }
// else {
//     master_controller.SetPaths(dbg_path, dbg_path)
//     let palette = 'RdBu'
//     let color_machine = chroma.scale(palette)
//     master_controller.GenerateImage(0, color_machine);
// }

// var TweetImage = (img_path, image_name) => {
//     var T = new Twit(config);
//     var b64content = fs.readFileSync(img_path, { encoding: 'base64' });
//     console.log('posting image from', img_path);
//     T.post('media/upload', { media_data: b64content }, (err, data, response) => {
//         if (err) {
//             console.log('ERROR:', err);
//         }
//         else {
//             console.log('Image uploaded! \n Now tweeting it...');
//             T.post('statuses/update', {
//                 status: image_name.replace(/\..+$/, ''),
//                 media_ids: new Array(data.media_id_string)
//             },
//                 function (err, data, response) {
//                     if (err)
//                         console.log('ERROR:', err);
//                     else
//                         console.log('Posted an image!');
//                 }
//             )
//         }
//     })
// }
