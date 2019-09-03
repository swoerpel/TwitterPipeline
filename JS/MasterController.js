var Templates = require('./Templates.js');
var Grid = require('./Grid.js');
class MasterController {
    constructor() {
    }

    GenerateImage(step_shape) {
        console.log('generating image...')
        let vital_params = this.GenerateVitalParams(step_shape)
        console.log('vital params', vital_params)
        let grid = new Grid(vital_params)
        grid.WalkAnts(vital_params.duration)
        // Create set of vital parameters:
        // select step shape
        // select subset of active rules
        // select ant count
        // select ant parameters?
        // select duration 
    }

    GenerateVitalParams(step_shape) {
        let vital_params = {
            step_shape: { id: step_shape, name: Templates.step_shapes[step_shape] },
            rule_template: this.GetShapeRuleTemplate(step_shape),
            grid_size: this.GetGridSize(2),
            stroke_weights: this.GetStrokeWeights(step_shape),
            ant_count: 1,
            ant_origins_random: true,
            duration: 100,
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