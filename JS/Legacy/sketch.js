
let cvs_params = {
  x: 6000,// * 2 * 2,
  y: 4000,
  bgd_colors: ['black', 'lightgray', 'white'],
  dot_color: 'black',
  save_id: ''
}
let grid_params = {
  x: cvs_params.x,
  y: cvs_params.y,
  width: 3,
  height: 2,
  ant_origins_random: true,
  // 0: circle, 
  // 1: right triangle, 
  // 2: equilateral triangle
  // 3: ssssquare
  // 4: block
  draw_shape: 1,
  scale_hex_grid: false,
  rotation: 0,// Math.PI / 6,//Math.PI / 4,
  rotation_delta: Math.PI / 2,
  max_sub_shape: 1, //how many smaller shapes can be drawn before reseting index
  max_step_size: 5,
  step_speed: 1,

  state_count: 250, //also color count, max value a color can be
  stroke_weight: 1, // gets reset immediately by canvas scale
  tile_increment: 100, //  how much an ant can raise or lower a tile value 
  rule_flags: {
    turnRight: true,
    turnLeft: true,
    goStraight: true,
    incStrokeWeight: true,
    decStrokeWeight: true,
    incRotation: true,
    decRotation: true,
    swapDrawShape: false,
    incStepSize: false,
    decStepSize: false,
    incSubShapes: true,
    decSubShapes: true,
  }
}

var palettes;
var master_palette;
var master_palette_group;
var master_colors;
var square_colors;
var default_color_mode = true;
function SetupColors() {
  palettes = Object.keys(chroma.brewer)
  master_palette = palettes[Math.floor(Math.random() * palettes.length)]
  console.log('start colors', master_palette)
  master_palette_group = [
    master_palette,
    palettes[Math.floor(Math.random() * palettes.length)],
    // palettes[Math.floor(Math.random() * palettes.length)],
  ]

  // square_colors = chroma.scale(master_palette)
  // master_colors = chroma.brewer[master_palette]
  master_colors = chroma.brewer['greys']

  // sunset
  // master_colors = ['#ffe577', '#fec051', '#ff8967', '#fd6051', '#392033']
  // blue machine ish
  // master_colors = ['#feeae2', '#c2a7a1', '#323131', '#7b8988', '#2f6061']
  // dark night
  // master_colors = ['#002b44', '#004972', '#016d9c', '#ede5ce', '#c7839c']
  // let master_colors = ['#5C5355', '#AE823C', '#F0C23D', '#9B703F', '#332929']
  // 24k gold
  // let master_colors = ['#a67c00', '#bf9b30', '#ffbf00', '#ffcf40', '#ffdc73']
  // instagram colors
  // master_colors = ['#966842', '#f44747', '#eedc31', '#7fdb6a', '#0e68ce']

  // mountains
  // master_colors = ['#ece2f0', '#a6bddb', '#1c9099']
}

var STROKEWEIGHT;
function SetupStrokeWeight() {
  grid_params.stroke_weight = cvs_params.x / grid_params.width
  STROKEWEIGHT = {
    max: grid_params.stroke_weight * grid_params.stroke_weight,
    min: grid_params.stroke_weight * (1 / grid_params.stroke_weight),
    cycle: [
      grid_params.stroke_weisht * 4,

      // grid_params.stroke_weight * 3 * Math.sqrt(3 / 4), //2
      // grid_params.stroke_weight * 3 * Math.sqrt(3 / 2), //3

      // grid_params.stroke_weight * 3 * Math.sqrt(3),     //4
      // grid_params.stroke_weight * 3 * Math.sqrt(3),     //4
      // grid_params.stroke_weight * 3 * Math.sqrt(3),     //4
      grid_params.stroke_weight * 2,
      // grid_params.stroke_weight * 1.5,
      // grid_params.stroke_weight * 1.4,
      // grid_params.stroke_weight * 1.3,
      // grid_params.stroke_weight * 1.25,
      // grid_params.stroke_weight * 1.2,
      // grid_params.stroke_weight * 1.125,
      grid_params.stroke_weight * 1.0,
      // grid_params.stroke_weight * .95,
      // grid_params.stroke_weight * .9,
      // grid_params.stroke_weight * .85,
      // grid_params.stroke_weight * .8,
      // grid_params.stroke_weight * .75,
      // grid_params.stroke_weight * .7,
      // grid_params.stroke_weight * .65,
      // grid_params.stroke_weight * .6,
      // grid_params.stroke_weight * .55,
      grid_params.stroke_weight * .5,
      // grid_params.stroke_weight * .45,
      // grid_params.stroke_weight * .4,
      // grid_params.stroke_weight * .35,
      // grid_params.stroke_weight * .3,
      // grid_params.stroke_weight * .25,
      // grid_params.stroke_weight * .2,
      // grid_params.stroke_weight * .15,
      // grid_params.stroke_weight * .1,
      // grid_params.stroke_weight / 2,
      // grid_params.stroke_weight * .75,

      // grid_params.stroke_weight / Math.sqrt(2),
      // grid_params.stroke_weight / 4,
      // grid_params.stroke_weight / 8,
      // grid_params.stroke_weight * .25,
    ]

  }
}


var bgd_color_index = 0
var color_palette_index = 1
var grid;
var counter = 0;
var saveOn = false;
PrintControls()
function setup() {
  SetupColors()
  SetupStrokeWeight()
  frameRate(32)
  canvas = createCanvas(cvs_params.x, cvs_params.y);
  canvas.background(cvs_params.bgd_colors[bgd_color_index])
  graphic = createGraphics(cvs_params.x, cvs_params.y)
  graphic.translate(cvs_params.x / grid_params.width / 2, cvs_params.y / grid_params.height / 2)
  grid = new Grid(grid_params, graphic)
  grid.SetupRules()
  grid.SpawnAnt(master_colors, master_palette)
  grid.WalkAnts()
}

let loop = true;

function draw() {
  if (loop) {
    for (let i = 0; i < Math.floor(MAX_STEPS_PER_DRAW * grid_params.step_speed); i++)
      grid.WalkAnts()
    image(graphic, 0, 0)
  }
  if (saveOn) {
    if (cvs_params.save_id === '') {
      cvs_params.save_id = generateHash()
    }
    let filename = cvs_params.save_id + "_" + nf(counter, 3, 0) + ".png";
    console.log('image saved', filename)
    save(filename);
    counter++;
    saveOn = false
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW)
    speedUp()
  if (keyCode === LEFT_ARROW)
    speedDown()
  if (keyCode === 82)  // new grid (n)
    Reset()
  if (keyCode === 32)  //  pause (space)
    playPause()
  if (keyCode === 67) // random colors (c)
    RandomizeColors()
  if (keyCode == 83)  // spawn ant (s)
    SpawnAnt()
  if (keyCode == 80)  // print ants (p)
    grid.PrintAnts()
  if (keyCode == 66)  // cycle background colors (b (+ shift for random))
    CycleBackground()
  if (keyCode == 81)
    toggleSave()
  if (keyCode == 187) //+ circle scale
    incGridSize()
  if (keyCode == 189)  //- circle scale
    decGridSize()
  if (keyCode == 102)
    incRotation()
  if (keyCode == 100)
    decRotation()
  console.log('key pressed:', keyCode)
}


var clear_rect_index = 0;
var clear_rect_coords = [];
function mousePressed() {
  console.log(mouseButton, mouseX, mouseY)
  if (mouseButton === CENTER) {
    let mouse_in_range =
      (mouseX <= cvs_params.x && mouseX > 0) &&
      (mouseY <= cvs_params.y && mouseY > 0)
    if (mouse_in_range) {
      clear_rect_index++;
      let mouse = { x: mouseX, y: mouseY }
      clear_rect_coords.push(mouse)
      if (clear_rect_index == 2) {
        console.log('clearing rectangle at', clear_rect_coords)
        grid.ClearRect(clear_rect_coords)
        image(graphic, 0, 0)
        clear_rect_index = 0;
        clear_rect_coords = []
      }
    }
  }
}

var incRotation = () => {
  grid_params.rotation += grid_params.rotation_delta

}
var decRotation = () => {
  grid_params.rotation -= grid_params.rotation_delta
}

var incGridSize = () => {
  if (grid_params.width < 512 && grid_params.height < 512) {
    grid_params.width *= 2
    grid_params.height *= 2
    console.log(grid_params.width, grid_params.height)
  }
  setup()
}
var decGridSize = () => {
  if (grid_params.width > 2 && grid_params.height > 2) {
    grid_params.width /= 2
    grid_params.height /= 2
    console.log(grid_params.width, grid_params.height)
  }
  setup()
}

var toggleSave = () => {
  saveOn = true
}


var speedUp = () => {
  MAX_STEPS_PER_DRAW += 1//Math.ceil(MAX_STEPS_PER_DRAW * .1)
  console.log('steps per draw', Math.floor(MAX_STEPS_PER_DRAW * grid_params.step_speed))
}

var speedDown = () => {
  MAX_STEPS_PER_DRAW -= 1//Math.ceil(MAX_STEPS_PER_DRAW * .1)
  console.log('steps per draw', Math.floor(MAX_STEPS_PER_DRAW * grid_params.step_speed))
}

var Reset = () => {
  clear();
  setup()
}

var playPause = () => {
  console.log(loop ? 'sim paused' : 'sim running')
  loop = !loop
}

var RandomizeColors = () => {
  grid.RandomizeColors()
  console.log('Colors randomized!')
}

var SpawnAnt = () => {
  let palette_name;
  CYCLE_PALETTES ?
    palette_name = master_palette_group[color_palette_index % master_palette_group.length] :
    palette_name = palettes[Math.floor(Math.random() * palettes.length)]
  color_palette_index++
  let colors = DEF_COLOR_PALETTE ? master_colors : chroma.brewer[palette_name]
  grid.SpawnAnt(colors, palette_name)
}

var CycleBackground = () => {
  console.log('Cycling Background Color')
  if (keyIsDown(16)) //shift
    canvas.background(chroma.random().hex())
  else {
    bgd_color_index = (bgd_color_index + 1) % cvs_params.bgd_colors.length
    canvas.background(cvs_params.bgd_colors[bgd_color_index])
  }
}

function PrintControls() {
  console.log('================================ Steven Woerpel')
  console.log('Langtons Ant Simulator Keyboard Controls:')
  console.log('Reset Grid:\t\t\tr')
  console.log('Play/Pause:\t\t\tspace')
  console.log('Change Speed:\t\t<- | ->')
  console.log('Spawn Ant:\t\t\ts')
  console.log('Randomize Colors:\tc')
  console.log('Print Ants:\t\t\tp')
  console.log('Cycle Bgd Color:\tb (+ SHFT for random color)')
  console.log('================================\n\n\n')
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateHash() {
  console.log('generating params hash...')
  let vital_params = {
    canvas_width: cvs_params.x,
    canvas_height: cvs_params.y,
    grid_width: grid_params.x,
    grid_height: grid_params.y,
    draw_shape: grid_params.draw_shape,
    init_rotation: grid_params.rotation,
    rotation_delta: grid_params.rotation_delta,
    state_count: grid_params.state_count,
    tile_increment: grid_params.tile_increment,
    color_palette: master_palette,
    stroke_weights: STROKEWEIGHT.cycle,
    rules: grid_params.rule_flags,
    ant_rules: grid.GetAntRules(),
    ant_colors: grid.GetAntColors(),
  }
  let vital_params_string = JSON.stringify(vital_params)
  let vital_params_hash = vital_params_string.hashCode()
  let vital_params_B64 = base10_to_base64(vital_params_hash)
  console.log('vital_params', vital_params)
  console.log('vital_params_string', vital_params_string)
  console.log('vital_params_hash', vital_params_hash)
  console.log('vital_params_B64', vital_params_B64)

  // return vital_params_B64
  let prefix;
  if (grid_params.draw_shape == 0)
    prefix = 'CIR'
  if (grid_params.draw_shape == 1)
    prefix = 'RTRI'
  if (grid_params.draw_shape == 2)
    prefix = 'ETRI'
  if (grid_params.draw_shape == 3)
    prefix = 'SQR'
  if (grid_params.draw_shape == 4)
    prefix = 'HEX'
  return prefix + '_' + makeid(6)


}

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function base10_to_base64(num) {
  var order = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  var base = order.length;
  var str = "", r;
  while (num) {
    r = num % base
    num -= r;
    num /= base;
    str = order.charAt(r) + str;
  }
  return str;
}

function base64_to_base10(str) {
  var order = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  var base = order.length;
  var num = 0, r;
  while (str.length) {
    r = order.indexOf(str.charAt(0));
    str = str.substr(1);
    num *= base;
    num += r;
  }
  return num;
}