/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {


    //PagePara is the value that is shown on client's screen. So need to be changed.
    //Return value of this function is the real zeroIndex index of the desired page.
    function getZeroIndexPage(pagePara, totalPagesPara)
    {
        if       (pagePara <= 1                ) {return 0;                }
        else if  (pagePara >= totalPagesPara -1) {return totalPagesPara -1;}
        else                                     {return pagePara - 1;     }
    }
    function checkValidZeroIndexPage(pagePara, totalPagesPara)
    {
        if       (pagePara < 0                ) {return 0;                }
        else if  (pagePara >= totalPagesPara -1){return totalPagesPara -1;}
        else                                    {return pagePara;     }
    }


    var baseUrl = "http://192.168.2.5/document/document-";
    var getUrl = runtime.handlerUrl(element, 'get_page');


    (
        function()
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

            var jsonData = JSON.stringify({"page": page});
            var src = baseUrl + page + ".jpg";

            $.ajax
            (
                {
                    type: "POST",
                    url: getUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("initial");
                        updateCount(result);
                        updatePage(result);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    )();



    function updateCount(result) 
    {
        $('.count', element).text(result.count);
    }
    function updatePage(result)
    {
        $('.currentPage')[0].value = result.page + 1;            
    }

    $('.left', element).click
    (
        function(eventObject) 
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);
                page -= 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
                     console.log(page);


            var jsonData = JSON.stringify({"page": page});

            var src  = baseUrl + page + ".jpg";
            console.log(src);
            $.ajax
            (
                {
                    type: "POST",
                    url: getUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("left")
                        console.log(result.count)

                        updateCount(result);
                        updatePage(result);

                        $('img', element)[0].src = src;
                    }
                }
            );
    });

    $('.right', element).click
    (
        function(eventObject) 
        {

            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

                page += 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
                     console.log(page);

            var jsonData = JSON.stringify({"page": page});

            var src  = baseUrl + page + ".jpg";
            console.log(src);

            $.ajax
            (
                {
                    type: "POST",
                    url: getUrl,
                    data: jsonData,
                    success: function(result)
                    {
                        console.log("right");
                        
                        updateCount(result);
                        updatePage(result);

                        $('img', element)[0].src = "http://192.168.2.5/document/document-1.jpg";
                    }
                }
            );
    });

    


    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
