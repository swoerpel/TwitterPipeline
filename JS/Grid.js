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
        this.grid = new Array(this.params.grid_size.x).fill()
            .map(() => new Array(this.params.grid_size.y).fill({
                rule: 0,
                color: [0, 0, 0],
                sub_shape: 1,
                stroke_weight: [],
                rotation: [],
            }));
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
        let ant_attributes = Templates.ant_attributes
        for (let i = 0; i < this.params.ant_count; i++) {
            let default_attributes = {
                id: i,
                x: this.params.ant_origins_random ?
                    Math.floor(Math.random() * this.params.grid_size.x) :
                    Math.floor(this.params.grid_size.x / 2),
                y: this.params.ant_origins_random ?
                    Math.floor(Math.random() * this.params.grid_size.y) :
                    Math.floor(this.params.grid_size.y / 2),
                rule_indexes: this.RandRuleset(ant_attributes.color.max_state),
                direction: 0,
                step_count: 0,
                step_size: 1,//move only one in each direction
                stroke_weight: {
                    index: 0,
                    values: this.params.stroke_weights,
                }
            }
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
                let rule_value = this.grid[ant.x][ant.y].rule
                this.all_rules[ant.rule_indexes[rule_value]](ant)
                this.UpdateAnt(ant)
                this.UpdateGrid(ant)
            })
        }
        return this.grid
    }

    UpdateAnt(ant) {
        if (ant.direction == Templates.consts.UP) {
            ant.y = (ant.y + ant.step_size) % this.params.grid_size.y;
        } else if (ant.direction == Templates.consts.RIGHT) {
            ant.x = (ant.x + ant.step_size) % this.params.grid_size.x;
        } else if (ant.direction == Templates.consts.DOWN) {
            ant.y = (ant.y - ant.step_size);
            if (ant.y < 0)
                ant.y = this.params.grid_size.y - 1
        } else if (ant.direction == Templates.consts.LEFT) {
            ant.x = (ant.x - ant.step_size);
            if (ant.x < 0)
                ant.x = this.params.grid_size.x - 1
        }
        ant.step_count++
    }

    UpdateGrid(ant) {
        let rule = (this.grid[ant.x][ant.y].rule + 1) % ant.color.max_state
        let sub_shape = ant.sub_shape.values[ant.sub_shape.index]
        let stroke_weight_array = [...this.grid[ant.x][ant.y].stroke_weight];
        if (stroke_weight_array.indexOf(ant.stroke_weight.values[ant.stroke_weight.index]) == -1)
            stroke_weight_array.push(ant.stroke_weight.values[ant.stroke_weight.index])

        let rotation_array = [...this.grid[ant.x][ant.y].rotation];
        let value = (Math.round(ant.rotation.value * 100) / 100)
        if (rotation_array.indexOf(value) == -1)
            rotation_array.push(value);

        let color_array = [...this.grid[ant.x][ant.y].color];

        let rand_index = Math.floor(Math.random() * color_array.length)
        color_array[rand_index] = (color_array[rand_index] + 1) % ant.color.max_color
        this.grid[ant.x][ant.y] = {
            rule: rule,
            sub_shape: sub_shape,
            color: color_array,
            stroke_weight: stroke_weight_array,
            rotation: rotation_array,
        }
    }
}


// ant methods
var turnRight = (ant) => {
    ant.direction++;
    if (ant.direction > Templates.consts.DOWN) {
        ant.direction = Templates.consts.RIGHT;
    }
}

var turnLeft = (ant) => {
    ant.direction--;
    if (ant.direction < Templates.consts.RIGHT) {
        ant.direction = Templates.consts.DOWN;
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
    ant.rotation.value = (ant.rotation.value + ant.rotation.delta) % 360
}
var decRotation = (ant) => {
    ant.rotation.value = (ant.rotation.value - ant.rotation.delta) % 360
}

var incSubShapes = (ant) => {
    ant.sub_shape.index = (ant.sub_shape.index + 1) % ant.sub_shape.values.length
}

var decSubShapes = (ant) => {
    ant.sub_shape.index <= 0 ?
        ant.sub_shape.index = ant.sub_shape.values.length - 1 :
        ant.sub_shape.index--
}

module.exports = Grid;