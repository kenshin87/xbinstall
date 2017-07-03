#!/usr/bin/python

import os
import time
print(1231234)
print(os.getcwd())

os.chdir("/edx/app/edxapp/edx-platform/cms")
print(os.listdir(os.getcwd()))


def changeUrl():
    rdTime = str(int(time.time()))
    newName= "urls"+ rdTime + ".py" 
    os.system("cp urls.py %s"%newName)
    string = ""
    fs = open("urls.py", "r")
    lines = fs.readlines()
    fs.close()
    fs = open("urls.py", "w")
    for i in lines:
        if "url(r'^transcripts/upload$'" in i:
            fs.write("url(r'^filecms/', include('filecms.urls')),\n")
        fs.write(i)
    fs.close()

changeUrl()
