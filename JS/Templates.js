var consts = {
    RIGHT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3,
}
var step_shapes = [
    'square',
    'circle',
    'triangle',
    'cube'
]
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
    { //cube
        turnRight: true,
        turnLeft: true,
        goStraight: true,
        incStrokeWeight: true,
        decStrokeWeight: true,
        incRotation: false,
        decRotation: false,
        incStepSize: false,
        decStepSize: false,
        incSubShapes: false,
        decSubShapes: false,
    },
]

var scale_sizes = {
    x: 1,
    y: 1,
}

var grid_sizes = [
    { x: 2 * scale_sizes.x, y: 2 * scale_sizes.y },
    { x: 4 * scale_sizes.x, y: 4 * scale_sizes.y },
    { x: 8 * scale_sizes.x, y: 8 * scale_sizes.y },
    { x: 16 * scale_sizes.x, y: 16 * scale_sizes.y },
    // { x: 32, y: 32 },
    // { x: 64, y: 64 },
]

var png_dims = {
    x: 2400,
    y: 2400
}

var stroke_weight_templates = [
    // [2, 1.5, 1, .9, .8, .7, .6, .5], //square
    [1], //square
    [1],//, 0.9, 0.8, 0.7, 0.6, 0.5], //circle
    // [1, .9, .8, .7, .6, .5, .4, .3],//, 0.9, 0.8, 0.7, 0.6, 0.5], //circle
    [1], //triangle
    // [1, .9, .8, .7, .6, .5,], //triangle
    // [1, .95, .9, .85, .8, .75, .7, .65, .6, .55, .5, .45, .4, .35, .3], //triangle
    [1], //cube
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
    values: [1],
    stroke_weights: [1,],
    // stroke_weights: [1, .9, .8, .7, .6, .5,],
}

var rotation_attributes = {
    // index:
    value: 0,
    delta: 180, //Math.PI / 2
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
exports.png_dims = png_dims
exports.scale_sizes = scale_sizes