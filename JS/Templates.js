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
        incStepSize: false,
        decStepSize: false,
        incSubShapes: true,
        decSubShapes: true,
    },
    { //circle
        turnRight: true,
        turnLeft: true,
        goStraight: true,
        incStrokeWeight: true,
        decStrokeWeight: true,
        incRotation: false,
        decRotation: false,
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
        incStepSize: false,
        decStepSize: false,
        incSubShapes: true,
        decSubShapes: true,
    },
]

var grid_sizes = [
    { x: 2, y: 2 },
    { x: 4 * 2, y: 4 },
    { x: 8, y: 8 },
    { x: 16, y: 16 },
    { x: 32, y: 32 },
    { x: 64, y: 64 },
]

var step_shapes = [
    'square',
    'circle',
    'triangle'
]

var stroke_weight_templates = [
    [1, .5], //square
    [1, .5, .25],//, 0.9, 0.8, 0.7, 0.6, 0.5], //circle
    [2, 1], //triangle
]



var color_attributes = {
    state_count: 150,
    color_count: 150,
    increment_value: 1,
}

var sub_shape_attributes = {
    index: 0,
    values: [1, 2, 4],
    stroke_weights: [1],
}

var rotation_attributes = {
    // index:
    value: 0,
    delta: 45, //Math.PI / 2
}

// ARRAY
var ant_attribute_templates = [
    { //square
        color: color_attributes,
        sub_shape: sub_shape_attributes,
        rotation: rotation_attributes
        // stroke_weight: stroke_weight_attributes
    },
    { //circle
        color: color_attributes,
        sub_shape: sub_shape_attributes,
        rotation: rotation_attributes
        // stroke_weight: stroke_weight_attributes,
    },
    { //triangle
        color: color_attributes,
        sub_shape: sub_shape_attributes,
        // stroke_weight: stroke_weight_attributes,
        rotation: rotation_attributes
    }
]

exports.rule_templates = rule_templates;
exports.grid_sizes = grid_sizes;
exports.step_shapes = step_shapes;
exports.stroke_weight_templates = stroke_weight_templates;
exports.ant_attribute_templates = ant_attribute_templates;
exports.consts = consts