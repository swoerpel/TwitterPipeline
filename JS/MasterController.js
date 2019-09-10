var fs = require('fs');
var path = require('path');
var paper = require('paper-jsdom-canvas');
var chroma = require('chroma-js');
var Templates = require('./Templates.js');
var Grid = require('./Grid.js');
var svg2img = require('svg2img');
var btoa = require('btoa');
class MasterController {
    constructor() {
        this.paper_width = 2400
        this.paper_height = 2400
        paper.setup(new paper.Size(this.paper_width, this.paper_height))

        // this.color_machine = chroma.scale(chroma.brewer.Greys)
        this.color_machine = chroma.scale('RdBu')
        // this.color_machine = chroma.scale('Spectrcon')
    }

    ExportSVG(relative_path) {
        relative_path = path.resolve("chez") // COMMENT OUT 
        console.log('generating SVG');
        let svg = paper.project.exportSVG({
            asString: true,
            precision: 2,
            matchShapes: true,
            embedImages: false
        });
        console.log('path', relative_path)
        fs.writeFile(relative_path + '.svg', svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        return svg
    }

    ExportPNG(svg, relative_path) {
        console.log(relative_path, ' -> img path')
        svg2img(svg, function (error, buffer) {
            fs.writeFileSync(relative_path + '.png', buffer);
        });

    }

    GenerateImage(step_shape) {
        console.log('generating image...')
        this.vital_params = this.GenerateVitalParams(step_shape)
        console.log('vital params', this.vital_params)
        let grid = new Grid(this.vital_params)
        let grid_layers = grid.WalkAnts(this.vital_params.duration)
        // console.log('grid layers', grid_layers)
        this.DrawGrids(grid_layers)

        let image_id = makeid(6).toString()
        console.log('IMAGE ID: ', image_id)
        // let relative_path = path.resolve('../images/')
        let relative_path = path.resolve("../debug_images/")
        let svg = this.ExportSVG(relative_path + image_id);
        this.ExportPNG(svg, relative_path + '\\' + image_id);
        return relative_path
    }

    DrawGrids(grid) {
        console.log('vital params', this.vital_params)
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

                if (this.vital_params.step_shape.name == 'square')
                    this.DrawSquares(grid_values);
                // if (this.vital_params.step_shape.name == 'circle')
                //     this.DrawCircles(grid_values);
                // if (this.vital_params.step_shape.name == 'triangle')
                //     this.DrawTriangles(grid_values);
            }
        }
    }

    DrawSquares(grid_values) {
        let colors = [];
        for (let i = 0; i < grid_values.color.length; i++) {
            colors.push(round(grid_values.color[i] / Templates.ant_attributes.color.max_color, 3));
        }
        // console.log('scaled colors', colors);
        // colors = colors.sort()
        // let color_ranges = colors.map((c) => { return [c, 1 - c] })//Math.max(...colors) - Math.min(...colors);

        // console.log('color ranges ->', color_ranges)
        // let color_step = colors[0] / (grid_values.sub_shape - 1);
        // let available_colors = [];

        // // console.log(round(color_ranges, 3), 'color ranges')
        // console.log(round(color_step, 3), 'color step')
        // for (let i = 0; i < grid_values.sub_shape; i++) {
        //     // console.log('new color', i)
        //     console.log(colors[0], 'color value')
        //     console.log(colors[0] + (i) * color_step, 'pushed color')
        //     available_colors.push(colors[0] + (i) * color_step)
        // }
        // console.log('ordered colors', available_colors, grid_values.sub_shape, color_step, color_range)
        // available_colors = available_colors.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);

        // console.log('shuffled colors', available_colors)
        let count = 0;
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                let size = new paper.Size(grid_values.width / grid_values.sub_shape, grid_values.width / grid_values.sub_shape);
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1) {
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                } else {
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;
                }
                concentric_sub_stroke_weights.map((sw, index) => {
                    let con_size = new paper.Size(size.width, size.height);
                    let concentric_square = new paper.Path.Rectangle(local_origin, con_size);
                    let color_val = randn_bm(0, 1, colors[count % colors.length])
                    count++;
                    console.log(color_val, 'CV')
                    concentric_square.fillColor = this.color_machine(
                        color_val
                    ).hex();
                    concentric_square.scale(sw, concentric_square.bounds.center);
                });
            }
        }
    }

    DrawCircles(grid_values) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                let circle = new paper.Path.Circle(local_origin, radius);
                circle.fillColor = this.color_machine(Math.random()).hex();
                let concentric_sub_stroke_weights = grid_values.stroke_weight;
                if (grid_values.sub_shape != 1)
                    concentric_sub_stroke_weights = Templates.ant_attribute_templates[0].sub_shape.stroke_weights
                concentric_sub_stroke_weights.map((sw) => {
                    let concentric_circle = new paper.Path.Circle(local_origin, radius);

                    concentric_circle.fillColor = this.color_machine(
                        Math.random()// * grid_values.color
                    ).hex();
                    concentric_circle.scale(sw, concentric_circle.bounds.center);
                });

            }
        }
    }

    DrawTriangles(grid_values) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let origin_circle = new paper.Path.Circle(local_origin, radius)
                // origin_circle.fillColor = 'black'
                let concentric_sub_stroke_weights = grid_values.stroke_weight;
                if (grid_values.sub_shape != 1)
                    concentric_sub_stroke_weights = Templates.ant_attribute_templates[0].sub_shape.stroke_weights

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
                        triangle.rotate(rot, local_origin)

                    });
                });
            }
        }
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
            ant_count: 5,
            ant_origins_random: true,
            duration: 5000,
        }
        // console.log('vital_params.stroke_weights', vital_params.stroke_weights)
        return vital_params;
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
    return result;
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