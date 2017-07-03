/* Javascript for FirstXBlock. */
function FirstXBlock(runtime, element) {

    var global = {};
        global.baseUrl = "http://127.0.0.1:8002/filecms/image/";


    // PagePara is the value that is shown on client's screen. So need to be changed.
    // Return value of this function is the real zeroIndex index of the desired page.
    function getZeroIndexPage(pagePara, totalPagesPara) //totalPagesPara here is shown in web page
    {
        if       (pagePara <= 1              ) {return 0;                }
        else if  (pagePara >= totalPagesPara ) {return totalPagesPara -1;}
        else                                   {return pagePara - 1;     }
    }
    // After acquiring the zero index value, then we need to add or subtract, 
    // so we still need another validation function in order for it not to become overflow. 
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

    
    // Need to initialize the img when the client start to load the page.
/*
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
*/

    // update count and page number
    function updateCount(response) 
    {
        $('.count', element).text(response.count);
    }
    function updatePage(response)
    {
        $('.currentPage')[0].value = response.page + 1;            
    }


/*
    (
        function()
        {
        	alert("initiating")
            function setPage(response)
            {
                $('.currentPage', element).val(1);
                console.log($('.currentPage', element));
                window.cur = $('.currentPage', element);
            }

            function setTotalPage(response)
            {
                $('.totalPages', element).val(response["pages"]);
                console.log( $('.totalPages', element).val);
            }            

            function initializePage(response)
            {
                // postUrl here is for posting the message to the xblock special handle function.
                var postUrl = runtime.handlerUrl(element, 'set_page');

                var page       = 0;
                var totalPages = response["pages"];
                var jsonData = JSON.stringify({"page": page, "totalPages": totalPages});

                $.ajax
                (
                    {
                        type: "POST",
                        url: postUrl,
                        data: jsonData,
                        success: function(response)
                        {
                            console.log(response["result"]);

                        }
                    }
                );
            }       

            //     What we want to do is firstly get the number of jpgs. But the issue here is that all the files are stored inside the teacher's server, 
            // so we cannot use a post method, what we can do is just use a get method to visit teacher's server.
            //             
            var name       = $('.systemGeneratedRandomName', element).text();

            var baseUrl    = global.baseUrl;
            var getUrl     = baseUrl + "getimagesquantity/";
            var src        = baseUrl + "getimages/" + name + "?page=0";
            var jsonData   = {"imageFolder": name};
            console.log(src);

            $.ajax
            (
                {
                    type: "GET",
                    url: getUrl,
                    data:jsonData,
                    success: function(response)
                    {
                        if (typeof(response) != "string")
                        {
                            response = JSON.stringify(response);
                        }
                        
                        response = JSON.parse(response)["result"];

                        // only execute consequential codes when result.pages > 0; 
                        if (response["pages"] > 0 )
                        {
                            setTotalPage(response);
                            initializePage(response);
                            setPage();
                            $('img', element)[0].src = src;
                        }
                    }
                }
            );
        }
    )();

*/

    $('.show', element).click
    (
        function()
        {
            console.log(postUrl);
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);

            var name       = $('.systemGeneratedRandomName', element).text();
                console.log(name);

            var jsonData = JSON.stringify({"page": page});
            var src = baseUrl + "getimages/" + name  + "/?page=" + page;
            console.log(src);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
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
    );

    // Reduce the page
    $('.left', element).click
    (
        function(eventObject) 
        {
            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);
                page      -= 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
            

            var jsonData = JSON.stringify({"page": page});
            var name       = $('.systemGeneratedRandomName', element).text();

            //var src  = baseUrl + page + ".jpg";
            //var src = baseUrl + name + "?page=" + page; 
            var src = baseUrl + "getimages/" + name  + "/?page=" + page;


            console.log(src);
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
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
        }
    );

    // Increase the page
    $('.right', element).click
    (
        function(eventObject) 
        {

            var page       = parseInt($('.currentPage', element)[0].value);
            var totalPages = parseInt($('.totalPages' , element)[0].value);
                page       = getZeroIndexPage(page, totalPages);
                page      += 1; 
                page       = checkValidZeroIndexPage(page, totalPages);
                page = page.toString();
                     console.log(page);

            var name       = $('.systemGeneratedRandomName', element).text();

            var jsonData = JSON.stringify({"page": page});

            //var src = baseUrl + name + "?page=" + page; 
            //var src  = baseUrl + page + ".jpg";
            var src = baseUrl + "getimages/" + name  + "/?page=" + page;



            console.log(src);

            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        window.respp = response;
                        console.log(response);
                        console.log("right");             
                        updateCount(response);
                        updatePage(response);
                        $('img', element)[0].src = src;
                    }
                }
            );
        }
    );




    // following are testing codes.

    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');
    window.handlerUrl = handlerUrl;
    console.log(handlerUrl);

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

    // Reduce the page
    $('.buttonsetname', element).click
    (
        function(eventObject) 
        {

            var postUrl = runtime.handlerUrl(element, 'renewFile');


            var key   = "systemGeneratedRandomName";

            var value = $('.inputsetname')[0].value;

            var jsonData = JSON.stringify({[key]: value});

            console.log(jsonData);
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(response)
                    {
                        console.log("renew");
                        $(".systemGeneratedRandomName").text(response["systemGeneratedRandomName"]);
                    }
                }
            );
        }
    );


    
    $('.printSystemGeneratedRandomName', element).click
    (
        function()
        {
            var postUrl = runtime.handlerUrl(element, 'updateFile');
            var jsonData = JSON.stringify({"systemGeneratedRandomName": "systemGeneratedRandomName"});
           
            $.ajax
            (
                {
                    type: "POST",
                    url: postUrl,
                    data: jsonData,
                    success: function(result)
                    {


                        console.log(result);
                        console.log(result["systemGeneratedRandomName"]);
                    }
                }
            );
        }
    );
    


    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
