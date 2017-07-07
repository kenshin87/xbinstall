# -*- coding:utf-8 -*-
import functools
import logging
import os
import json
import random
import time
import urlparse

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core import exceptions
from django.http import Http404, HttpResponseBadRequest, HttpResponse, StreamingHttpResponse, HttpResponseServerError
from django.shortcuts import render
from django.utils.translation import ugettext as _
from django.views.decorators import csrf
from django.views.decorators.http import require_GET, require_POST

from util.file import store_uploaded_file
import django_comment_client.settings as cc_settings

log = logging.getLogger(__name__)

class GlobalSettings(object):
    IMG_DPI = 200
    ALLOWED_UPLOAD_FILE_TYPE = ['.gif', '.png', '.jpg', '.bmp', '.jpeg', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.zip', '.rar']


def download(request, path):

    """
        download apps from elitemc server
        Args:
            request, path to the file

        Returns:
    """

    def file_iterator(fullname, chunk_size=5120):
        """
            a file iterator for downloading
            Args:
                fullname, chunk_size:

            Returns:
        """

        try:
            with open(fullname) as f:
                while True:
                    content = f.read(chunk_size)
                    if content:
                        yield content
                    else:
                        break
            f.close()
        except IOError:
            log.exception("fail to open file {}".format(fullname))
            raise HttpResponseServerError

    file_dir = settings.MEDIA_ROOT
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)

    server_path = '/'.join(path.split('/')[:-1]).lower()
    app_name = path.split('/')[-1]
    path = os.path.join(server_path, app_name)
    fullname = os.path.join(file_dir, path)
    if not os.path.exists(fullname):
        log.error("{} doesn't exist".format(fullname))
        raise Http404
    elif os.path.isdir(fullname):
        log.error("{} is a directory".format(fullname))
        raise Http404
    else:
        file_size = os.path.getsize(fullname)
        response = StreamingHttpResponse(file_iterator(fullname))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Length'] = file_size
        response['Content-Disposition'] = 'attachment;filename="{0}"'.format(app_name)
        return response

# This is a function requires us to give it the prefixName of the pdf/img as well as giving the GET.page, then it returns that specific jpg.
from django.conf import settings
def getImages(request, name):

    #1. get MEDIA_ROOT
    print settings.MEDIA_ROOT
    root_path = settings.MEDIA_ROOT
    assert len(root_path) > 0

    #2. get jpgs
    jpgPath = os.path.join(root_path, name)
    try:
        files = os.listdir(jpgPath)
        jpgs = [x for x in files if x[-3:] == 'jpg']
    except:
        jpgs = []

    #3. set page variable
    page = request.GET.get("page")
    if page is None:
        page = 0

    #4. get image file
    filePath = os.path.join(jpgPath, name + "-" + str(page) + ".jpg")
    with open(filePath, "r") as fs:
        imageFile = fs.read()

    return HttpResponse(imageFile, content_type="image/png")


# This is almost the same as above, but finally it returns a json string that contains the number of pages of a image folder.
from django.conf import settings
def getImagesQuantity(request):

    # 1. get MEDIA_ROOT
    print settings.MEDIA_ROOT
    root_path = settings.MEDIA_ROOT
    assert len(root_path) > 0

    #2. get jpgs
    name = request.GET.get("imageFolder")
    assert name is not None
    jpgPath = os.path.join(root_path, name)

    try:
        files = os.listdir(jpgPath)
        jpgs = [x for x in files if x[-3:] == 'jpg']

    except:
        jpgs = []

    print 12345
    # return json string: "{result: {pages: 11},}"
    dic = {
        "result":
            {
                'pages': str(len(jpgs)),
            }
    }

    return HttpResponse(json.dumps(dic))



#Modified upload function, it upload the file as well as splitting the file into multiple jpgs.
from django.conf import settings
from django.core.files.storage import DefaultStorage
settings.ALLOWED_UPLOAD_FILE_TYPE = ['.gif', '.png', '.jpg', '.bmp', '.jpeg', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.zip', '.rar']
settings.MAX_UPLOAD_FILE_SIZE     =  52428800
import os



@require_POST
@csrf.csrf_exempt
def upload(request, dictonary = {}):
    """
        view that handles file upload via Ajax
    """
    if  request.method == "GET":
        return render(request, "a.html")

    elif request.method == "POST":

        print "now we are going to upload"

        error = ''
        new_file_name = ''

        allowed_upload_file_types = settings.ALLOWED_UPLOAD_FILE_TYPE
        max_upload_file_size = settings.MAX_UPLOAD_FILE_SIZE

        print settings.MEDIA_ROOT

        try:
            # TODO authorization
            # may raise exceptions.PermissionDenied
            # if request.user.is_anonymous():
            #    msg = _('Sorry, anonymous users cannot upload files')
            #    raise exceptions.PermissionDenied(msg)

            # request.user.assert_can_upload_file()

            base_file_name = str(time.time()).replace('.', str(random.randint(0, 100000)))
            file_storage, new_file_name = store_uploaded_file(
                request, 'file-upload', allowed_upload_file_types, base_file_name,
                max_file_size=max_upload_file_size
            )

            # above was written by previous colleague. If it can reach this point, it means that the file was uploaded.
            # At this point we have 1 variable of "new_file_name"


            assert len(settings.MEDIA_ROOT) > 0

            # At this point the file name must be "name.type", so it has prefix and suffix
            fileType = new_file_name.split(".")[1]
            if fileType != "pdf":
                randomTypeFullNameWithPath = os.path.join(settings.MEDIA_ROOT, new_file_name)
                convertStatus =  libreofficeConvert(randomTypeFullNameWithPath, settings.MEDIA_ROOT)
                assert convertStatus == 0

            pdfName = os.path.join(settings.MEDIA_ROOT, base_file_name+".pdf")

            if not pdfValidPage(pdfName):
                print "not valid pdf"
                dic = {
                    'result':
                        {
                            'msg': "pdf too many pages",
                        }
                }
                return HttpResponse(json.dumps(dic), content_type="text/plain", status=400)

            # Directory is:
            #     jpgsParentFolder =    /edx/var/edxapp/uploads/nameOfJpg

            # Full Path is:
            #     jpgsFullPath     =    /edx/var/edxapp/uploads/nameOfJpg/nameOfJpg.jpg
            jpgsParentFolder = os.path.join(settings.MEDIA_ROOT, base_file_name)
            jpgsFullPath     = os.path.join(settings.MEDIA_ROOT, base_file_name, base_file_name+".jpg")

            try:
                os.mkdir(jpgsParentFolder)
            except:
                raise Exception, "unable to create folder."

            # converting the pdf to jpgs.
            # a border case is when there is only 1 page, then the name will not be regular that we need to change the name.
            # following is for cutting the pdf and creating a folder to store all the jpgs
            successfulFlag = pdfToJpg(pdfName, jpgsFullPath)
            assert(successfulFlag) == 0


            # check regularity of the name, should all be xxx-0.jpg
            files = os.listdir(jpgsParentFolder)
            jpgs = [x for x in files if x[-3:] == 'jpg']
            if len(jpgs) == 1:
                jpgnewFullPath = jpgsFullPath.split(".")[0] + "-0.jpg"
                os.rename(jpgsFullPath, jpgnewFullPath)


        except exceptions.PermissionDenied, err:
            error = err
        except Exception, err:
            print err
            logging.critical(unicode(err))
            error = 'Error uploading file. Please contact the site administrator. Thank you.'

        if error == '':
            result = _('Good')
            file_url = file_storage.url(new_file_name)
            parsed_url = urlparse.urlparse(file_url)
            file_url = urlparse.urlunparse(
                urlparse.ParseResult(
                    parsed_url.scheme,
                    parsed_url.netloc,
                    parsed_url.path,
                    '', '', ''
                )
            )
        else:
            result = ''
            file_url = ''

        # Using content-type of text/plain here instead of JSON because
        # IE doesn't know how to handle the JSON response and prompts the
        # user to save the JSON as a file instead of passing it to the callback.
        dic = {
                    'result':
                    {
                        'msg': result,
                        'error': error,
                        'file_url': file_url,
                    }
                }


        return HttpResponse(json.dumps(dic), content_type="text/plain")


# Helper: Converting the PDF file into multiple JPGs
# the dpi can be specified in order to make the converted jpg more clear.
from wand.image import Image
def pdfToJpg(source, destination):
    with Image(filename=source, resolution=150) as img:

        img.save(filename=destination)

    return 0

import pyPdf
import os
def pdfValidPage(fileName):
    if pyPdf.PdfFileReader(open(fileName)).getNumPages() <= 101:
        return True
    else:
        os.remove(fileName)
        return False

import subprocess
def libreofficeConvert(randomTypeFullNameWithPathPara, mediaRootPara):
    try:
        convertSuccessFlag = subprocess.call(
        [
            "lowriter",
            "--convert-to",
            "pdf",
            randomTypeFullNameWithPathPara,
            "--outdir",
            mediaRootPara
        ]
    )
    except:
        convertSuccessFlag = 1
    return convertSuccessFlag

