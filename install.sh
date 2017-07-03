if [  "$USER" != "edxapp" ];
then
    echo "please login using edxapp";
    exit;
fi


cd ~/;
pip install pyPdf;

git clone https://github.com/kenshin87/xbinstall.git;
cd xbinstall;

mv firstxblock ../;
mv pdfXBlock   ../;
mv filecms    /edx/app/edxapp/edx-platform/common/djangoapps/;

cd ~/;
pip install -e pdfXBlock;
pip install -e firstxblock;

./setUrl.sh;