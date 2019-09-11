var consts = {
    RIGHT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3,
}

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
    // { x: 32, y: 32 },
    // { x: 64, y: 64 },
]

var step_shapes = [
    'square',
    'circle',
    'triangle'
]

var stroke_weight_templates = [
    [2, 1, .9, .8, .7, .6, .5,], //square
    [1, .9, .8, .7, .6, .5, .4, .3],//, 0.9, 0.8, 0.7, 0.6, 0.5], //circle
    [2, 1, .75, .5], //triangle
]



var color_attributes = {
    max_state: 100,
    max_color: 100,
    max_inc: 50,

    //0 - random
    //1 - random with center
    //2 - gradient streaks
    //3 - shuffled gradient
    //4 - mini-ant
    style: 0
}

var sub_shape_attributes = {
    index: 0,
    values: [1, 2],
    stroke_weights: [1, .5],
}

var rotation_attributes = {
    // index:
    value: 0,
    delta: 90, //Math.PI / 2
}

// ARRAY
var ant_attributes = { //square
    color: color_attributes,
    sub_shape: sub_shape_attributes,
    rotation: rotation_attributes
    // stroke_weight: stroke_weight_attributes
}

exports.rule_templates = rule_templates;
exports.grid_sizes = grid_sizes;
exports.step_shapes = step_shapes;
exports.stroke_weight_templates = stroke_weight_templates;
exports.ant_attributes = ant_attributes;
exports.consts = consts