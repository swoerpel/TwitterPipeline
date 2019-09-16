var paper = require('paper-jsdom-canvas');

class MaskGenerator {
    constructor(source_path) {
        this.source_path = source_path
    }

    GenerateMask(size, type, image_id) {
        paper.setup(new paper.Size(size.width, size.height))
        console.log('Mask type', 0)
        if (type == 0) {
            let rect = paper.Rectangle(0, 0, size.width, size.height);
            rect.fillColor = 'black';
        }
        let svg = paper.project.exportSVG({
            asString: true,
            precision: 2,
            matchShapes: true,
            embedImages: false
        });
        this.ExportPNG(svg, image_id)
    }


    GenerateParade() {
        let width = 8;
        let height = 8;
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
        // console.log('positionX positionY step_count direction')

        while (step_count < max_step_count) {
            for (let i = 0; i < distance; i++) {
                grid[position.x][position.y] = (step_count + 1)
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
        console.log(grid)

    }




    ExportPNG(svg, image_id) {
        let path = this.source_path;
        path += (image_id + '.png');
        svg2img(svg, function (error, buffer) {
            fs.writeFileSync(path, buffer);
        });
        console.log('PNG saved at', path)
        return path
    }
}

exports.MaskGenerator = MaskGenerator;