class Path {
    constructor(grid_x, grid_y, paper_width, paper_height) {
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        this.paper_width = paper_width;
        this.paper_height = paper_height;
        this.tile_width = this.paper_width / this.grid_x;
        this.tile_height = this.paper_height / this.grid_y;
    }

    GeneratePath(path_index, integers = false) {
        this.path;

        if (path_index == 1)
            this.path = this.spiral(this.grid_x, this.grid_y);
        else if (path_index == 2)
            this.path = this.random();
        else if (path_index == 3)
            this.path = this.crisscross();
        else
            this.path = this.default();
        this.linear_path = this.flatten(this.path);
        if (integers) {
            return this.linear_path
        }
        else {
            this.mapOrigins();
            return this.ordered_origins;
        }
    }

    //Private
    mapOrigins() {
        this.createOrigins()
        let linear_origins = [].concat(...this.origins)
        this.ordered_origins = []
        for (let i = 0; i < this.origins.length; i++) {
            let index = this.linear_path.indexOf(i)
            this.ordered_origins.push(linear_origins[index]);
        }

    }

    createOrigins() {
        this.origins = []
        for (let i = 0; i < this.grid_x; i++) {
            for (let j = 0; j < this.grid_y; j++) {
                this.origins.push({
                    x: this.tile_width * i,
                    y: this.tile_height * j
                })
            }
        }
    }


    //============================================================
    // Path Algorithms============================================
    // output: 2D array of index < (grid_x * grid_y)

    crisscross() {
        let grid = this.default();
        let new_grid = []
        for (let i = 0; i < grid.length; i++) {
            console.log('row', i, grid[i])
            console.log('rev', i, grid[i].reverse())
            if (i % 2 == 0) {
                new_grid.push(grid[i].reverse())
            }
            else {
                new_grid.push(grid[i])
            }
        }
        // grid = grid.map((row, index) => { return (index % 2 == 0 ? row.reverse() : row) })
        console.log('color path grid', new_grid)
        return new_grid;
    }

    spiral(width, height) {
        let step_count = 0;
        let max_step_count = width * height;
        let origin = {
            x: Math.floor(width / 2),
            y: Math.floor(height / 2),
        }
        let grid = new Array(width).fill().map(() => new Array(height).fill(0));
        let current_direction = 2;
        let distance = 1;
        let direction_change_count = 0;
        let position = {
            x: origin.x,
            y: origin.y,

        }
        while (step_count < max_step_count) {
            for (let i = 0; i < distance; i++) {
                grid[position.x][position.y] = (step_count)
                step_count++;
                if (current_direction == 0) {

                    position = {
                        x: (position.x + 1) % width,
                        y: position.y
                    }
                }
                else if (current_direction == 1) {
                    position = {
                        x: position.x,
                        y: (position.y + 1) % height,
                    }
                }
                else if (current_direction == 2) {
                    position = {
                        x: (position.x < 0) ? width - 1 : position.x - 1,
                        y: position.y
                    }
                }
                else if (current_direction == 3) {
                    position = {
                        x: position.x,
                        y: (position.y < 0) ? height - 1 : position.y - 1,
                    }
                }
            }
            current_direction = (current_direction + 1) % 4
            direction_change_count++
            if (direction_change_count == 2) {
                distance++;
                direction_change_count = 0;
            }
        }
        return grid
    }

    random() {
        let grid = this.default();
        grid = this.flatten(grid);
        grid = this.shuffle(grid);
        return this.unflatten(grid);
    }

    default() {
        let grid = new Array(this.grid_x)
            .fill()
            .map(() => new Array(this.grid_y)
                .fill(0));
        let index = 0;
        for (let i = 0; i < this.grid_x; i++) {
            for (let j = 0; j < this.grid_y; j++) {
                grid[i][j] = index;
                index++
            }
        }

        return grid;
    }

    flatten(ary) {
        return [].concat(...ary);
    }

    unflatten(ary) {
        let grid = new Array(this.grid_x)
            .fill()
            .map(() => new Array(this.grid_y)
                .fill(0));
        let index = 0;
        for (let i = 0; i < this.grid_x; i++) {
            for (let j = 0; j < this.grid_y; j++) {
                grid[i][j] = ary[index];
                index++;
            }
        }
        return grid;
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

}

module.exports = Path;