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

    DrawGrids(grid) {
        let index = 0;
        let linear_grid = [].concat(...grid);
        console.log(linear_grid, '-> linear_grid')
        console.log(grid, '-> regular_grid')

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

                if (this.vital_params.step_shape.name == 'square')
                    this.DrawSquares(index, grid_values, colors);
                if (this.vital_params.step_shape.name == 'circle')
                    this.DrawCircles(index, grid_values, colors);
                if (this.vital_params.step_shape.name == 'triangle')
                    this.DrawTriangles(index, grid_values, colors);
                if (this.vital_params.step_shape.name == 'cube')
                    this.DrawCubes(index, grid_values, colors);
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

    DrawSquares(index, grid_values, colors) {
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

    DrawCircles(index, grid_values, colors) {
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

    DrawTriangles(index, grid_values, colors) {
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
    DrawCubes(index, grid_values, colors) {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius / 2
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius / 2
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let origin_circle = new paper.Path.Circle(local_origin, radius)
                // origin_circle.fillColor = 'black'
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;

                let group = createBlock(radius);

                // var length = Math.min(count + values.amount, group.children.length);
                // for (var i = count; i < length; i++) {
                let piece = group.children[l];
                var hexagon = piece.children[0];
                let color = colors[Math.floor(Math.random() * colors.length)]
                hexagon.fillColor = color;
                var top = piece.children[1];
                top.fillColor = color.clone();
                top.fillColor.brightness *= 1.5;

                var right = piece.children[2];
                right.fillColor = color.clone();
                right.fillColor.brightness *= 0.5;

                // let base_triangle = new paper.Path();
                // base_triangle.strokeWidth = 0
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                // base_triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                // grid_values.rotation.sort(() => Math.random() - 0.5)
                // grid_values.rotation.map((rot) => {
                //     concentric_sub_stroke_weights.map((sw) => {
                //         local_radius = radius * sw
                //         let triangle = new paper.Path();
                //         triangle.strokeWidth = 0
                //         triangle.fillColor = this.color_machine(Math.random()).hex();
                //         triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                //         triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                //         triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                //         let color_val = colors[Math.floor(Math.random() * colors.length)]
                //         triangle.fillColor = this.color_machine(color_val).hex();
                //         triangle.rotate(rot, local_origin)

                //     });
                // });
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

function createBlock(radius) {
    var group = new paper.Group();
    var hexagon = new paper.Path.RegularPolygon({
        center: paper.view.center,
        sides: 6,
        radius: radius,
        fillColor: 'gray',
        parent: group
    });
    for (var i = 0; i < 2; i++) {
        var path = new paper.Path({
            closed: true,
            parent: group,
            fillColor: i == 0 ? 'white' : 'black'
        });
        for (var j = 0; j < 3; j++) {
            var index = (i * 2 + j) % hexagon.segments.length;
            path.add(hexagon.segments[index].clone());
        }
        path.add(hexagon.bounds.center);
    }
    // Remove the group from the document, so it is not drawn:
    group.remove();
    return group;
}


// var Cube = function (position, size, colour, rotate_speed, stroke_width) {
//     this.stroke_width = stroke_width;
//     this.rotate_speed = rotate_speed;
//     this.init(position, size, colour);
//     this.connectCubes(this.rect, this.rect2);
// }

// Cube.prototype.init = function (position, size, colour) {
//     this.colour = colour;
//     this.connects = new Array();
//     this.rect = new paper.Path.Rectangle(position, size);
//     this.rect.strokeColor = colour;
//     this.rect.strokeWidth = this.stroke_width;
//     this.rect2 = new paper.Path.Rectangle(new paper.Point(position.x + (Math.random() / 2 * size), position.y - (Math.random() / 2 * size)), size);
//     this.rect2.strokeColor = colour;
//     this.rect2.strokeWidth = this.stroke_width;
// };

// Cube.prototype.connectCubes = function (rect1, rect2) {
//     for (var i = rect1.segments.length - 1; i >= 0; i--) {
//         var connect = new paper.Path.Line(rect1.segments[i].point, rect2.segments[i].point);
//         connect.strokeColor = this.colour;
//         connect.strokeWidth = this.stroke_width;
//         this.connects.push(connect);
//     };
// }

// Cube.prototype.clearConnects = function () {
//     for (var i = this.connects.length - 1; i >= 0; i--) {
//         this.connects[i].remove();
//     };
// };



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