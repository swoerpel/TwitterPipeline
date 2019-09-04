var fs = require('fs');
var path = require('path');
var paper = require('paper-jsdom-canvas');
var chroma = require('chroma-js');
var Templates = require('./Templates.js');
var Grid = require('./Grid.js');
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
        // time to draw shapes according to shape type
        // and values present in all output grids
    }

    DrawGrids(grid_layers) {
        console.log('grid layers', grid_layers)
        console.log('vital params', this.vital_params)

        for (let i = 0; i < this.vital_params.grid_size.x; i++) {
            for (let j = 0; j < this.vital_params.grid_size.y; j++) {
                if (this.vital_params.step_shape.name == 'square') {
                    let stroke_weight = grid_layers.stroke_weight[i][j] * this.paper_width / this.vital_params.grid_size.x
                    let scaled_x = this.paper_width / this.vital_params.grid_size.x * i
                    let scaled_y = this.paper_height / this.vital_params.grid_size.y * j
                    console.log(i, j, scaled_x, scaled_y)
                    let topleft = new paper.Point(scaled_x, scaled_y);
                    let rect_size = new paper.Size(stroke_weight, stroke_weight);
                    let squarePath = new paper.Path.Rectangle(topleft, rect_size)
                    console.log('color val', grid_layers.color[i][j] / 100)

                    squarePath.fillColor = this.color_machine(grid_layers.color[i][j] / 100).hex()
                }
            }
        }
        console.log('generating SVG');
        var svg = paper.project.exportSVG({
            asString: true,
            precision: 2,
            matchShapes: true,
            embedImages: false
        });
        console.log('svg', svg)
        // fs.writeFile(path.resolve("../images/" + makeid(6).toString() + '.svg'), svg, function (err) {
        let pth = path.resolve("debug02.svg")
        console.log('path', pth)
        fs.writeFile(pth, svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }


    GenerateVitalParams(step_shape) {
        let vital_params = {
            step_shape: { id: step_shape, name: Templates.step_shapes[step_shape] },
            rule_template: this.GetShapeRuleTemplate(step_shape),
            grid_size: this.GetGridSize(2),
            stroke_weights: this.GetStrokeWeights(step_shape),
            ant_count: 1,
            ant_origins_random: true,
            duration: 1000,
        }
        // console.log('vital_params.stroke_weights', vital_params.stroke_weights)
        return vital_params;
    }


    GetGridSize(index = Math.floor(Math.random() * Templates.grid_sizes.length)) {
        return Templates.grid_sizes[index];
    }

    GetShapeRuleTemplate(step_shape = 0) {
        return Templates.rule_templates[step_shape];
    }

    GetStrokeWeights(step_shape = 0) {
        return Templates.stroke_weight_templates[step_shape];
    }
}

module.exports = MasterController;