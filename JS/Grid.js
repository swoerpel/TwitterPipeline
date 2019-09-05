var Templates = require('./Templates.js');


class Grid {
    constructor(params) {
        this.params = params
        this.ants = []
        this.origin = {
            x_index: Math.floor(params.grid_size.x / 2),
            y_index: Math.floor(params.grid_size.y / 2)
        }
        this.SetupRules()
        this.SpawnAnts()
        this.InitializeGrids()
    }

    InitializeGrids() {
        this.grids = {}
        switch (this.params.step_shape.name) {
            case 'square':
                this.grids['color'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(0));
                this.grids['sub_shape'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(1));
                this.grids['stroke_weight'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill([]));
                break;
            case 'circle':
                this.grids['color'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(0));
                this.grids['sub_shape'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(1));
                this.grids['stroke_weight'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill([]));
                break;
            case 'triangle':
                this.grids['color'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(0));
                this.grids['sub_shape'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(1));
                this.grids['stroke_weight'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill([]));
                this.grids['rotation'] = new Array(this.params.grid_size.x).fill()
                    .map(() => new Array(this.params.grid_size.y).fill(0));
                break;
        }
    }

    SetupRules() {
        this.all_rules = []
        if (this.params.rule_template.turnRight)
            this.all_rules.push((ant) => turnRight(ant))
        if (this.params.rule_template.turnLeft)
            this.all_rules.push((ant) => turnLeft(ant))
        if (this.params.rule_template.goStraight)
            this.all_rules.push((ant) => goStraight(ant))
        if (this.params.rule_template.incStrokeWeight)
            this.all_rules.push((ant) => incStrokeWeight(ant))
        if (this.params.rule_template.decStrokeWeight)
            this.all_rules.push((ant) => decStrokeWeight(ant))
        if (this.params.rule_template.incRotation)
            this.all_rules.push((ant) => incRotation(ant))
        if (this.params.rule_template.decRotation)
            this.all_rules.push((ant) => decRotation(ant))
        if (this.params.rule_template.incStepSize)
            this.all_rules.push((ant) => incStepSize(ant))
        if (this.params.rule_template.decStepSize)
            this.all_rules.push((ant) => decStepSize(ant))
        if (this.params.rule_template.incSubShapes)
            this.all_rules.push((ant) => incSubShapes(ant))
        if (this.params.rule_template.decSubShapes)
            this.all_rules.push((ant) => decSubShapes(ant))
        // this.all_rules.length
        console.log('all rules', this.all_rules, this.all_rules.length, this.params.step_shape.name)
    }

    SpawnAnts() {
        let ant_attributes = Templates.ant_attribute_templates[this.params.step_shape.id]
        // console.log('ant attributes 32321', ant_attributes.stroke_weight)
        for (let i = 0; i < this.params.ant_count; i++) {
            let default_attributes = {
                id: i,
                x: this.params.ant_origins_random ?
                    Math.floor(Math.random() * this.params.grid_size.x) :
                    Math.floor(this.params.grid_size.x / 2),
                y: this.params.ant_origins_random ?
                    Math.floor(Math.random() * this.params.grid_size.y) :
                    Math.floor(this.params.grid_size.y / 2),
                rule_indexes: this.RandRuleset(ant_attributes.color.state_count),
                direction: 0,
                step_count: 0,
                step_size: 1,//move only one in each direction
                stroke_weight: {
                    index: 0,
                    values: this.params.stroke_weights,
                }
            }
            // console.log('default_attributes', default_attributes)
            // console.log('ant_attributes', ant_attributes)
            let ant = { ...default_attributes, ...ant_attributes, }
            this.ants.push(ant)
        }
    }

    RandRuleset(state_count) {
        let rule_indexes = []
        for (let i = 0; i < state_count; i++) {
            let rand_index = Math.floor(Math.random() * this.all_rules.length)
            rule_indexes.push(rand_index)
        }
        return rule_indexes
    }

    WalkAnts(steps) {
        for (let i = 0; i < steps; i++) {
            this.ants.map((ant) => {
                let step_value = this.grids['color'][ant.x][ant.y]
                this.all_rules[ant.rule_indexes[step_value]](ant)
                this.UpdateAnt(ant)
                this.UpdateGrids(ant)
            })
        }
        return this.grids
    }

    UpdateAnt(ant) {
        if (ant.direction == Templates.consts.UP) {
            ant.y += ant.step_size;
        } else if (ant.direction == Templates.consts.RIGHT) {
            ant.x += ant.step_size;
        } else if (ant.direction == Templates.consts.DOWN) {
            ant.y -= ant.step_size;
        } else if (ant.direction == Templates.consts.LEFT) {
            ant.x -= ant.step_size;
        }

        if (ant.x > this.params.grid_size.x - 1) {
            ant.x = 0;
        } else if (ant.x < 0) {
            ant.x = this.params.grid_size.x - 1;

        } if (ant.y > this.params.grid_size.y - 1) {
            ant.y = 0;
        } else if (ant.y < 0) {
            ant.y = this.params.grid_size.y - 1;
        }
        ant.step_count++
    }

    UpdateGrids(ant) {
        let grids = Object.keys(this.grids)
        grids.map((type) => {
            // console.log('type', type, ant)
            if (type === 'color') {
                this.grids[type][ant.x][ant.y] =
                    (this.grids[type][ant.x][ant.y] + ant.color.increment_value) % ant.color.color_count
            }
            if (type === 'sub_shape') {
                this.grids[type][ant.x][ant.y] = ant.sub_shape.values[ant.sub_shape.index]
            }
            if (type === 'stroke_weight') {
                if (this.grids[type][ant.x][ant.y].indexOf(ant.stroke_weight.values[ant.stroke_weight.index]) == -1)
                    this.grids[type][ant.x][ant.y].push(ant.stroke_weight.values[ant.stroke_weight.index])
            }
            if (type === 'rotation') {
                this.grids[type][ant.x][ant.y] =
                    (Math.round(ant.rotation.value * 100) / 100)
            }
        })

    }


}


// ant methods
var turnRight = (ant) => {
    ant.direction++;
    if (ant.direction > Templates.consts.LEFT) {
        ant.direction = Templates.consts.UP;
    }
}

var turnLeft = (ant) => {
    ant.direction--;
    if (ant.direction < Templates.consts.UP) {
        ant.direction = Templates.consts.LEFT;
    }
}

var goStraight = (ant) => {
}

var incStepSize = (ant) => {
    ant.step_size = (ant.step_size + 1) % grid_params.max_step_size
}

var decStepSize = (ant) => {
    if (ant.step_size != 1)
        ant.step_size--
    else
        ant.step_size = grid_params.max_step_size
}

var incStrokeWeight = (ant) => {
    ant.stroke_weight.index = (ant.stroke_weight.index + 1) % ant.stroke_weight.values.length

}

var decStrokeWeight = (ant) => {

    ant.stroke_weight.index -= 1
    if (ant.stroke_weight.index < 0)
        ant.stroke_weight.index = (ant.stroke_weight.values.length - 1)

}


var incRotation = (ant) => {
    ant.rotation.value += ant.rotation.delta
}
var decRotation = (ant) => {
    ant.rotation.value -= ant.rotation.delta
}


var incSubShapes = (ant) => {
    ant.sub_shape.index = (ant.sub_shape.index + 1) % ant.sub_shape.values.length
}

var decSubShapes = (ant) => {
    (ant.sub_shape.index < 1) ?
        ant.sub_shape.index = ant.sub_shape.values.length - 1 :
        ant.sub_shape.index--
}

/*
    let ant = {
        id: this.ants.length,
        x: this.params.ant_origins_random ?
            Math.floor(Math.random() * this.params.grid_size.x) :
            Math.floor(this.params.grid_size.x / 2),
        y: this.params.ant_origins_random ?
            Math.floor(Math.random() * this.params.grid_size.y) :
            Math.floor(this.params.grid_size.y / 2),
        rule_indexes: this.RandRuleset(),
        direction: 0,
        step_count: 0,
        step_size: 1,
        rotation: this.params.rotation,
        rotation_delta: this.params.rotation_delta,
        stroke_weight_index: 0,
        stroke_weight: this.params.stroke_weight,
        cycle_stroke_weight: false,
        sub_shape_index: 0,
        color_machine: chroma.scale(colors),
        tile_increment: Math.ceil(Math.random() * this.params.tile_increment)
    }
    this.ants.push(ant)
    console.log('New Ant ID: ', ant.id, ant)
}
*/





// SpawnAnt(colors, palette_name) {
//     let ant = {
//         id: this.ants.length,
//         x: this.params.ant_origins_random ?
//             Math.floor(Math.random() * this.params.width) :
//             Math.floor(this.params.width / 2),
//         y: this.params.ant_origins_random ?
//             Math.floor(Math.random() * this.params.height) :
//             Math.floor(this.params.height / 2),
//         rule_indexes: this.RandRuleset(),
//         direction: 0,
//         step_count: 0,
//         step_size: 1,
//         rotation: this.params.rotation,
//         rotation_delta: this.params.rotation_delta,
//         stroke_weight_index: 0,
//         stroke_weight: this.params.stroke_weight,
//         hex_index: 0,
//         cycle_stroke_weight: false,
//         colors: palette_name,
//         sub_shape_index: 0,
//         color_machine: chroma.scale(colors),
//         tile_increment: Math.ceil(Math.random() * this.params.tile_increment)
//     }
//     this.ants.push(ant)
//     console.log('New Ant ID: ', ant.id, ant)
// }


// RandomizeColors() {
//     master_palette = palettes[Math.floor(Math.random() * palettes.length)]
//     master_colors = chroma.brewer[master_palette]
//     this.ants.map((ant) => {
//         DEF_COLOR_PALETTE ?
//             ant.colors = master_palette :
//             ant.colors = palettes[Math.floor(Math.random() * palettes.length)]

//         ant.color_machine = chroma.scale(ant.colors)
//         console.log(ant.colors)
//     })

//     console.log('New Master Palette:', master_palette)
//     console.log(this.ants)
// }

// PrintAnts() {
//     console.log('All Ants:', this.ants)
// }

// GetAntRules() {
//     let ant_rules = []
//     this.ants.map((ant) => {
//         ant_rules.push(ant.rule_indexes)
//     })
//     return ant_rules
// }

// GetAntColors() {
//     let ant_colors = []
//     this.ants.map((ant) => {
//         ant_colors.push(ant.colors)
//     })
//     return ant_colors
// }









// Draw(ant, step_value) {
//     this.TakeStep(ant, step_value)
// }

// TakeStep(ant, step_value) {

//     let color_scaler = (default_color_mode ? (step_value) : ant.step_count % this.params.state_count) / (this.params.state_count - 1)
//     let color = ant.color_machine(color_scaler).hex()
//     // this.graphic.strokeWeight(ant.stroke_weight)
//     let local_grid_origin = {
//         x: Math.floor(map(ant.x,
//             0, this.params.width,
//             0, this.params.x)),
//         y: Math.floor(map(ant.y,
//             0, this.params.height,
//             0, this.params.y))
//     }
//     this.graphic.stroke(color)
//     if (this.params.draw_shape == 0) {          //circle
//         this.DrawCircle(ant, local_grid_origin, color_scaler)
//     } else if (this.params.draw_shape == 1) {   //right triangle
//         this.DrawTriangle(ant, local_grid_origin, color, 'R')
//     } else if (this.params.draw_shape == 2) {   // equilateral triangle
//         this.DrawTriangle(ant, local_grid_origin, color, 'E')
//     } else if (this.params.draw_shape == 3) {   //square
//         this.graphic.strokeWeight(ant.stroke_weight)
//         this.graphic.stroke(color)
//         this.graphic.square(local_grid_origin.x, local_grid_origin.y, ant.stroke_weight)
//     } else if (this.params.draw_shape == 4) { //Hexagons only
//         this.DrawBlock(ant, local_grid_origin, color)
//         if (false) { //grid draw origins
//             this.graphic.strokeWeight(50)
//             this.graphic.stroke('gray')
//             this.graphic.point(local_grid_origin.x, local_grid_origin.y)
//             this.graphic.strokeWeight(0)
//         }
//     }

// }

// DrawCircle(ant, local_grid_origin, color_scaler) {
//     console.log(local_grid_origin)

//     if (ant.sub_shape_index == 0) {
//         this.graphic.stroke(cvs_params.bgd_colors[bgd_color_index])
//         this.graphic.strokeWeight(ant.stroke_weight)
//         // this.graphic.rect(local_grid_origin.x, local_grid_origin.y, ant.stroke_weight, ant.stroke_weight)
//         this.graphic.stroke(ant.color_machine(color_scaler).hex())
//         this.graphic.point(local_grid_origin.x, local_grid_origin.y)
//         this.graphic.strokeWeight(grid_params.stroke_weight)
//     } else {
//         let diameter = ant.stroke_weight / (ant.sub_shape_index + 1)
//         if (ant.sub_shape_index + 1 == 3)
//             console.log('sub shape 1/3')
//         let coordinates = this.GetSubCoordinates(diameter, ant.sub_shape_index, local_grid_origin)
//         this.graphic.strokeWeight(diameter)
//         coordinates.map((p, index) => {
//             let val;
//             index % (ant.sub_shape_index + 1) == 0 ?
//                 val = index / coordinates.length * color_scaler :
//                 val = 1 - (index / coordinates.length * color_scaler)
//             this.graphic.stroke(ant.color_machine(val).hex())
//             this.graphic.point(p.x, p.y)
//         })

//     }
// }

// // returns scaled coordinates of any subgrid of center of shapes
// GetSubCoordinates(diameter, sub_shape_index, local_grid_origin) {

//     let corner_origin = {
//         x: local_grid_origin.x - grid_params.stroke_weight / 2,
//         y: local_grid_origin.y - grid_params.stroke_weight / 2
//     }
//     // this.graphic.stroke('white')
//     // this.graphic.strokeWeight(diameter)
//     // this.graphic.point(corner_origin.x, corner_origin.y)
//     let coords = []
//     // for (let i = diameter / 2; i < diameter * (ant.sub_shape_index + 1); i += diameter) {
//     //     for (let j = diameter / 2; j < diameter * (ant.sub_shape_index + 1); j += diameter) {
//     for (let i = diameter / 2; i < grid_params.stroke_weight; i += diameter) {
//         for (let j = diameter / 2; j < grid_params.stroke_weight; j += diameter) {
//             coords.push({
//                 x: i + corner_origin.x,
//                 y: j + corner_origin.y,
//             })
//         }
//     }
//     return coords
// }


// DrawTriangle(ant, local_grid_origin, color, type) {
//     this.graphic.strokeWeight(0)
//     let diameter = ant.stroke_weight / (ant.sub_shape_index + 1)
//     /*
//     let coordinates = this.GetSubCoordinates(diameter, ant, local_grid_origin)
//     coordinates.map((p, index) => {
//         // let val = index % 2 == 0 ? color_scaler + color_scaler / 2 : color_scaler - color_scaler / 2
//         let t = this.GetTriangleCoords(ant, p.x, p.y, type)
//         this.graphic.fill(color)
//         this.graphic.strokeWeight(0)
//         this.graphic.triangle(t[0], t[1], t[2], t[3], t[4], t[5])
//         this.graphic.strokeWeight(ant.stroke_weight / 4)
//     })
//     */

//     let t = this.GetTriangleCoords(ant, local_grid_origin.x, local_grid_origin.y, type)
//     this.graphic.fill(color)
//     this.graphic.strokeWeight(0)
//     this.graphic.triangle(t[0], t[1], t[2], t[3], t[4], t[5])
//     this.graphic.strokeWeight(ant.stroke_weight / 4)
// }

// DrawBlock(ant, local_grid_origin, color) {
//     // local_grid_origin: drawing origin for the current occupied in terms of the canvas size
//     console.log('ant stroke weight')

//     let hex_radius = this.params.stroke_weight / 2
//     let hex_height = Math.sqrt(3) * hex_radius / 2
//     hex_radius += hex_radius
//     // hex_radius = hex_height
//     // console.log('local_grid_origin', local_grid_origin, hex_radius)
//     let local_vertices = this.block.PlaceBlock(
//         { x: ant.x, y: ant.y },
//         local_grid_origin,
//         hex_radius,
//         color
//     );
//     // console.log('local vertices', local_vertices)
//     // let vertices = this.block.CalculateVertices(ant, local_grid_origin, this.params.scale_hex_grid)
//     // this.block.DrawHex(vertices, this.params.width, color)
// }

//     GetTriangleCoords(ant, scaled_x, scaled_y, type) {
//         let L = ant.stroke_weight * Math.sqrt(2) / 2
//         let rands = [
//             Math.cos(Math.PI / 4 + ant.rotation) * L, //C
//             Math.sin(Math.PI / 4 + ant.rotation) * L,
//             Math.cos(3 * Math.PI / 4 + ant.rotation) * L, //B
//             Math.sin(3 * Math.PI / 4 + ant.rotation) * L,
//             Math.cos(5 * Math.PI / 4 + ant.rotation) * L, //A
//             Math.sin(5 * Math.PI / 4 + ant.rotation) * L,
//             // Emily likes these for random triangle-ness
//             // Math.cos(this.params.rotation) * L,
//             // Math.sin(this.params.rotation) * L,
//             // Math.cos(this.params.rotation + 90) * L,
//             // Math.sin(this.params.rotation + 90) * L,
//             // Math.cos(this.params.rotation + 180) * L,
//             // Math.sin(this.params.rotation + 180) * L,
//         ]
//         if (type == 'R') { //right triangle
//             let Ax = scaled_x + rands[0]
//             let Ay = scaled_y + rands[1]
//             let Bx = scaled_x + rands[2]
//             let By = scaled_y + rands[3]
//             let Cx = scaled_x + rands[4]
//             let Cy = scaled_y + rands[5]
//             let coords = [Ax, Ay, Bx, By, Cx, Cy]
//             return coords
//         } else if (type == 'E') { //equilateral not scaling correctly
//             let h = L * Math.sqrt(3) / 2
//             let r = L * Math.tan(Math.PI / 6) / 2
//             let Ax = scaled_x
//             let Ay = scaled_y + (h - r)
//             let Bx = scaled_x + L / 2
//             let By = scaled_y - r
//             let Cx = scaled_x - L / 2
//             let Cy = scaled_y - r
//             return [Ax, Ay, Bx, By, Cx, Cy]
//         }

//     }

//     SetStrokeWeights(sw) {
//         this.ants.map((ant) => {
//             ant.stroke_weight = sw
//         })
//     }

//     ResetAnts() {
//         this.ants.map((ant) => {
//             ant.x = this.params.ant_origin == 'random' ?
//                 Math.floor(Math.random() * this.params.width) :
//                 Math.floor(this.params.width / 2)
//             ant.y = this.params.ant_origin == 'random' ?
//                 Math.floor(Math.random() * this.params.height) :
//                 Math.floor(this.params.height / 2)
//             ant.direction = 0
//             ant.step_size = 0
//         })
//         this.grid = this.grid.map((x) => x.map((y) => y = 0))
//         // this.grid = new Array(this.params.width).fill()
//         // .map(() => new Array(this.params.height).fill(0));
//         console.log(this.ants)
//     }


//     ClearRect(mouse_coords) {
//         let coords = []
//         let min_x = 10000;
//         let min_y = 10000;
//         let max_x = -10000;
//         let max_y = -10000;
//         mouse_coords.map((mouse) => {
//             let grid_x = Math.floor(map(mouse.x,
//                 0, this.params.x,
//                 0, this.params.width))
//             let grid_y = Math.floor(map(mouse.y,
//                 0, this.params.y,
//                 0, this.params.height))
//             coords.push({ x: grid_x, y: grid_y })
//             if (grid_x < min_x)
//                 min_x = grid_x
//             if (grid_y < min_y)
//                 min_y = grid_y
//             if (grid_x > max_x)
//                 max_x = grid_x
//             if (grid_y > max_y)
//                 max_y = grid_y

//         })
//         console.log('rectangle cleared at ', coords)
//         console.log('min maxs', min_x, min_y, max_x, max_y)
//         for (let i = min_x; i < max_x + 1; i++) {
//             for (let j = min_y; j < max_y + 1; j++) {
//                 this.floor_ant.x = i,
//                     this.floor_ant.y = j,
//                     this.UpdateGrid(this.floor_ant)
//                 this.TakeStep(this.floor_ant, 0)
//             }
//         }
//     }
// }

// ===============================




// gathers all origin offset indexes of circle radius r
function GenerateFootprint() {
    let all_layers = []
    let max_radius = 1
    all_layers.push({
        id: max_radius,
        layer: [0, 0]
    })
    let nextLayer = (all_layers, radius) => {
        if (radius == 1)
            return all_layers
        let layer = []
        for (let i = -radius; i < radius; i++) {
            for (let j = -radius; j < radius; j++) {
                let xx = (i * i)
                let yy = j * j
                let sqrt = Math.sqrt(xx + yy)
                // console.log(i, j, sqrt >= radius - 1, sqrt, '>=', radius - 1)
                if (sqrt >= radius - 1) {
                    // console.log('index added', i, j, sqrt)
                    layer.push([i, j])
                }
            }
        }
        // console.log('layer', radius, layer)
        all_layers.push({
            id: radius - 1,
            layer: layer
        })
        return nextLayer(all_layers, radius - 1)
    }

    let indexes = nextLayer(all_layers, max_radius)
    var arrayUnique = function (arr) {
        return arr.filter(function (item, index) {
            return arr.indexOf(item) >= index;
        });
    };
    indexes = arrayUnique(indexes[0].layer)
    return indexes
    // console.log(indexes)
}

const isPrime = num => {
    for (let i = 2; i < num; i++)
        if (num % i === 0) return false;
    return num > 1;
}


module.exports = Grid;