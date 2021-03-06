var fs = require('fs'),
    path = require('path'),
    fake = require('fake-words'),
    Twit = require('twit'),
    chroma = require('chroma-js'),
    MasterController = require('./MasterController.js'),
    ParameterController = require('./ParameterController.js'),
    mask = require('./MaskGenerator.js'),
    schedule = require('node-schedule'),
    config = require('./config.js');

var chet_colors = {


    Diamond: ["#87afa1",
        "#53eca6",
        "#576f6a",
        "#68e7d7",
        "#346d5a",
        "#b5e4d0",
        "#289365",
        "#4fb2a5",
        "#57c897",
        "#539178"],

    DarkOcean: ["#295666",
        "#002a33",
        "#387390",
        "#002a33",
        "#143b44",
        "#002a33",
        "#002a33",
        "#002a33",
        "#002a33",
        "#002a33"],
}



const { spawn } = require('child_process')

var T1 = new schedule.RecurrenceRule();
var T2 = new schedule.RecurrenceRule();
var T3 = new schedule.RecurrenceRule();
var T4 = new schedule.RecurrenceRule();
var T5 = new schedule.RecurrenceRule();
let min = 34
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
let dbg_path_png = "G:\\TwitterPipeline\\Debug\\"
// let dbg_path_png = "C:\\Files\\Art\\Tweets\\Debug\\"
let dbg_path_svg = "G:\\TwitterPipeline\\Debug\\"
// let dbg_path_svg = "C:\\Files\\Art\\Tweets\\Debug\\"
let chet_svg_path = "G:\\TwitterPipeline\\all_params_images\\SVG\\"
let chet_png_path = "G:\\TwitterPipeline\\all_params_images\\PNG\\"



let layer_masks_paths = {
    squares: "G:\\TwitterPipeline\\Layered\\Masks\\Squares\\",
    circles: "G:\\TwitterPipeline\\Layered\\Masks\\Circles\\",
    triangles: "G:\\TwitterPipeline\\Layered\\Masks\\Triangles\\",
    custom: "G:\\TwitterPipeline\\Layered\\Masks\\Custom\\",
    letters: "G:\\TwitterPipeline\\Layered\\Masks\\Letters\\",
    full: "G:\\TwitterPipeline\\Layered\\Masks\\Full\\",
}

// let layer_images_path = "G:\\TwitterPipeline\\Layered\\Layers\\"
let layer_images_path = "G:\\TwitterPipeline\\Layered\\Layers\\"
let layer_composites_path = "G:\\TwitterPipeline\\Layered\\Composites\\"
let python_scripts = {
    LayerImages: 'C:\\Files\\Programming\\TwitterPipeline\\Python\\LayerImages.py',
}
// let python_path = "C:\\Files\\Programming\\TwitterPipeline\\Python\\"



let palettes = Object.keys(chroma.brewer)
let counter = 0;
let tweet_path;
let tweet_image_name;
let possible_rotations = [30, 45, 60, 90, 180];
let rotation = possible_rotations[Math.floor(Math.random() * possible_rotations.length)];
// let sw = [4, 3, 2, 1];

var generate_image = async (params) => {

    let color_machine = chroma.scale(params.palette)
    // let image_id = fake.word();
    let master_controller = new MasterController();
    master_controller.SetPaths(params.paths.svg, params.paths.png);
    master_controller.SetStepShape(params.step_shape);
    master_controller.SetStepPath(params.step_path);
    master_controller.SetColorPath(params.color_path);
    master_controller.SetGridScale(params.grid_scale);
    master_controller.SetGridSize(params.grid_size);
    master_controller.SetImageId(params.image_id);
    master_controller.SetStrokeWeights(params.stroke_weights);
    master_controller.SetRotation(params.rotation);
    master_controller.SetSubShapes(params.sub_shapes);
    master_controller.SetSubStrokeWeights(params.sub_stroke_weights);
    master_controller.GenerateImage(color_machine);
}

// let mode = 'debug';
let mode = 'single';
// let mode = 'batch';

let mask_mode = true;
// let mask_mode = false;


if (mode == 'debug') {

    function runScript() {
        console.log('layer mask paths', layer_masks_paths)
        let composite_name = fake.word() + fake.word() + fake.word() + '.png'
        let layer_params = {
            top_step_shape: 2,
            top_grid_size: 1,
            bottom_step_shape: 1,
            bottom_grid_size: 1,
        }

        let color_params = {
            // top_image: palettes[Math.floor(Math.random() * palettes.length)],
            // bottom_image: palettes[Math.floor(Math.random() * palettes.length)],
            top_image: 'set1',
            bottom_image: 'set1',
            invert: 'top'
        }

        let mask_params = {
            // mask_name must be '' if custom is not selected
            mask_type: 'full',
            mask_name: 'm3'
        }

        return spawn('python', [
            "-u",
            python_scripts.LayerImages,
            JSON.stringify(layer_masks_paths),
            layer_images_path,
            layer_composites_path,
            composite_name,
            JSON.stringify(layer_params),
            JSON.stringify(color_params),
            JSON.stringify(mask_params),
        ]);
    }
    const subprocess = runScript()
    // runScript()
    // runScript()
    // runScript()
    // runScript()


    subprocess.stdout.on('data', (data) => {
        console.log(`data:${data}`);
    });
    subprocess.stderr.on('data', (data) => {
        console.log(`error:${data}`);
    });
    subprocess.stderr.on('close', () => {
        console.log("Closed");
    });


}
else if (mode == 'single') {
    //greens
    palettes.push(['#32CD32', '#006400', '#808000', '#6B8E23', '#ADFF2F'])
    palettes.push(["#780116",
        "#F7B538",
        "#DB7C26",
        "#D8572A",
        "#C32F27"])
    let params = {
        paths: {
            svg: dbg_path_svg,
            png: dbg_path_png,
        },
        step_shape: 3,
        step_path: 1, // overlap order path
        color_path: 2, // color sequence path
        grid_scale: { x: 1, y: 1 },
        grid_size: 1,
        // palette: palettes[palettes.length - 1],
        // palette: palettes[Math.floor(Math.random() * palettes.length)],
        palette: 'Spectral',
        image_id: fake.word() + fake.word(),
        stroke_weights: [1],
        rotation: 0,
        sub_shapes: [1],
        sub_stroke_weights: [1],
    }
    generate_image(params);
}
else if (mode == 'batch') {
    let iteration_time = .25; //minutes
    iteration_time *= 60; //seconds
    iteration_time *= 1000; //miliseconds

    let index = 0;
    let J5 = setInterval(() => {
        let palette = palettes[Math.floor(Math.random() * palettes.length)]
        let step_path = Math.floor(Math.random() * 4)
        let color_path = Math.floor(Math.random() * 4)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {

                let stroke_weights = [1, .9, .8, .7, .6, .5]
                if (i != 1) { // triangles overlap better
                    stroke_weights = [2, 1, .75, .5]
                }
                let params = {
                    paths: {
                        svg: dbg_path_svg,
                        png: layer_images_path,
                    },
                    step_shape: i,
                    step_path: step_path, // overlap order path
                    color_path: color_path, // color sequence path
                    grid_scale: { x: 1, y: 1 },
                    grid_size: j,
                    palette: palette,
                    image_id: 'SHAPE-' + i.toString() + '_GRID-' + j.toString() + '_' + palette + '_' + Math.round(Math.random() * 100).toString(),
                    stroke_weights: stroke_weights,
                    rotation: 90,
                    sub_shapes: [1, 2],
                    sub_stroke_weights: [1, .5],
                }
                generate_image(params);
            }
        }

    }, iteration_time);
    // let PC = new ParameterController();
    // let all_param_combos = PC.GenerateParams();
    // let J5 = setInterval(() => {
    //     let index = Math.floor(Math.random() * all_param_combos.length)
    //     let keys = all_param_combos[index].keys
    //     let values = all_param_combos[index].values

    //     let palette = palettes[Math.floor(Math.random() * palettes.length)];

    //     generate_image_batch(keys, values, palette);
    // }, iteration_time);

}
else if (mode == 'twitter') {
    var T = new Twit(config);
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

var generate_image_batch = async (keys, values, palette) => {
    counter++;
    let name = fake.word();
    let base_id = keys.join('_');
    let id_params = [
        counter,
        name,
        base_id
    ]
    console.log('values ->', values, 'colors ->', palette)
    let params = {
        paths: {
            svg: chet_svg_path,
            png: chet_png_path,
        },
        step_shape: 0,
        grid_scale: { x: 1, y: 1 },
        grid_size: 1,
        palette: palette,
        image_id: generate_id(id_params, 0),
        stroke_weights: values[0],
        rotation: values[1],
        sub_shapes: values[2],
        sub_stroke_weights: values[3],
    }
    generate_image(params);
    params.step_shape = 1;
    params.image_id = generate_id(id_params, 1)
    generate_image(params);
    params.step_shape = 2;
    params.image_id = generate_id(id_params, 2)
    generate_image(params);
}

var generate_id = (id_params, step_shape) => {
    let image_id = '';
    id_params.map((ele) => {
        image_id += (ele.toString() + '_');
    });
    image_id += step_shape.toString()
    return image_id;
}