class ColorSequencer {
    constructor(grid_size) {
        this.grid_size = grid_size;
        this.sequence_length = grid_size.x * grid_size.y;
    }

    NewSequence(type) {
        console.log('generating color sequence', type)
        if (type = 'trapped knight')
            return this.TrappedKnight()
    }

    TrappedKnight() {
        let sequence = []
        sequence_grid = new Array(this.grid_size.x).fill()
            .map(() => new Array(this.grid_size.y)).fill(Math.random())

        let min;
        let knight = {}
        for (let i = 0; i < this.grid_size.x; i++) {
            for (let j = 0; j < this.grid_size.y; j++) {
                if (sequence_grid[i][j] < min) {
                    min = sequence_grid[i][j];
                    knight['x'] = i;
                    knight['y'] = j;
                }
            }
        }
        console.log('sequence_grid', sequence_grid);
        for (let i = 0; i < this.grid_size.x; i++) {
            for (let j = 0; j < this.grid_size.y; j++) {

            }
        }
    }

}

module.exports = ColorSequencer;