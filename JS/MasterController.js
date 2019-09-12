var fs = require('fs');
var path = require('path');
var paper = require('paper-jsdom-canvas');
var fake = require('fake-words');
var svg2img = require('svg2img');
var Templates = require('./Templates.js');
var Grid = require('./Grid.js');
var ColorSequencer = require('./ColorSequencer.js');


class MasterController {
    constructor() {

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

    GenerateVitalParams(step_shape) {
        let vital_params = {
            step_shape: {
                id: step_shape,
                name: Templates.step_shapes[step_shape]
            },
            rule_template: Templates.rule_templates[step_shape],
            grid_size: Templates.grid_sizes[1],
            stroke_weights: Templates.stroke_weight_templates[step_shape],
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
        this.paper_width = 600 * this.vital_params.grid_size.x
        this.paper_height = 600 * this.vital_params.grid_size.y
        paper.setup(new paper.Size(this.paper_width, this.paper_height))
        this.DrawBackground()
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
        let image_id = makeid(6).toString()
        // image_id += timestamp;
        console.log('IMAGE ID: ', image_id)
        this.ExportSVG(svg, image_id);
        let png_path = this.ExportPNG(svg, image_id);
        return png_path
    }



    SetRotation(rotation) {
        Templates.ant_attributes.rotation.delta = rotation;
    }

    SetStrokeWeight(sw) {
        Templates.stroke_weight_templates[0] = sw;
    }
    DrawGrids(grid) {
        // console.log('vital params', this.vital_params)
        for (let i = 0; i < this.vital_params.grid_size.x; i++) {
            for (let j = 0; j < this.vital_params.grid_size.y; j++) {
                let origin = {
                    x: this.paper_width / this.vital_params.grid_size.x * i,
                    y: this.paper_height / this.vital_params.grid_size.y * j
                }
                let grid_values = {
                    origin: origin,
                    width: this.paper_width / this.vital_params.grid_size.x,
                    color: grid[i][j].color,
                    sub_shape: grid[i][j].sub_shape,
                    stroke_weight: grid[i][j].stroke_weight,
                    rotation: grid[i][j].rotation
                }
                let colors = this.SetColors(Templates.ant_attributes.color.style, grid_values.color)

                if (this.vital_params.step_shape.name == 'square')
                    this.DrawSquares(grid_values, colors);
                if (this.vital_params.step_shape.name == 'circle')
                    this.DrawCircles(grid_values, colors);
                if (this.vital_params.step_shape.name == 'triangle')
                    this.DrawTriangles(grid_values, colors);
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

    DrawSquares(grid_values, colors) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                let size = new paper.Size(grid_values.width / grid_values.sub_shape, grid_values.width / grid_values.sub_shape);
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;

                concentric_sub_stroke_weights.map((sw, index) => {
                    let con_size = new paper.Size(size.width, size.height);
                    let concentric_square = new paper.Path.Rectangle(local_origin, con_size);
                    let color_val = colors[Math.floor(Math.random() * colors.length)]
                    concentric_square.fillColor = this.color_machine(color_val).hex();
                    concentric_square.scale(sw, concentric_square.bounds.center);
                });
            }
        }
    }

    DrawCircles(grid_values, colors) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let circle = new paper.Path.Circle(local_origin, radius);
                // circle.fillColor = this.color_machine(Math.random()).hex();
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;
                concentric_sub_stroke_weights.map((sw) => {
                    let concentric_circle = new paper.Path.Circle(local_origin, radius);
                    let color_val = colors[Math.floor(Math.random() * colors.length)]
                    concentric_circle.fillColor = this.color_machine(color_val).hex();
                    concentric_circle.scale(sw, concentric_circle.bounds.center);
                });
            }
        }
    }

    DrawTriangles(grid_values, colors) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let origin_circle = new paper.Path.Circle(local_origin, radius)
                // origin_circle.fillColor = 'black'
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;
                let local_radius = radius
                // let base_triangle = new paper.Path();
                // base_triangle.strokeWidth = 0
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                // base_triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                grid_values.rotation.sort(() => Math.random() - 0.5)
                grid_values.rotation.map((rot) => {
                    concentric_sub_stroke_weights.map((sw) => {
                        local_radius = radius * sw
                        let triangle = new paper.Path();
                        triangle.strokeWidth = 0
                        triangle.fillColor = this.color_machine(Math.random()).hex();
                        triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                        triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                        triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                        let color_val = colors[Math.floor(Math.random() * colors.length)]
                        triangle.fillColor = this.color_machine(color_val).hex();
                        triangle.rotate(rot, local_origin)

                    });
                });
            }
        }
    }

    DrawBackground(color = 'black') {
        var rect = new paper.Path.Rectangle({
            point: [0, 0],
            size: [paper.view.size.width, paper.view.size.height],
            strokeColor: 'black',
            selected: true
        });
        rect.sendToBack();
        rect.fillColor = color;
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