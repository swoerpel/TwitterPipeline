class Block {
    constructor(graphic) {
        this.graphic = graphic
        this.generateBlockTemplates()
    }

    generateBlockTemplates() {
        // array of templates
        // template -> array of faces
        // face -> list if indexes on hex grid
        this.block_templates = []
        // default cube
        this.block_templates.push([
            { face: [0, 9, 10, 11, 0], color_index: 0 },
            { face: [0, 7, 8, 9, 0], color_index: 1 },
            { face: [0, 11, 12, 7, 0], color_index: 2 }
        ])

        // 7 small sub cubes
        this.block_templates.push([
            { face: [0, 3, 4, 5, 0], color_index: 0 },
            { face: [0, 1, 2, 3, 0], color_index: 1 },
            { face: [0, 5, 6, 1, 0], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [1, 2, 0, 6, 1], color_index: 0 },
            { face: [1, 7, 13, 2, 1], color_index: 1 },
            { face: [1, 6, 18, 7, 1], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [6, 0, 5, 17, 6], color_index: 0 },
            { face: [6, 18, 1, 0, 6], color_index: 1 },
            { face: [6, 17, 12, 18, 6], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [5, 4, 16, 11, 5], color_index: 0 },
            { face: [5, 6, 0, 4, 5], color_index: 1 },
            { face: [5, 11, 17, 6, 5], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [4, 15, 10, 16, 4], color_index: 0 },
            { face: [4, 0, 3, 15, 4], color_index: 1 },
            { face: [4, 16, 5, 0, 4], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [3, 9, 15, 4, 3], color_index: 0 },
            { face: [3, 2, 14, 9, 3], color_index: 1 },
            { face: [3, 4, 0, 2, 3], color_index: 2 }
        ])
        this.block_templates.push([
            { face: [2, 14, 3, 0, 2], color_index: 0 },
            { face: [2, 13, 8, 14, 2], color_index: 1 },
            { face: [2, 0, 1, 13, 2], color_index: 2 }
        ])

        // rectangular blocks
        this.block_templates.push([
            { face: [3, 9, 15, 4, 3], color_index: 0 },
            { face: [3, 13, 8, 9, 3], color_index: 1 },
            { face: [3, 4, 1, 13, 3], color_index: 2 }
        ])

        // L block Left
        this.block_templates.push([
            { face: [4, 15, 10, 16, 4], color_index: 0 },
            { face: [6, 0, 5, 17, 6], color_index: 0 },
            { face: [18, 6, 17, 12, 18], color_index: 2 },
            { face: [0, 4, 16, 5, 0], color_index: 2 },
            { face: [0, 6, 18, 1, 2, 3, 15, 4, 0], color_index: 1 },
        ])
    }

    getHexOriginShift(ant, hex_radius) {
        let hex_height = Math.sqrt(3) * hex_radius / 2
        let x_shift = -ant.x * hex_height / Math.sqrt(3)
        // x_shift += ant.x * (hex_radius - hex_height)
        let y_shift = -ant.y * 2 * (hex_radius - hex_height)
        y_shift -= ant.y * (hex_radius - hex_height)
        if (ant.x % 2 == 0)
            y_shift += hex_height
        let hex_shift = {
            x: x_shift,
            y: y_shift,
        }
        return hex_shift
    }

    getHexVertices(local_hex_origin, hex_radius, rotation = 0) {
        let angle = TWO_PI / 6
        let points = []
        let orientation = 0//Math.PI / 6 // -> pointy top : 0 -> flat top
        for (let a = 0; a < TWO_PI * (1 - 1 / 6); a += angle) {
            let sx = local_hex_origin.x + cos(a + orientation + rotation) * hex_radius;
            let sy = local_hex_origin.y + sin(a + orientation + rotation) * hex_radius;
            points.push({ x: sx, y: sy })
        }
        return points
    }


    //debugging purposes
    drawPoint(x, y) {
        this.graphic.strokeWeight(25)
        this.graphic.stroke('white')
        this.graphic.point(x, y)
    }
    drawSingleHexGrid(vertices, palette) {
        this.graphic.strokeWeight(40)
        let color_machine = chroma.scale(palette)
        vertices.map((v, index) => {
            // this.graphic.strokeWeight(index * 20)
            this.graphic.stroke(color_machine(index / vertices.length).hex())
            this.graphic.point(v.x, v.y)
        })
    }
    PlaceBlock(ant_grid_indices, local_grid_origin, hex_radius, color) {
        let hex_origin_shift = this.getHexOriginShift(ant_grid_indices, hex_radius)
        let local_hex_origin = {
            x: local_grid_origin.x + hex_origin_shift.x,
            y: local_grid_origin.y + hex_origin_shift.y,
        }
        if (!grid_params.scale_hex_grid)
            local_hex_origin = local_grid_origin
        let mid_radius = Math.sqrt(3) * hex_radius / 2 //height
        let outer_hex_vertices = this.getHexVertices(local_hex_origin, hex_radius)
        let mid_hex_vertices = this.getHexVertices(local_hex_origin, mid_radius, TWO_PI / 12)
        let inner_hex_vertices = this.getHexVertices(local_hex_origin, hex_radius / 2)

        let all_local_vertices = [
            local_hex_origin,
            ...inner_hex_vertices,
            ...outer_hex_vertices,
            ...mid_hex_vertices,
        ]
        //testing purposes
        // this.drawSingleHexGrid(all_local_vertices, ['white', 'black'])
        let template_index = Math.floor(Math.random() * this.block_templates.length)
        //array of faces
        let block_vertices = this.block_templates[template_index]

        block_vertices.map((block, index) => {
            this.graphic.fill('black')
            this.graphic.stroke(chroma(color).darken(20).hex())
            this.drawFace(block.face, index, all_local_vertices)
            // this.graphic.fill(chroma(color).darken((index + 1) % 3).hex())
            this.graphic.fill(chroma(color)
                .saturate(block.color_index)
                .darken((block.color_index))
                .hex())

            this.drawFace(block.face, index, all_local_vertices)
        })
    }

    drawFace(block_vertices, index, all_local_vertices) {
        this.graphic.strokeWeight(0)

        this.graphic.beginShape();
        this.graphic.stroke('black')
        block_vertices.map((v, index) => {
            this.graphic.vertex(all_local_vertices[v].x, all_local_vertices[v].y)
        })


        this.graphic.endShape(CLOSE);
        this.graphic.stroke('black')
        this.graphic.strokeWeight(20)

        block_vertices.map((v, index) => {
            // this.graphic.point(all_local_vertices[v].x, all_local_vertices[v].y)

        })
        this.graphic.strokeWeight(10)
    }


    // DrawBlock(vertices, color, local_hex_origin) {
    //     let grid_width = cvs_params.x
    //     let translate = this.centerOrigin(grid_width, this.default_radius)
    //     this.graphic.translate(translate.x / 2, translate.y / 2)
    //     this.graphic.strokeWeight(0)
    //     this.graphic.strokeWeight(12)
    //     this.graphic.stroke('white')
    //     this.drawX(vertices, local_hex_origin, color)
    //     this.drawY(vertices, local_hex_origin, color)
    //     this.drawZ(vertices, local_hex_origin, color)
    //     if (false) { //draw origins
    //         this.graphic.strokeWeight(50)
    //         this.graphic.stroke('black')
    //         this.graphic.point(hex_origin.x, hex_origin.y)
    //         this.graphic.strokeWeight(0)
    //     }
    //     this.graphic.translate(-translate.x / 2, -translate.y / 2)
    // }



    drawX(points, local_hex_origin, color) {
        this.graphic.fill(chroma(color).saturate(-1).hex())
        // this.graphic.fill(chroma(color).darken(0).hex())
        // this.graphic.beginShape();
        this.graphic.point(local_hex_origin.x, local_hex_origin.y)
        this.graphic.point(points[0].x, points[0].y)
        this.graphic.point(points[1].x, points[1].y)
        this.graphic.point(points[2].x, points[2].y)
        // this.graphic.endShape(CLOSE);
    }

    drawY(points, local_hex_origin, color) {
        // this.graphic.fill(chroma(color).saturate(0).hex())
        this.graphic.fill(chroma(color).darken(1).hex())
        this.graphic.point(local_hex_origin.x, local_hex_origin.y)
        this.graphic.point(points[2].x, points[2].y)
        this.graphic.point(points[3].x, points[3].y)
        this.graphic.point(points[4].x, points[4].y)
    }

    drawZ(points, local_hex_origin, color) {
        // this.graphic.fill(chroma(color).saturate(1).hex())
        this.graphic.fill(chroma(color).darken(-1).hex())
        this.graphic.point(local_hex_origin.x, local_hex_origin.y)
        this.graphic.point(points[4].x, points[4].y)
        this.graphic.point(points[5].x, points[5].y)
        this.graphic.point(points[0].x, points[0].y)
    }

    //=================================================================
    //original functions
    // getHexVertices(ant, hex_shift, angle, grid_origin) {
    //     let local_radius = ant.stroke_weight / 2
    //     // finding local hex vertices
    //     let points = []
    //     let orientation = 0//Math.PI / 6 // -> pointy top : 0 -> flat top
    //     for (let a = 0; a < TWO_PI; a += angle) {
    //         let sx = grid_origin.x + cos(a + orientation + ant.rotation) * local_radius;
    //         let sy = grid_origin.y + sin(a + orientation + ant.rotation) * local_radius;
    //         points.push({
    //             x: sx + hex_shift.x, y: sy + hex_shift.y
    //         })
    //     }
    //     return points
    // }


    // scales grid size toward top left corner


    centerOrigin(grid_width, default_radius) {
        // translate to center grid
        let hex_total_width = (2 * default_radius * grid_width) - ((grid_width - 1) / 2 * default_radius)
        let x_translate = 0//cvs_params.x - hex_total_width
        let default_hex_height = (Math.sqrt(3) / 2 * default_radius)
        let hex_total_height = default_hex_height * (grid_width * 2 + 1)
        let y_translate = 0//cvs_params.y - hex_total_height - (default_radius - default_hex_height) * 2
        this.graphic.translate(x_translate / 2, y_translate / 2)
        return { x: x_translate, y: y_translate }
    }




    CalculateVertices(ant, grid_origin, scale_hex_grid) {
        let angle = TWO_PI / 6; //denotes hexagon
        this.default_radius = grid_params.stroke_weight / 2
        this.hex_shift = this.getHexOriginShift(ant, this.default_radius)

        if (!scale_hex_grid) {
            this.hex_shift.x = 0
            this.hex_shift.y = 0
        }
        this.hex_origin = {
            x: grid_origin.x + this.hex_shift.x,
            y: grid_origin.y + this.hex_shift.y,
        }
        return this.getHexVertices(this.hex_shift, grid_origin)
    }


    // DrawBlock(points, grid_width, color) {
    //     let translate = this.centerOrigin(grid_width, this.default_radius)
    //     this.graphic.translate(translate.x / 2, translate.y / 2)
    //     this.graphic.strokeWeight(0)
    //     this.drawX(points, color)
    //     this.drawY(points, color)
    //     this.drawZ(points, color)
    //     if (false) { //draw origins
    //         this.graphic.strokeWeight(50)
    //         this.graphic.stroke('black')
    //         this.graphic.point(hex_origin.x, hex_origin.y)
    //         this.graphic.strokeWeight(0)
    //     }
    //     this.graphic.translate(-translate.x / 2, -translate.y / 2)
    // }


} 