class Block {
    constructor() {
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

    getHexVertices(local_hex_origin, hex_radius, rotation = 0) {
        let angle = Math.PI * 2 / 6
        let points = []
        let orientation = 0//Math.PI / 6 // -> pointy top : 0 -> flat top
        for (let a = 0; a < Math.PI * 2 * (1 - 1 / 6); a += angle) {
            let sx = local_hex_origin.x + Math.cos(a + orientation + rotation) * hex_radius;
            let sy = local_hex_origin.y + Math.sin(a + orientation + rotation) * hex_radius;
            points.push({ x: sx, y: sy })
        }
        return points
    }

    GenerateBlock(local_origin, radius, type) {
        let mid_radius = Math.sqrt(3) * radius / 2 //height
        let outer_hex_vertices = this.getHexVertices(local_origin, radius)
        let mid_hex_vertices = this.getHexVertices(local_origin, mid_radius, Math.PI * 2 / 12)
        let inner_hex_vertices = this.getHexVertices(local_origin, radius / 2)

        let local_hex_grid = [
            local_origin,
            ...inner_hex_vertices,
            ...outer_hex_vertices,
            ...mid_hex_vertices,
        ]
        let block_vertices = this.block_templates[type]
        let faces = []
        block_vertices.map((f) => {
            // console.log('FUCK', f)
            faces.push({
                points: this.getFaceVertices(f.face, local_hex_grid),
                color_index: f.color_index
            });

        });
        return faces
    }

    GetBlockTypeCount() {
        return this.block_templates.length
    }

    getFaceVertices(block_vertices, local_hex_grid) {
        let face = []

        block_vertices.map((v, index) => {
            face.push({
                x: local_hex_grid[v].x,
                y: local_hex_grid[v].y,
            })
        });
        return face
    }



    /* LEGACY!!!!
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
        let template_index = Math.floor(Math.random() * this.block_templates.length)
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
    */
}
module.exports = Block