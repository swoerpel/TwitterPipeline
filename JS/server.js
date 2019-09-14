var fs = require('fs'),
    path = require('path'),
    fake = require('fake-words'),

    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    ParameterController = require('./ParameterController.js'),
    schedule = require('node-schedule'),
    config = require('./config.js');
const { spawn } = require('child_process')

var T1 = new schedule.RecurrenceRule();
var T2 = new schedule.RecurrenceRule();
var T3 = new schedule.RecurrenceRule();
var T4 = new schedule.RecurrenceRule();
var T5 = new schedule.RecurrenceRule();
let min = 50
T1.minute = min;
T2.minute = min;
T3.minute = min;
T4.minute = min;
T2.second = 5;
T3.second = 10;
T4.second = 15;
T5.second = 0;
var rule = new schedule.RecurrenceRule();
rule.second = 0;

let svg_path = "C:\\Files\\Art\\Tweets\\SVG\\"
let png_path = "C:\\Files\\Art\\Tweets\\PNG\\"
let combined_png_path = "C:\\Files\\Art\\Tweets\\CPNG\\"
let png_posted_path = "C:\\Files\\Art\\Tweets\\Posted\\"
let dbg_path = "C:\\Files\\Art\\Tweets\\Debug\\"
let chet_svg_path = "G:\\TwitterPipeline\\all_params_images\\SVG\\"
let chet_png_path = "G:\\TwitterPipeline\\all_params_images\\PNG\\"
let python_scripts = {
    LayerImages: 'C:\\Files\\Programming\\TwitterPipeline\\Python\\LayerImages.py',
}
// let python_path = "C:\\Files\\Programming\\TwitterPipeline\\Python\\"

let iteration_time = .5; //minutes
iteration_time *= 60; //seconds
iteration_time *= 1000; //miliseconds
var T = new Twit(config);
let palettes = Object.keys(chroma.brewer)
let counter = 0;
let tweet_path;
let tweet_image_name;
let possible_rotations = [30, 45, 60, 90, 180];
let rotation = possible_rotations[Math.floor(Math.random() * possible_rotations.length)];
// let sw = [4, 3, 2, 1];
let debugging = true;



if (debugging) {
    let PC = new ParameterController();
    let all_param_combos = PC.GenerateParams();
    // let image_count = 0;
    // let J5 = schedule.scheduleJob(rule, () => {
    let J5 = setInterval(() => { generate_image(); }, iteration_time);
    let remaining_combos = [...Array(all_param_combos.length).keys()];
    shuffleArray(remaining_combos);
    // console.log(remaining_combos)
    var generate_image = async () => {
        let i = counter;
        counter++;
        let palette = palettes[Math.floor(Math.random() * palettes.length)];
        let color_machine = chroma.scale(palette)
        console.log('parameter index', i)
        // let index = remaining_combos[counter]
        // remaining_combos.remove()
        let index = Math.floor(Math.random() * all_param_combos.length)
        let name = fake.word();
        for (let j = 0; j < 3; j++) {
            // let rand = Math.floor(Math.random() * all_param_combos.length)

            let keys = all_param_combos[index].keys
            let values = all_param_combos[index].values
            console.log('values', values)

            let image_id = keys.join('_')
            image_id = counter.toString() + '-' +
                j.toString() + '_' +
                image_id + '_' +
                palette + '_' +
                name


            console.log(image_id)
            let master_controller = new MasterController();
            master_controller.SetPaths(chet_svg_path, chet_png_path);
            master_controller.SetStepShape(j);
            master_controller.SetGridSize(1);
            master_controller.SetImageId(image_id);
            master_controller.SetStrokeWeights(values[0]);
            master_controller.SetRotation(values[1]);
            master_controller.SetSubShapes(values[2]);
            master_controller.SetSubStrokeWeights(values[3]);
            master_controller.GenerateImage(color_machine);
            // break;
            // await delay(2000)
        }
    }

    // let PC = new ParameterController();
    // let all_param_combos = PC.GenerateParams();
    // let counter = 0;
    // for (let i = 0; i < all_param_combos.length; i++) {
    //     let palette = palettes[Math.floor(Math.random() * palettes.length)];

    //     console.log('parameter index', i)
    //     for (let j = 0; j < 3; j++) {

    //         // let rand = Math.floor(Math.random() * all_param_combos.length)
    //         let keys = all_param_combos[i].keys
    //         let values = all_param_combos[i].values
    //         console.log('values', values)
    //         let color_machine = chroma.scale(palette)
    //         let image_id = keys.join('_')
    //         image_id = counter.toString() + '-' +
    //             j.toString() + '_' +
    //             image_id + '_' +
    //             palette
    //         console.log(image_id)


    //         let master_controller = new MasterController();
    //         master_controller.SetPaths(chet_svg_path, chet_png_path);
    //         master_controller.SetStepShape(j);
    //         master_controller.SetGridSize(1);
    //         master_controller.SetImageId(image_id);
    //         master_controller.SetStrokeWeights(values[0]);
    //         master_controller.SetRotation(values[1]);
    //         master_controller.SetSubShapes(values[2]);
    //         master_controller.SetSubStrokeWeights(values[3]);
    //         master_controller.GenerateImage(color_machine);
    //         // break;

    //     }
    //     break;
    // }


    // rotation = 90;
    // master_controller.SetPaths(dbg_path, dbg_path)
    // // let palette = 'RdBu'
    // let palette = palettes[Math.floor(Math.random() * palettes.length)];
    // let color_machine = chroma.scale(palette)
    // master_controller.SetStepShape(2)
    // master_controller.SetGridSize(0);
    // master_controller.SetRotation(rotation);
    // // master_controller.SetStrokeWeight(sw);
    // master_controller.GenerateImage(color_machine);

    // // python script testing

    // function runScript() {
    //     return spawn('python', [
    //         "-u",
    //         python_scripts.LayerImages,
    //         png_path, combined_png_path,
    //     ]);
    // }
    // const subprocess = runScript()

    // subprocess.stdout.on('data', (data) => {
    //     console.log(`data:${data}`);
    // });
    // subprocess.stderr.on('data', (data) => {
    //     console.log(`error:${data}`);
    // });
    // subprocess.stderr.on('close', () => {
    //     console.log("Closed");
    // });


}
else {
    let master_controller = new MasterController();

    let J1 = schedule.scheduleJob(T1, () => {
        rotation = possible_rotations[Math.floor(Math.random() * possible_rotations.length)];
        let rand_shape = Math.floor(Math.random() * 3)
        let rand_grid = Math.floor(Math.random() * 3)
        master_controller.SetPaths(svg_path, png_path)
        master_controller.SetRotation(rotation);
        master_controller.SetStepShape(rand_shape)
        master_controller.SetGridSize(rand_grid);
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
        function runScript() {
            return spawn('python', [
                "-u",
                python_scripts.LayerImages,
                png_path,
                combined_png_path,
            ]);
        }
        const subprocess = runScript()

        subprocess.stdout.on('data', (data) => {
            console.log(`data:${data}`);
        });
        subprocess.stderr.on('data', (data) => {
            console.log(`error:${data}`);
        });
        subprocess.stderr.on('close', () => {
            console.log("Closed");
        });

    });

    let J3 = schedule.scheduleJob(T3, () => {    //send tweet

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

    let J4 = schedule.scheduleJob(T4, () => {

        let current_path = png_path + tweet_image_name
        let new_path = png_posted_path + tweet_image_name
        console.log('moving', current_path, 'to', new_path)
        fs.rename(current_path, new_path, (err) => {
            if (err) console.log('ERROR: ' + err);
        });
        console.log('And now we wait...', '\n')
    });
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}