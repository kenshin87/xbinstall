# encoding=utf-8

"""
This block allows to store the following variables:
    1. src of the image.
    2. current page.
    3. total page.
    4. systemGeneratedRandomName

also, it offers the following functions:
    1. get_name: return systemGeneratedRandomName
    2. set_name: set    systemGeneratedRandomName
    3. set_page: set current page
    4. set_totalPages: set total pages
    5. renewFile: renew file name and display name

Just ingore other variables and functions for testing.
"""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment


class EncryptedXBlock(XBlock):

    systemGeneratedRandomName = String(
        default="notUpload", scope=Scope.settings,
        help="name of the pdf file"
    )

    href = String(
        display_name="href",
        default="http://www.eliteu.cn/static/images/eliteu/index/step.png",
        scope=Scope.user_state,
        help="PDF file that will be shown in the XBlock"
                  )

    display_name = String(
        display_name="Display Name",
        default=u"不可下载PDF",
        scope=Scope.settings,
        help="Name of the component in the edx-platform"
        )

    count = Integer(
        default=0,
        scope=Scope.user_state,
        help="total pages",
    )

    totalPages = Integer(
        default=0,
        scope=Scope.settings,
        help="total pages",
    )
    page = Integer(
        default=0,
        scope=Scope.user_state,
        help="the current page",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the EncryptedXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/encryptedxblockStu.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/encryptedxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/encryptedxblockStu.js"))
        frag.initialize_js('EncryptedXBlock')
        return frag

    def studio_view(self, context=None):
        """
        The primary view of the paellaXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/encryptedxblockTea.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/encryptedxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/encryptedxblockTea.js"))
        frag.initialize_js('EncryptedXBlock')
        return frag

    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        assert data['hello'] == 'world'
        self.count += 1
        return {"count": self.count}

    # in js, we start by getting the firstPage and initialize the total page
    @XBlock.json_handler
    def get_name(self, data, suffix=''):
        return {"systemGeneratedRandomName": self.systemGeneratedRandomName}

    # in js, we start by getting the firstPage and initialize the total page
    @XBlock.json_handler
    def set_page(self, data, suffix=''):
        totalPages = int(data["totalPages"])
        print totalPages
        self.totalPages = totalPages
        return {"result": "successful"}

    @XBlock.json_handler
    def get_totalPages(self, data, suffix=''):
        print "enter total"
        return {"totalPages": self.totalPages}

    @XBlock.json_handler
    def get_page(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        newPage = int(data["page"])
        print newPage, self.page, self.totalPages
        # Just to show data coming in...
        if newPage >= 0 and newPage < self.totalPages:
            self.page = newPage
        self.count += 1
        # print self.page
        return {"count": self.count, "page": self.page, "totalPages": self.totalPages}

    @XBlock.json_handler
    def renewFile(self, data, suffix=''):
        self.systemGeneratedRandomName = data["systemGeneratedRandomName"]
        self.display_name = data["displayName"]
        # Here need to check how many file are there inside the server
        return {
            "systemGeneratedRandomName": self.systemGeneratedRandomName,
            "displayName": self.display_name
        }

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("EncryptedXBlock",
             """<encryptedxblock/>
             """),
            ("Multiple EncryptedXBlock",
             """<vertical_demo>
                <encryptedxblock/>
                <encryptedxblock/>
                <encryptedxblock/>
                </vertical_demo>
             """),
        ]
