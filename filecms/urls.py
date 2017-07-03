# -*- coding:utf-8 -*-
from django.conf.urls import patterns, url
from django.conf import settings


urlpatterns = patterns(
    'filecms.views',


    #url(r'^download/(.+)', 'download', name='eliteu_files_download'),

    url(r'^upload/$', 'upload', name='eliteu_files_upload'),
    url(r'^image/getimagesquantity/$', "getImagesQuantity",),
    url(r'^image/getimages/(?P<name>[\s\S]+)/$', "getImages",),
)
