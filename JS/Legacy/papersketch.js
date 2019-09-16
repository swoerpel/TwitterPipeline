var fs = require('fs');
var path = require('path');
var paper = require('paper-jsdom-canvas');
var chroma = require('chroma-js');

paper.setup(new paper.Size(1200, 1200));
let color_machine = chroma.scale('Spectral');

// var triangle = new paper.Path.RegularPolygon({
//     // center: [cx, cy],
//     sides: 6,
//     radius: Math.random() > 0.5 ? r : r * 2,
//     fillColor: c
// });
// var triangle_symbol = new paper.Symbol(triangle);
// for (var i = 0; i < 500; i++) {
//     console.log('iteration: ' + (i + 1));
//     var r = 50
//     var cx = Math.floor(Math.random() * 12) * 100 + r
//     var cy = Math.floor(Math.random() * 12) * 100 + r
//     // var cx = random_range(r / 2, paper.view.size.width / 100 + r / 2) * 100;
//     // var cy = random_range(r / 2, paper.view.size.height / 100 + r / 2) * 100;
//     console.log(cx, cy)
//     // var cx = random_range(0, paper.view.size.width);
//     // var cy = random_range(0, paper.view.size.height);
//     // var r = random_range(3, 100);

//     // var c = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
//     var c = color_machine(i / 500).hex()
//     // var circle = new paper.Path.Circle({
//     //     center: [cx, cy],
//     //     radius: r,
//     //     fillColor: c
//     // });

//     let placed_triangle = triangle_symbol.place(new paper.Point(cx, cy));

//     Math.random() > 0.5 ? placed_triangle.rotate(30) : placed_triangle.rotate(60)
// }
var r = 100
let topleft = new paper.Point(0, 0);
let rect_size = new paper.Size(r, r);
let squarePath = new paper.Path.Rectangle(topleft, rect_size)
// var squarePath = new paper.Path.Rectangle(new paper.Point(r, r), new paper.Size(r, r));
squarePath.fillColor = 'aquamarine';
// var squareSymbol = new paper.Symbol(squarePath);
console.log()
// lets place some squares using symbols, and rotate each instance slightly
// for (var i = 0; i < 50; i++) {
//     console.log('placing symbol', i)
//     var cx = Math.floor(Math.random() * 12) * 100 + r / 2
//     var cy = Math.floor(Math.random() * 12) * 100 + r / 2
//     squarePath.fillColor = color_machine(i / 500).hex()
//     var placedSymbol = squareSymbol.place(new paper.Point(cx, cy));

//     // placedSymbol.rotate(i * 10); // operation on the instance
// }

console.log('generating SVG');
var svg = paper.project.exportSVG({
    asString: true,
    precision: 2,
    matchShapes: true,
    embedImages: false
});

// fs.writeFile(path.resolve("../images/" + makeid(6).toString() + '.svg'), svg, function (err) {
fs.writeFile(path.resolve("../images/debug00.svg"), svg, function (err) {
    if (err) throw err;
    console.log('Saved!');
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}