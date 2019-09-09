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
        this.paper_width = 2400 * 2
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
        this.DrawGrids(grid_layers)
        let image_id = makeid(6).toString()
        console.log('IMAGE ID: ', image_id)
        // let relative_path = path.resolve('../images/')
        let relative_path = path.resolve("../debug_images/")
        let svg = this.ExportSVG(relative_path + image_id);
        this.ExportPNG(svg, relative_path + '\\' + image_id);
        return relative_path
    }

    DrawGrids(grid_layers) {
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
                    color: grid_layers.color[i][j],
                    sub_shape: grid_layers.sub_shape[i][j],
                    stroke_weight: grid_layers.stroke_weight[i][j],
                    rotation: grid_layers.rotation[i][j]
                }
                if (this.vital_params.step_shape.name == 'square')
                    this.DrawSquares(grid_values);
                if (this.vital_params.step_shape.name == 'circle')
                    this.DrawCircles(grid_values);
                if (this.vital_params.step_shape.name == 'triangle')
                    this.DrawTriangles(grid_values);
            }
        }
    }

    DrawSquares(grid_values) {

        let color_ceil = round(grid_values.color / Templates.ant_attribute_templates[0].color.color_count, 3)// / grid_values.sub_shape;
        let color_inc = round(color_ceil / grid_values.sub_shape, 3)
        let color_count = 0;
        console.log('color ceiling - color inc - grid_values.color')
        console.log(color_ceil, color_inc, grid_values.color)
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                let size = new paper.Size(grid_values.width / grid_values.sub_shape, grid_values.width / grid_values.sub_shape);
                // let square = new paper.Path.Rectangle(local_origin, size);
                // square.fillColor = this.color_machine(Math.random()).hex();
                let concentric_sub_stroke_weights = grid_values.stroke_weight;
                if (grid_values.sub_shape != 1)
                    concentric_sub_stroke_weights = Templates.ant_attribute_templates[0].sub_shape.stroke_weights;
                concentric_sub_stroke_weights.map((sw, index) => {
                    let con_size = new paper.Size(size.width, size.height);
                    let concentric_square = new paper.Path.Rectangle(local_origin, con_size);
                    concentric_square.fillColor = this.color_machine(
                        // Math.random()// * grid_values.color
                        // grid_values.color
                        (color_count + 1) * color_inc
                    ).hex();
                    color_count++;
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
            duration: 1000,
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