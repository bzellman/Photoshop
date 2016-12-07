import os, sys
from Tkinter import Tk
from tkFileDialog import askopenfilename
from tkFileDialog import askdirectory
from psd_tools import PSDImage

#select folder containing the photoshop documents
Tk().withdraw()
directory = askdirectory()
path = os.listdir( directory )

#loop throguh all documents / resize them and save them
for filename in path: 
  #create full path
  fullPath = directory + '/' + filename
  psd = PSDImage.load(fullPath)
  #get entire image (layer 0)
  groupOfAllLayers = psd.layers[0]
  groupOfAllLayers = psd.as_PIL()
  newImgae = groupOfAllLayers.resize((groupOfAllLayers.size[0]/2,groupOfAllLayers.size[1]/2))
  newImgae.save(directory+ '/Link Map' + filename + '.png')



