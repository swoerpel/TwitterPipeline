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