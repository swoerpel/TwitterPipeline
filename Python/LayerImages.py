import sys
import numpy
import random
import json
from PIL import Image, ImageDraw
from os import listdir
from os.path import isfile, join


def main(argv):
    mask_sources = json.loads(argv[0])
    image_source = argv[1]
    composite_dest = argv[2]
    composite_name = argv[3]
    layer_params = json.loads(argv[4])  # new
    color_params = json.loads(argv[5])  # new
    image_params = FilterImages(image_source)
    print('Layer Params', layer_params)
    top_im = GetImage(
        image_params[layer_params['top_shape']],
        color_params['top'],
        image_source)
    bottom_im = GetImage(
        image_params[layer_params['bottom_shape']],
        color_params['bottom'],
        image_source)
    mask = GetMask(mask_sources[layer_params['mask_type']])
    print('Composite Image ->', composite_name)
    composite = Image.composite(top_im, bottom_im, mask)
    composite.save(composite_dest+composite_name)


def GetImage(image_params, palette, path):
    image_options = []
    for i in image_params:
        if i['palette'] == palette:
            params = i
            image_options.append(i)
    params = image_options[random.randint(0, 1)]
    print('IMAGE OPTIONS', image_options, params)
    image_name = "SHAPE-"
    image_name += str(params['step_shape'])
    image_name += "_GRID-"
    image_name += str(params['grid_size'])
    image_name += "_"
    image_name += params['palette']
    image_name += "_"
    image_name += params['index']
    image_name += ".png"
    return Image.open(path + image_name)


def GetMask(path):
    image_names = [f for f in listdir(path)
                   if isfile(join(path, f))]
    rand_im = numpy.random.randint(0, len(image_names))
    return Image.open(path + image_names[rand_im]).convert('L')


def FilterImages(path):
    image_names = [f for f in listdir(path)
                   if isfile(join(path, f))]
    image_params = []
    print('IMAGE NAMES', len(image_names))
    for r in range(len(image_names)):

        values = image_names[r].split('_')
        # print("values", r, values[3].split('.')[0])
        param = {
            'step_shape': int(values[0].split('-')[1]),
            'grid_size': int(values[1].split('-')[1]),
            'palette': values[2],
            'index': values[3].split('.')[0],
        }
        # print('paramS', param)
        image_params.append(param)
        squares = []
        circles = []
        triangles = []
        for i in image_params:
            if i['step_shape'] == 0:
                squares.append(i)
            elif i['step_shape'] == 1:
                circles.append(i)
            elif i['step_shape'] == 2:
                triangles.append(i)
            else:
                print('step shape out of range (FilterImages)')
    random.shuffle(squares)
    random.shuffle(circles)
    random.shuffle(triangles)
    return {
        0: squares,
        1: circles,
        2: triangles
    }


if __name__ == "__main__":
    main(sys.argv[1:])
