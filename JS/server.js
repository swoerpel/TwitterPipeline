var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    schedule = require('node-schedule'),
    // { PythonShell } = require('python-shell'),
    config = require('./config.js');


var T1 = new schedule.RecurrenceRule();
var T2 = new schedule.RecurrenceRule();
var T3 = new schedule.RecurrenceRule();
var T4 = new schedule.RecurrenceRule();
let min = 57
T1.minute = min;
T2.minute = min;
T3.minute = min;
T4.minute = min;
T2.second = 5;
T3.second = 10;
T4.second = 15;


let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
let png_posted_path = "C:\\Files\\Art\\Tweets\\Posted\\"
let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"

// let python_path = "C:\\Files\\Programming\\TwitterPipeline\\Python\\"

let iteration_time = .5; //minutes
iteration_time *= 60; //seconds
iteration_time *= 1000; //miliseconds
let master_controller = new MasterController();
var T = new Twit(config);
let palettes = Object.keys(chroma.brewer)
let counter = 0;
let tweet_path;
let tweet_image_name;
let rotation = 45;
let sw = [4, 3, 2, 1, .5]
let debugging = true;
if (debugging) {
    // for (let i = 0; i < 50; i++)
    // console.log(bandname())
    master_controller.SetPaths(dbg_path, dbg_path)
    // let palette = 'RdBu'
    let palette = palettes[Math.floor(Math.random() * palettes.length)];
    let color_machine = chroma.scale(palette)

    master_controller.SetRotation(rotation);
    master_controller.SetStepShape(2)
    master_controller.SetStrokeWeight(sw);
    master_controller.GenerateImage(color_machine);




    var spawn = require('child_process').spawn,
        py = spawn('python', ['ApplyMask.py']),
        data = [1, 2, 3, 4, 5, 6, 7, 8, 9],
        dataString = '';

    py.stdout.on('data', function (data) {
        dataString += data.toString();
    });
    py.stdout.on('end', function () {
        console.log('Sum of numbers=', dataString);
    });
    py.stdin.write(JSON.stringify(data));
    py.stdin.end();

    // let chet = PythonShell.run("C:\\Files\\Programming\\TwitterPipeline\\Python\\ApplyMask.py", function (err) {
    //     if (err) throw err;
    //     console.log('finished');
    // });

    // console.log('spawn child')
    // const spawn = require("child_process").spawn;

    // const pythonProcess = spawn('python', ["C:\\Files\\Programming\\TwitterPipeline\\Python\\ApplyMask.py"])
    // console.log('pythonProcess!', pythonProcess)
    // console.log('start listening')
    // let loop = true;
    // while (loop) {
    //     pythonProcess.stdout.on('data', (data) => {
    //         // Do something with the data returned from python script
    //         console.log('server.JS', data)
    //         loop = false;
    //     });
    // }
}
else {
    let J1 = schedule.scheduleJob(T1, () => {
        let rand_shape = Math.floor(Math.random() * 3)
        master_controller.SetPaths(svg_path, png_path)
        master_controller.SetRotation(rotation);
        master_controller.SetStepShape(rand_shape)
        // master_controller.SetStrokeWeight(sw);
        let timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19).replace(/\s/g, '_')

        counter = counter % palettes.length
        let rand_palette = palettes[Math.floor(Math.random() * palettes.length)];
        // let rand_palette = 'RdBu'
        let color_machine = chroma.scale(rand_palette)
        console.log('timestamp -', timestamp)
        console.log('image -> shape - color - index', rand_shape, rand_palette, counter)


        try {
            fs.readdir(png_path, (err, files) => {
                master_controller.GenerateImage(color_machine);
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

    let J2 = schedule.scheduleJob(T2, () => {    //call Python Scripts
        var spawn = require('child_process').spawn,
            py = spawn('python', ['ApplyMask.py']),
            data = [1, 2, 3, 4, 5, 6, 7, 8, 9],
            dataString = '';

        py.stdout.on('data', function (data) {
            dataString += data.toString();
        });
        py.stdout.on('end', function () {
            console.log('Sum of numbers=', dataString);
        });
        py.stdin.write(JSON.stringify(data));
        py.stdin.end();

    });

    let J3 = schedule.scheduleJob(T2, () => {    //send tweet

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

    let J4 = schedule.scheduleJob(T3, () => {

        let current_path = png_path + tweet_image_name
        let new_path = png_posted_path + tweet_image_name
        console.log('moving', current_path, 'to', new_path)
        fs.rename(current_path, new_path, (err) => {
            if (err) console.log('ERROR: ' + err);
        });
        console.log('And now we wait...', '\n')
    });
}