class ParameterController {
    constructor() {
    }

    GenerateParams() {
        let params = {
            sw: generate_decimal_ranges(0.5, 4, 1, 8),// + [1],
            rot: [0, 90, 180],
            // rot: generate_integer_range(45, 90, 45),
            // sub_shapes: generate_integer_range(1, 4, 1),
            sub_shapes: [[1], [1, 2], [1, 2, 4]],
            sub_sw: generate_decimal_ranges(0.5, 1, 1, 5),// + [1],
        }
        let max_params = {
            sw: params.sw.length,
            rot: params.rot.length,
            sub_shapes: params.sub_shapes.length,
            sub_sw: params.sub_sw.length
        }
        let max_indexes = Object.keys(max_params)
            .map((key) => max_params[key]);
        let all_combos = generate_all_combos(params, max_indexes);
        console.log('max values :', max_params)
        console.log('total combinations :', all_combos.length)
        return all_combos
    }
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

var generate_decimal_ranges = (min_value, max_value, min_step, max_step) => {
    let sw = []
    for (let k = 1; k <= max_value; k++) {
        let max = k;

        let diff = max - min_value;
        sw.push([1])
        for (let s = min_step; s < max_step; s++) {
            sw.push(Array(s + 1).fill(max).map((n, i) => round(n - (i * diff / s), 3)));
        }

    }

    return sw
}

const generate_integer_range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start + 1) / step)).fill(start).map((x, y) => x + y * step)

const generate_all_combos = (params, max_indexes) => {
    let counter = 0;
    let keys = Object.keys(params)
    let all_combos = [];
    console.log('MAX', max_indexes)
    for (let i = 0; i < max_indexes[0]; i++) {
        for (let j = 0; j < max_indexes[1]; j++) {
            for (let k = 0; k < max_indexes[2]; k++) {
                for (let l = 0; l < max_indexes[3]; l++) {
                    let combo = {

                        keys: [i, j, k, l],
                        values: [
                            params[keys[0]][i],
                            params[keys[1]][j],
                            params[keys[2]][k],
                            params[keys[3]][l],
                        ]
                    }

                    all_combos.push(combo)
                    console.log(combo)
                    counter++;
                }
            }
        }
    }
    return all_combos
}

module.exports = ParameterController;
