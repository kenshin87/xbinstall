#!/bin/bash
sudo apt-get update && apt-get install libreoffice fonts-wqy-zenhei fonts-arphic-bkai00mp fonts-arphic-bsmi00lp fonts-arphic-gbsn00lp fonts-arphic-gkai00mp fonts-arphic-ukai fonts-arphic-uming fonts-cns11643-kai fonts-cns11643-sung fonts-cwtex-fs fonts-cwtex-heib fonts-cwtex-kai fonts-cwtex-ming fonts-cwtex-yen
;


sudo su edxapp;
#ensure $USER is edxapp
if [  "$USER" != "edxapp" ];
then
    echo "please login using edxapp";
    exit;
fi


cd ~/;
pip install pyPdf;
cd xbinstall;

./setUrl.sh;

mv encryptedxblock ../;
mv filecms    /edx/app/edxapp/edx-platform/common/djangoapps/;

cd ~/;
pip install -e encryptedxblock;

