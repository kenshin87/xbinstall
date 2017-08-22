/* Javascript for EncryptedXBlock. */
function EncryptedXBlock(runtime, element) {

    var global = {};
        global.baseUrl = $('.CMS_ROOT_URL', element).val()
        global.baseUrl += "/filecms/image/";
        
        //global.baseUrl += "http://127.0.0.1:8001/filecms/image/";


    // PagePara is the value that is shown on client's screen. So need to be changed.
    // Return value of this function is the real zeroIndex index of the desired page.
    function getZeroIndexPage(pagePara, totalPagesPara) //totalPagesPara here is shown in web page
    {
        if       (pagePara <= 1              ) {return 0;                }
        else if  (pagePara >= totalPagesPara ) {return totalPagesPara -1;}
        else                                   {return pagePara - 1;     }
    }
    // After acquiring the zero index value, then we need to add or subtract, 
    // so we still need another validation function in order for it not to overflow. 
    function checkValidZeroIndexPage(pagePara, totalPagesPara)  // totalPagesPara here is the same as above
    {    
        if       (pagePara < 0                  ) {return 0;                }
        else if  (pagePara >= totalPagesPara - 1) {return totalPagesPara -1;}
        else                                      {return pagePara;         }
    }

    // This will be the basic address that we can send ajax request.
    var baseUrl = global.baseUrl;

    // postUrl here is for posting the message to the xblock special handle function.
    var postUrl = runtime.handlerUrl(element, 'get_page');

    // update count and page number
    function updateCount(response) 
    {
        $('.count', element).text(response.count);
    }
    function updatePage(response)
    {
        $('.firstXBlockCurrentPage', element)[0].value = response.page + 1;            
    }


    $(
        function ($)
        {
            function togglePdf(a)
            {
                $(a).hover
                (
                    function()
                    {
                        $(this).children("i").show()
                    },
                    function()
                    {
                        $(this).children("i").hide();
                    }
                )
            }
            togglePdf(".pdf-pre");
            togglePdf(".pdf-next");


            function clickDiv(classNameOfDiv, functionNamePara)
            {
                $(classNameOfDiv, element).click
                (
                    functionNamePara
                );
            }
            clickDiv(".pdf-next",   ShowpageGenerator("next"));
            clickDiv(".pdf-pre",  ShowpageGenerator("pre"));
            //clickDiv(".firstXBlockCurrentPage",  ShowpageGenerator("enter"));            /* Here's where you'd do things on page load. */
        }
    );

    $(
  
        function ()
        {
            // This is to initiate everything.

            var page    = 0;
            var baseUrl = global.baseUrl;
        
            // postUrl here is for posting the message to the xblock special handle function.
            var totalPageUrl = runtime.handlerUrl(element, 'get_totalPages');
            var jsonData = JSON.stringify({"page": page});

            var name       = $('.systemGeneratedRandomNameStu', element).val();

            var src = baseUrl + "getimages/" + name  + "/?page=" + page;

            $.ajax
            (
                {
                    type: "POST",
                    url: totalPageUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        if (response.totalPages > 0)
                        {
                            $('.firstXBlockCurrentPage', element).val(1);
                            $('.firstXBlockImg', element)[0].src = src;
                        }
                    },
                    error: function(response)
                    {
                        alert("cannot return xblock get_totalPages");
                    }
                }
            );
        }
    );


    function ShowpageGenerator(pageFlag)
    {
        return function (eventObject) 
        {
            var page       = parseInt($('.firstXBlockCurrentPage', element).val());
            var totalPages = parseInt($('.firstXBlockTotalPages' , element).text().replace("/", ""));
                page       = getZeroIndexPage(page, totalPages);
                if        (pageFlag == "next" )   { page      += 1;  }
                else if   (pageFlag == "pre"  )   { page      -= 1;  }  
                else if   (pageFlag == "enter")   {               ;  }                           
                page       = checkValidZeroIndexPage(page, totalPages);

            if (pageFlag == "next" ||  pageFlag == "pre")   
            {
                var jsonData = JSON.stringify({"page": page});
                var name       = $('.systemGeneratedRandomNameStu', element).val();

                var src = baseUrl + "getimages/" + name  + "/?page=" + page;

                $.ajax
                (
                    {
                        type: "POST",
                        url: postUrl,
                        data: jsonData,
                        success: function(result)
                        {
                            updateCount(result);
                            updatePage(result);
                            $('.firstXBlockImg', element)[0].src = src;
                        }
                    }
                );                
            }     
        }        
    }

    $(".firstXBlockCurrentPage",  element)[0].addEventListener
    (   "keypress",
        function(eventObject)
        {

            var page       = parseInt($('.firstXBlockCurrentPage', element).val());
            var totalPages = parseInt($('.firstXBlockTotalPages' , element).text().replace("/", ""));
                page       = getZeroIndexPage(page, totalPages);                        
                page       = checkValidZeroIndexPage(page, totalPages);    

            if (eventObject.keyCode == 13)
            {
                var jsonData = JSON.stringify({"page": page});
                var name       = $('.systemGeneratedRandomNameStu', element).val();

                var src = baseUrl + "getimages/" + name  + "/?page=" + page;
                $.ajax
                (
                    {
                        type: "POST",
                        url: postUrl,
                        data: jsonData,
                        success: function(result)
                        {
                            updateCount(result);
                            updatePage(result);
                            $('.firstXBlockImg', element)[0].src = src;
                        }
                    }
                );         
            }                   
        }
    )

    // Reduce the page
    $('.firstXBlockRight', element).click
    (
        ShowpageGenerator("next")
    );

    // Increase the page
    $('.firstXBlockLeft', element).click
    (
        ShowpageGenerator("pre")
    );

    // following are testing codes.

    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    $('.testing', element).click(
        function(eventObject) 
        {
            $.ajax
            (
                {
                    type: "POST",
                    url: handlerUrl,
                    data: JSON.stringify({"hello": "world"}),
                    success: updateCount
                }
            );
        }
    );

    $(
        function ($)
        {
            /* Here's where you'd do things on page load. */
        }
    );
}
