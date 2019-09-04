var consts = {
    RIGHT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3,
}

var MAX_STEPS_PER_DRAW = 5
const MAX_ANT_STEP_SIZE = 10
// all new ants spawned will use master color palette
const DEF_COLOR_PALETTE = true // all ants share default pallete
const CYCLE_PALETTES = true // cycle of random group, or always random,


var rule_templates = [
    { //square
        turnRight: true,
        turnLeft: true,
        goStraight: true,
        incStrokeWeight: true,
        decStrokeWeight: true,
        incRotation: false,
        decRotation: false,
        swapDrawShape: false,
        incStepSize: false,
        decStepSize: false,
        incSubShapes: false,
        decSubShapes: false,
    },
    { //circle
        turnRight: true,
        turnLeft: true,
        goStraight: true,
        incStrokeWeight: true,
        decStrokeWeight: true,
        incRotation: false,
        decRotation: false,
        swapDrawShape: false,
        incStepSize: false,
        decStepSize: false,
        incSubShapes: true,
        decSubShapes: true,
    },
    { //triangle
        turnRight: true,
        turnLeft: true,
        goStraight: true,
        incStrokeWeight: true,
        decStrokeWeight: true,
        incRotation: true,
        decRotation: true,
        swapDrawShape: false,
        incStepSize: false,
        decStepSize: false,
        incSubShapes: false,
        decSubShapes: false,
    },
]

var grid_sizes = [
    { x: 2, y: 2 },
    { x: 4, y: 4 },
    { x: 8, y: 8 },
]

var step_shapes = [
    'square',
    'circle',
    'triangle'
]

var stroke_weight_templates = [
    [1], //square
    [1, 0.9, 0.8, 0.7, 0.6, 0.5], //circle
    [4, 2, 1, 0.5], //triangle
]

var color_attributes = {
    state_count: 100,
    color_count: 100,
    increment_value: 1,
}

var stroke_weight_attributes = {
    index: 0,

}

var rotation_attributes = {
    value: 0,
    delta: Math.PI / 2
}


var ant_attribute_templates = [
    { //square
        color: color_attributes,
        stroke_weight: stroke_weight_attributes
    },
    { //circle
        color: color_attributes,
        stroke_weight: stroke_weight_attributes,
    },
    { //triangle
        color: color_attributes,
        stroke_weight: stroke_weight_attributes,
        rotation: rotation_attributes
    }
]

exports.rule_templates = rule_templates;
exports.grid_sizes = grid_sizes;
exports.step_shapes = step_shapes;
exports.stroke_weight_templates = stroke_weight_templates;
exports.ant_attribute_templates = ant_attribute_templates;
exports.consts = consts