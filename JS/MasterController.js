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
        this.color_machine = chroma.scale('Spectral')
    }

    GenerateImage(step_shape) {
        console.log('generating image...')
        this.vital_params = this.GenerateVitalParams(step_shape)
        console.log('vital params', this.vital_params)
        let grid = new Grid(this.vital_params)
        let grid_layers = grid.WalkAnts(this.vital_params.duration)
        this.DrawGrids(grid_layers)
        return this.image_id
        // time to draw shapes according to shape type
        // and values present in all output grids
    }

    DrawCircle(grid_layers) {
        let stroke_weight = grid_layers.stroke_weight[i][j] * this.paper_width / this.vital_params.grid_size.x
        let scaled_x = this.paper_width / this.vital_params.grid_size.x * i + stroke_weight / 2;
        let scaled_y = this.paper_height / this.vital_params.grid_size.y * j + stroke_weight / 2;
        console.log(i, j, scaled_x, scaled_y);
        let topleft = new paper.Point(scaled_x, scaled_y);
        // let rect_size = new paper.Size(stroke_weight, stroke_weight);
        // let squarePath = new paper.Path.Rectangle(topleft, rect_size)
        console.log('color val', grid_layers.color[i][j] / 100);

        // squarePath.fillColor = this.color_machine(grid_layers.color[i][j] / 100).hex()
        // var circle = new paper.Path.Circle({
        //     center: [scaled_x, scaled_y],
        //     radius: stroke_weight / 2,
        //     fillRule: 'evenodd',
        //     fillColor: this.color_machine(grid_layers.color[i][j] / 100).hex()
        // })
        let circle = new paper.Path.Circle(topleft, stroke_weight / 2);
        circle.selected = true;
        // circle.removeSegment(0);
        circle.fillColor = this.color_machine(grid_layers.color[i][j] / 100).hex()
        // circle.opacity = 0.5
        // circle.fillColor = 
    }

    DrawGrids(grid_layers) {
        // console.log('grid layers', grid_layers)
        console.log('vital params', this.vital_params)
        // let rect_size = new paper.Size(2000, 120);
        for (let i = 0; i < this.vital_params.grid_size.x; i++) {
            for (let j = 0; j < this.vital_params.grid_size.y; j++) {
                if (this.vital_params.step_shape.name == 'square') {
                    let default_width = this.paper_width / this.vital_params.grid_size.x
                    let x_origin = this.paper_width / this.vital_params.grid_size.x * i
                    let y_origin = this.paper_height / this.vital_params.grid_size.y * j
                    let sub_shape_value = grid_layers.sub_shape[i][j]


                    //when sub shape value is not 1
                    //concentric smaller shapes take over
                    if (sub_shape_value != 1) {
                        let sub_shape_group = new paper.Group()
                        for (let k = 0; k < sub_shape_value; k++) {
                            for (let l = 0; l < sub_shape_value; l++) {
                                let x_local_origin = x_origin + default_width / sub_shape_value * k
                                let y_local_origin = y_origin + default_width / sub_shape_value * l
                                let origin = new paper.Point(x_local_origin, y_local_origin);
                                let size = new paper.Size(default_width / sub_shape_value, default_width / sub_shape_value);
                                let rect = new paper.Path.Rectangle(origin, size);
                                rect.fillColor = this.color_machine(Math.random()).hex();
                                // rect.fillColor = this.color_machine(grid_layers.color[i][j] / 100 / sub_shape_value * k * l).hex();
                                sub_shape_group.addChild(rect)
                                console.log(sub_shape_value, ' && local subshape origin && ', x_local_origin, y_local_origin)
                            }
                        }
                    }
                    else {
                        // console.log('concentric dimishing shape size', grid_layers.stroke_weight)
                        let concentric_stroke_weights = grid_layers.stroke_weight[i][j]
                        // console.log('sub_widths', sub_widths)
                        let origin = new paper.Point(x_origin, y_origin);

                        concentric_stroke_weights.map((sw, index) => {
                            let size = new paper.Size(default_width, default_width);
                            let rect = new paper.Path.Rectangle(origin, size);
                            rect.fillColor = this.color_machine(
                                (index / concentric_stroke_weights.length) *
                                (grid_layers.color[i][j] / 15)
                            ).hex();
                            rect.scale(sw, rect.bounds.center);
                        });

                    }
                    // console.log('stroke weight grid layer', grid_layers.stroke_weight[i][j])
                    // console.log('def width', default_width)
                    // let scaled_x = 0//this.paper_width / this.vital_params.grid_size.x * i
                    // let scaled_y = 0//this.paper_height / this.vital_params.grid_size.y * j


                    // console.log(i, j, scaled_x, scaled_y, 'stroke_weight->', stroke_weight)
                    // let square_len = default_width * stroke_weights[0]
                    // x_origin += square_len / 2
                    // y_origin += square_len / 2
                    // let size = new paper.Size(square_len, square_len);

                    // let origin = new paper.Point(x_origin, y_origin);
                    // let color = this.color_machine().hex();

                    // console.log('stroke weight', stroke_weights.sort().reverse())
                    // stroke_weights = stroke_weights.reverse()
                    // stroke_weights.map((sw, index) => {
                    // let size = new paper.Size(default_width, default_width);
                    // let rect = new paper.Path.Rectangle(origin, size);
                    // rect.strokeWidth = 0;
                    // rect.fillColor = this.color_machine(grid_layers.color[i][j] / 100).hex();
                    // rect.scale(sw, rect.bounds.center);
                    // });



                }
                if (this.vital_params.step_shape.name == 'circle') {
                    this.DrawCircle(grid_layers);
                }
            }
            // console.log(paper.project)
        }
        console.log('generating SVG');
        var svg = paper.project.exportSVG({
            asString: true,
            precision: 2,
            matchShapes: true,
            embedImages: false
        });
        // console.log('svg', svg)
        // fs.writeFile(path.resolve("../images/" + makeid(6).toString() + '.svg'), svg, function (err) {
        let pth = path.resolve("debug02.svg")
        let image_id = makeid(6).toString()
        console.log(this.image_id)
        // let pth = path.resolve("..\\images\\")
        console.log('path', pth)
        fs.writeFile(pth + '.svg', svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        console.log(pth, ' -> img path')
        svg2img(svg, function (error, buffer) {
            //returns a Buffer

            fs.writeFileSync(image_id + '.png', buffer);
        });

    }


    GenerateVitalParams(step_shape) {
        let vital_params = {
            step_shape: {
                id: step_shape,
                name: Templates.step_shapes[step_shape]
            },
            rule_template: Templates.rule_templates[step_shape],
            grid_size: Templates.grid_sizes[0],
            stroke_weights: Templates.stroke_weight_templates[step_shape],
            ant_count: 1,
            ant_origins_random: true,
            duration: 100,
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