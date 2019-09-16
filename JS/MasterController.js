var fs = require('fs');
var path = require('path');
var paper = require('paper-jsdom-canvas');

var fake = require('fake-words');
var svg2img = require('svg2img');
var Templates = require('./Templates.js');
var Grid = require('./Grid.js');
var ColorSequencer = require('./ColorSequencer.js');
var Shape = require('./Shape.js')


class MasterController {
    constructor() {
        this.grid_size_index = 0;
        this.image_id = ''
    }




    GenerateVitalParams() {
        let vital_params = {
            step_shape: {
                id: this.step_shape,
                name: Templates.step_shapes[this.step_shape]
            },
            rule_template: Templates.rule_templates[this.step_shape],
            grid_size: Templates.grid_sizes[this.grid_size_index],
            stroke_weights: Templates.stroke_weight_templates[this.step_shape],
            ant_count: 20,
            ant_origins_random: true,
            duration: 5000,
            color_spread: 10,
        }
        // console.log('vital_params.stroke_weights', vital_params.stroke_weights)
        return vital_params;
    }

    GenerateImage(color_machine) {
        this.color_machine = color_machine;
        console.log('generating new image...')
        this.vital_params = this.GenerateVitalParams(this.step_shape)
        let tile_width = Templates.png_dims.width / this.vital_params.grid_size.x
        let tile_height = Templates.png_dims.height / this.vital_params.grid_size.y
        this.paper_width = tile_width * this.vital_params.grid_size.x
        this.paper_height = tile_height * this.vital_params.grid_size.y
        paper.setup(new paper.Size(this.paper_width, this.paper_height))
        console.log('pre set paper')
        Shape.SetPaper(paper);
        Shape.DrawBackground()
        // this.DrawBackground(color_machine(Math.random()).hex())
        // console.log('vital params', this.vital_params)
        let grid = new Grid(this.vital_params)
        let grid_layers = grid.WalkAnts(this.vital_params.duration)
        // console.log('grid layers', grid_layers)
        this.DrawGrids(grid_layers)
        console.log('generating SVG');
        let svg = paper.project.exportSVG({
            asString: true,
            precision: 2,
            matchShapes: true,
            embedImages: false
        });
        let image_id;

        // image_id = makeid(6).toString()
        image_id = this.image_id //+ '_' + makeid(6).toString()
        // image_id += timestamp;
        console.log('IMAGE ID: ', image_id)
        this.ExportSVG(svg, image_id);
        let png_path = this.ExportPNG(svg, image_id);
        return png_path
    }

    SetPaths(svg_path, png_path) {
        this.paths = {
            svg: svg_path,
            png: png_path
        }
    }

    SetStepShape(step_shape) {
        this.step_shape = step_shape;
    }

    SetStrokeWeights(weights) {
        Templates.stroke_weight_templates[this.step_shape] = weights;
        // Templates.ant_attributes.sub_shape.stroke_weights
    }
    SetRotation(rotation) {
        Templates.ant_attributes.rotation.delta = rotation;
    }
    SetSubShapes(values) {
        Templates.ant_attributes.sub_shape.values = values
    }
    SetSubStrokeWeights(weights) {
        Templates.ant_attributes.sub_shape.stroke_weights = weights
    }



    SetGridSize(index) {
        this.grid_size_index = index;
    }

    SetImageId(image_id) {
        this.image_id = image_id
    }

    linearize_array(grid) {
        return [...grid.map(((row) => { return [...row] }))]
    }

    DrawGrids(grid) {
        // console.log('vital params', this.vital_params)
        let index = 0;
        // let current_grid = this.linearize_array(grid);

        let linear_grid = [].concat(...grid);

        for (let i = 0; i < this.vital_params.grid_size.x; i++) {
            for (let j = 0; j < this.vital_params.grid_size.y; j++) {
                let origin = {
                    x: this.paper_width / this.vital_params.grid_size.x * i,
                    y: this.paper_height / this.vital_params.grid_size.y * j
                }
                let current_grid = linear_grid[index];
                // console.log('current_grid', current_grid[index])
                // console.log('linear_grid', linear_grid)
                let grid_values = {
                    origin: origin,
                    width: this.paper_width / this.vital_params.grid_size.x,
                    color: current_grid.color,
                    sub_shape: current_grid.sub_shape,
                    stroke_weight: current_grid.stroke_weight,
                    rotation: current_grid.rotation
                }
                index++;
                let colors = this.SetColors(Templates.ant_attributes.color.style, grid_values.color)

                console.log(this.vital_params.step_shape.name == 'triangle')
                if (this.vital_params.step_shape.name == 'square')
                    Shape.DrawSquares(grid_values, colors, this.color_machine);
                if (this.vital_params.step_shape.name == 'circle')
                    Shape.DrawCircles(grid_values, colors, this.color_machine);
                if (this.vital_params.step_shape.name == 'triangle')
                    Shape.DrawTriangles(grid_values, colors, this.color_machine);
                if (this.vital_params.step_shape.name == 'cube')
                    Shape.DrawCustomShape(paper, grid_values, colors, this.color_machine);
            }
        }

    }

    SetColors(index, color_grid) {
        let colors = []
        if (index == 0) { // 
            for (let k = 0; k < color_grid.length; k++)
                colors.push(round(color_grid[k] / Templates.ant_attributes.color.max_color, 3));
        } else if (index == 1) {
            let C = new ColorSequencer()
            colors = C.NewSequence('trapped knight')
        } else {
            for (let k = 0; k < color_grid.length; k++)
                colors.push(Math.random());
        }

        //remove later, just for debugging
        for (let k = 0; k < color_grid.length; k++)
            colors.push(Math.random());
        return colors
    }



    ExportSVG(svg, image_id) {
        // let path = path.resolve("chez") // COMMENT OUT 
        let path = this.paths.svg;
        if (path.includes('Debug'))
            image_id = 'chez'
        path += (image_id + '.svg');
        fs.writeFile(path, svg, function (err) {
            if (err) throw err;
            console.log('SVG saved at', path)
        });
    }

    ExportPNG(svg, image_id) {
        let path = this.paths.png;
        path += (image_id + '.png');
        svg2img(svg, function (error, buffer) {
            fs.writeFileSync(path, buffer);
        });
        console.log('PNG saved at', path)
        return path
    }

}
module.exports = MasterController;

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // return result;

    return fake.word();
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Standard Normal variate using Box-Muller transform.
function randn_bm(min, max, skew) {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}