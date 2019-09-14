import sys
from PIL import Image, ImageDraw
from os import listdir
from os.path import isfile, join


def main(argv):
    image_sources = argv[0]
    image_dest = argv[1]
    argument = ''
    usage = 'usage: script.py -f <sometext>'
    print('image source and dest', image_source, image_dest)
    images = [f for f in listdir(image_source)if isfile(join(image_source, f))]
    print('files in source', images)
    # im1 = Image.open(image_source + images[0])
    # im2 = Image.open(image_source + images[1])
    # transparent_area = (0, 0, im1.size[0]/2, im1.size[0])
    # print('image size', im1, im2)
    # mask = Image.new('L', im1.size, color=255)
    # draw = ImageDraw.Draw(mask)
    # draw.rectangle(transparent_area, fill=0)
    # im1.putalpha(mask)
    # dst = Image.new('RGB', (im1.width, im1.height))
    # dst.paste(im2, (0, 0))
    # dst.paste(im1, (0, 0))
    # dst.save(image_dest + '/output.png')
    # final2 = Image.new("RGBA", im1.size)
    # final2 = Image.alpha_composite(final2, im1)
    # final2 = Image.alpha_composite(im1, im2)
    # final2.save(image_dest + '/output.png')


if __name__ == "__main__":
    main(sys.argv[1:])

# import sys
# import json
# import numpy as np

# # Read data from stdin


# def read_in():
#     lines = sys.stdin.readlines()
#     print('lines', lines)
#     # Since our input would only be having one line, parse our JSON data from that
#     return json.loads(lines[0])
#     # return json.loads(lines[0])


# def main():
#     # get our data as an array from read_in()
#     lines = read_in()

#     # print(sys.argv[0], 'inside of applymask')
#     # create a numpy array
#     np_lines = np.array(lines)

#     # use numpys sum method to find sum of all elements in the array
#     lines_sum = np.sum(np_lines)
#     # lines_sum = sys.argv[0] + 'dave'
#     # return the sum to the output stream
#     print lines_sum


# # start process
# if __name__ == '__main__':
#     main()
