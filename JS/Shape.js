var paper = require('paper-jsdom-canvas');
var Templates = require('./Templates.js');

module.exports = {


    DrawBackground: (color = 'black') => {
        var rect = new paper.Path.Rectangle({
            point: [0, 0],
            size: [paper.view.size.width, paper.view.size.height],
            strokeColor: 'black',
            selected: true
        });
        rect.sendToBack();
        rect.fillColor = color;
    },

    DrawSquares: (grid_values, colors, color_machine) => {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                let size = new paper.Size(grid_values.width / grid_values.sub_shape, grid_values.width / grid_values.sub_shape);
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;

                concentric_sub_stroke_weights.map((sw, index) => {
                    let con_size = new paper.Size(size.width, size.height);
                    let concentric_square = new paper.Path.Rectangle(local_origin, con_size);
                    let color_val = colors[Math.floor(Math.random() * colors.length)]
                    concentric_square.fillColor = color_machine(color_val).hex();
                    concentric_square.scale(sw, concentric_square.bounds.center);
                });
            }
        }
    },

    DrawCircles: (grid_values, colors, color_machine) => {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let circle = new paper.Path.Circle(local_origin, radius);
                // circle.fillColor = this.color_machine(Math.random()).hex();
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;
                concentric_sub_stroke_weights.map((sw) => {
                    let concentric_circle = new paper.Path.Circle(local_origin, radius);
                    let color_val = colors[Math.floor(Math.random() * colors.length)]
                    concentric_circle.fillColor = color_machine(color_val).hex();
                    concentric_circle.scale(sw, concentric_circle.bounds.center);
                });
            }
        }
    },


    DrawTriangles: (grid_values, colors, color_machine) => {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let origin_circle = new paper.Path.Circle(local_origin, radius)
                // origin_circle.fillColor = 'black'
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;
                let local_radius = radius
                // let base_triangle = new paper.Path();
                // base_triangle.strokeWidth = 0
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                // base_triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                grid_values.rotation.sort(() => Math.random() - 0.5)
                grid_values.rotation.map((rot) => {
                    concentric_sub_stroke_weights.map((sw) => {
                        local_radius = radius * sw
                        let triangle = new paper.Path();
                        triangle.strokeWidth = 0
                        triangle.fillColor = color_machine(Math.random()).hex();
                        triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                        triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                        triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                        let color_val = colors[Math.floor(Math.random() * colors.length)]
                        triangle.fillColor = color_machine(color_val).hex();
                        triangle.rotate(rot, local_origin)

                    });
                });
            }
        }
    },

    DrawCustomShape: (grid_values, colors, color_machine) => {
        for (let k = 0; k < grid_values.sub_shape; k++) {
            for (let l = 0; l < grid_values.sub_shape; l++) {
                let radius = grid_values.width / grid_values.sub_shape / 2
                let x_local_origin = grid_values.origin.x + grid_values.width / grid_values.sub_shape * k + radius / 2
                let y_local_origin = grid_values.origin.y + grid_values.width / grid_values.sub_shape * l + radius / 2
                let local_origin = new paper.Point(x_local_origin, y_local_origin);
                // let origin_circle = new paper.Path.Circle(local_origin, radius)
                // origin_circle.fillColor = 'black'
                let concentric_sub_stroke_weights;
                if (grid_values.sub_shape == 1)
                    concentric_sub_stroke_weights = grid_values.stroke_weight;
                else
                    concentric_sub_stroke_weights = Templates.ant_attributes.sub_shape.stroke_weights;

                let group = createBlock(radius);

                // var length = Math.min(count + values.amount, group.children.length);
                // for (var i = count; i < length; i++) {
                let piece = group.children[l];
                var hexagon = piece.children[0];
                let color = colors[Math.floor(Math.random() * colors.length)]
                hexagon.fillColor = color;
                var top = piece.children[1];
                top.fillColor = color.clone();
                top.fillColor.brightness *= 1.5;

                var right = piece.children[2];
                right.fillColor = color.clone();
                right.fillColor.brightness *= 0.5;

                // let base_triangle = new paper.Path();
                // base_triangle.strokeWidth = 0
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                // base_triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                // base_triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                // grid_values.rotation.sort(() => Math.random() - 0.5)
                // grid_values.rotation.map((rot) => {
                //     concentric_sub_stroke_weights.map((sw) => {
                //         local_radius = radius * sw
                //         let triangle = new paper.Path();
                //         triangle.strokeWidth = 0
                //         triangle.fillColor = color_machine(Math.random()).hex();
                //         triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y - local_radius));
                //         triangle.add(new paper.Point(local_origin.x - local_radius, local_origin.y + local_radius));
                //         triangle.add(new paper.Point(local_origin.x + local_radius, local_origin.y + local_radius));
                //         let color_val = colors[Math.floor(Math.random() * colors.length)]
                //         triangle.fillColor = color_machine(color_val).hex();
                //         triangle.rotate(rot, local_origin)

                //     });
                // });
            }
        }
    }
}
