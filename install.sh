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
mv pdfXBlock       ../;
mv filecms    /edx/app/edxapp/edx-platform/common/djangoapps/;

cd ~/;
pip install -e pdfXBlock;
pip install -e encryptedxblock;

