import sys
import numpy
import json
from PIL import Image, ImageDraw
from os import listdir
from os.path import isfile, join


def main(argv):
    mask_sources = json.loads(argv[0])
    image_source = argv[1]
    composite_dest = argv[2]
    composite_name = argv[3]
    image_params = FilterImages(image_source)

    top_shape = 'circles'
    bottom_shape = 'triangles'
    mask_type = 'triangles'

    top_palette = 'gnbu'
    bottom_palette = 'YlOrRd'

    top_im = GetImage(
        image_params[top_shape],
        top_palette,
        image_source)
    bottom_im = GetImage(
        image_params[bottom_shape],
        bottom_palette,
        image_source)
    mask = GetMask(mask_sources[mask_type])
    print('MASK', mask, top_im, bottom_im)
    composite = Image.composite(top_im, bottom_im, mask)
    composite.save(composite_dest+composite_name)


def GetImage(image_params, palette, path):
    for i in image_params:
        if i['palette'] == palette:
            params = i
    image_name = "SHAPE-"
    image_name += str(params['step_shape'])
    image_name += "_GRID-"
    image_name += str(params['grid_size'])
    image_name += "_"
    image_name += params['palette']
    image_name += ".png"
    print('image name', image_name)
    return Image.open(path + image_name)


def GetMask(path):
    image_names = [f for f in listdir(path)
                   if isfile(join(path, f))]
    print('get mask', image_names)
    rand_im = numpy.random.randint(0, len(image_names))
    return Image.open(path + image_names[rand_im]).convert('L')


def FilterImages(path):
    image_names = [f for f in listdir(path)
                   if isfile(join(path, f))]
    image_params = []
    for i in image_names:
        values = i.split('_')
        param = {
            'step_shape': int(values[0].split('-')[1]),
            'grid_size': int(values[1].split('-')[1]),
            'palette': values[2].split('.')[0]
        }
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
    return {
        'squares': squares,
        'circles': circles,
        'triangles': triangles
    }


if __name__ == "__main__":
    main(sys.argv[1:])
