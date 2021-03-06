$(function() {
    
    //Variables
    var username;
    var url = "https://api.flickr.com/services/rest/?";
    var user_info;
    var galleries = [];

    //Menu control
    var option = 1;

    //User Searched
    var searchedUser = false;
    
    $("#date_input").datepicker();
    $("#date_input2").datepicker();

    /* Menu initialization */
    $(document).ready(function() {
        $("#opcion2").hide();
        $("#opcion3").hide();
        $("#opcion4").hide();
        $("#opcion5").hide();
        $("#opcion6").hide();
        $("#optionsSearch").hide(); 
        $("#return").hide();
    });

    /* Events handler */
    /* Principal buttons and functions are called here */
    $("#userSearchButton").click(function(){
        username = $("#usernameInput").val();
        getIdByUserName();
    });

    $("#enviar1").click(function(){
        var date = $("#date_input").val();
        getPhotosByMinDate(user_id, date);     
    });

    $("#enviar2").click(function(){
        var date = $("#date_input2").val();
        getPhotosByMaxDate(user_id, date);
    });

    $("#enviar3").click(function(){
        var tags = $("#input3").val();
        getPhotosByTags(user_id, tags);

    })

    $("#enviar4").click(function(){
        var text = $("#input4").val();
        getPhotosByContent(user_id, text);
    });

    $("#enviar5").click(function(){
        var input_name = $("#input5").val();
        getPhotosByUserId(user_id, input_name);
    });

    $("#enviar6").click(function(){
        var input_id = $("#galleries").val();
        getPhotosByGalleryId(input_id);
    });


    $("#menu1").click(function(){
        hideDiv(option);
        option = 1;
        showDiv(option);
        emptySearch();
    });

    $("#menu2").click(function(){
        hideDiv(option);
        option = 2;
        showDiv(option);
        emptySearch();
    })

    $("#menu3").click(function(){
        hideDiv(option);
        option = 3;
        showDiv(option);
        emptySearch();
    })

    $("#menu4").click(function(){
        hideDiv(option);
        option = 4;
        showDiv(option);
        emptySearch();
    });

    $("#menu5").click(function(){
        hideDiv(option);
        option = 5;
        showDiv(option);
        emptySearch();
    });

    $("#menu6").click(function(){
        hideDiv(option);
        option = 6;
        showDiv(option);
        emptySearch();
    });

    $("#volver").click(function(){
        $("#return").fadeOut(500);
        $("#optionsSearch").fadeOut(500);
        $("#username").fadeOut(500, function(){
            $("#formSearch").fadeIn(500);
            $("#username").empty();
            $("#galleriesDiv").empty();
            galleries = [];
        });
    });

    /** This function clear images loaded when other options is actived */
    function emptySearch(){
        $("#criterio").empty();
        $("#images").empty();
    }

    /**
    * The function shows options depending on the variable num.
    * @param {Number} num 
    */
    function showDiv(num){
        switch(num){
            case 1:
                $("#menu1").addClass("active");
                $("#opcion1").show();
                break;
            case 2:
                $("#menu2").addClass("active");
                $("#opcion2").show();
                break;
            case 3:
                $("#menu3").addClass("active");
                $("#opcion3").show();
                break;
            case 4:
                $("#menu4").addClass("active");
                $("#opcion4").show();
                break;
            case 5:
                $("#menu5").addClass("active");
                $("#opcion5").show();
                break;
            case 6:
                $("#menu6").addClass("active");
                $("#opcion6").show();
                break;
        }
    }



    /**
    * The function hide options depending on the variable num. 
    * @param {Number} num 
    */
    function hideDiv(num){
        switch(num){
            case 1:
                $("#menu1").removeClass("active");
                $("#opcion1").hide();
                break;
            case 2:
                $("#menu2").removeClass("active");
                $("#opcion2").hide();
                break;
            case 3:
                $("#menu3").removeClass("active");
                $("#opcion3").hide();
                break;
            case 4:
                $("#menu4").removeClass("active");
                $("#opcion4").hide();
                break;
            case 5:
                $("#menu5").removeClass("active");
                $("#opcion5").hide();
                break;
            case 6:
                $("#menu6").removeClass("active");
                $("#opcion6").hide();
                break;
        }
    }


    /**
     * This function return an string with the petition url.
     * @param listParams
     */
    function restPetition(listParams){
        var result = url;
        for(i = 0; i < listParams.length; i++){
            result += listParams[i].param + "=";
            if (i == listParams.length - 1){
                result += listParams[i].value;
            }
            else{
                result += listParams[i].value + "&";
            }
        }
        return result;
    }

    /**
     * This function call ApiRest and load the user id.
     */
    function getIdByUserName(){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.people.findByUsername"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {   "param": "username",
                "value": username
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON({
            url: urlRest,
            async: false
        })

        .done(function(data){
            if(data.stat == "fail"){
                alert("Usuario no encontrado");
            }
            else{
                user_id = data.user.nsid;
                console.log(user_id);
                console.log("Id loaded -> user_id = " + user_id);

                //If user found we load search options
                $("#formSearch").fadeOut(500, function(){
                $("#optionsSearch").fadeIn(500);
                $("#return").fadeIn(500);
                $("#username").append("<h1 class='Three-Dee' id='userNameHeader'>" + username + "</h1>");
                $("#username").fadeIn(500);
                getGalleriesById(user_id)
            });

            $("#menu1").trigger('click');
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });

    }

    /** This function call ApiRest and load photos from an user and a minimum date. 
    This function append images to HTML concurrently too
    @param {String} user_id
    @param {String} date_input
    */
    function getPhotosByMinDate(user_id, date_input){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.photos.search"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {
                "param": "min_taken_date",
                "value": date_input + " 00:00:00"
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON(urlRest)

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar imágenes");
                alert("Fallo al cargar imágenes");
            }
            else{ 
                $("#criterio").empty();
                console.log("Criterio borrado");
                photos = data;
                $("#criterio").append($("<h2>Resultados a partir de " + date_input + " </h2>"));
                console.log("criterio escrito")
                mostrar_fotos(photos);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load photos from an user and a maximum date. 
    * This function append images to HTML concurrently too
    * @param {String} user_id
    * @param {String} date_input
    */
    function getPhotosByMaxDate(user_id, date_input){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.photos.search"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {
                "param": "max_taken_date",
                "value": date_input + " 00:00:00"
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON(urlRest)

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar imágenes");
                alert("Fallo al cargar imágenes");
            }
            else{ 
                $("#criterio").empty();
                console.log("Criterio borrado");
                photos = data;
                $("#criterio").append($("<h2>Resultados hasta " + date_input + " </h2>"));
                console.log("criterio escrito")
                mostrar_fotos(photos);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load photos from an user and tags related with the user. 
    * This function append images to HTML concurrently too
    * @param {String} user_id
    * @param {String} tags
    */
    function getPhotosByTags(user_id, tags){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.photos.search"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {
                "param": "tags",
                "value": tags
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON(urlRest)

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar imágenes");
                alert("Fallo al cargar imágenes");
            }
            else{ 
                $("#criterio").empty();
                console.log("Criterio borrado");
                photos = data;
                $("#criterio").append($("<h2>Resultados por las etiquetas: " + tags + " </h2>"));
                console.log("criterio escrito")
                mostrar_fotos(photos);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load photos from an user with content defined in "content". 
    * This function append images to HTML concurrently too
    * @param {String} user_id
    * @param {String} content
    */
    function getPhotosByContent(user_id, content){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.photos.search"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {
                "param": "text",
                "value": content
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON(urlRest)

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar imágenes");
                alert("Fallo al cargar imágenes");
            }
            else{ 
                $("#criterio").empty();
                console.log("Criterio borrado");
                photos = data;
                $("#criterio").append($("<h2>Fotos que contienen el siguiente texto: " + content + " </h2>"));
                console.log("criterio escrito")
                mostrar_fotos(photos);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load photos from an user and a title. 
    * This function append images to HTML concurrently too
    * @param {String} user_id
    * @param {String} input_name
    */
    function getPhotosByUserId(user_id, input_name){
        //Params
        var fileteredArray = {"photos" : {"photo" : []}};
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.photos.search"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON(urlRest)

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar imágenes");
                alert("Fallo al cargar imágenes");
            }
            else{ 
                var i;
               for(i = 0; i < data.photos.photo.length; i++){
                    var title = data.photos.photo[i].title.toString();
                    if(title.indexOf(input_name) != -1){
                        fileteredArray.photos.photo.push(data.photos.photo[i]);
                    }

               }
                $("#criterio").empty();
                console.log("Criterio borrado");
                $("#criterio").append($("<h2>Resultados por titulos que contienen:  " + input_name + " </h2>"));
                console.log("criterio escrito")
                mostrar_fotos(fileteredArray);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load galleries from an user. 
    * This function is called after user_id is loaded, so this call is configured to run synchronusly
    * after the id is loaded
    * @param {String} user_id
    */
    function getGalleriesById(user_id){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.galleries.getList"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "user_id",
                "value": user_id
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON({
            url: urlRest,
            async: false
        })

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar galerias");
                alert("Fallo al cargar galerías");
            }
            else{ 
                var i;
                for(i = 0; i < data.galleries.gallery.length; i++){
                    var gallery = data.galleries.gallery[i];
                    galleries.push(data.galleries.gallery[i]);
                }
                console.log("Galerias cargadas");
                $("#galleriesDiv").append("<select class='form-control' id='galleries'></select>");
                for(i = 0; i < galleries.length; i++){
                    $("#galleries").append($("<option>" + galleries[i].title._content +"</option>").attr("value", galleries[i].id));
                }
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function call ApiRest and load photos from a gallery. 
    * This function is called after user_id is loaded, so this call is configured to run synchronusly
    * after the id is loaded
    * @param {String} gallery_id
    */
    function getPhotosByGalleryId(gallery_id){
        //Params
        var urlRest = restPetition([
            {   "param" : "method",
                "value" : "flickr.galleries.getPhotos"
            },
            {   "param": "api_key",
                "value": api_key
            },
            {
                "param": "gallery_id",
                "value": gallery_id 
            },
            {   "param": "format",
                "value": "json"
            },
            {
                "param": "nojsoncallback",
                "value": "1"
            }
        ]);

        //Get data
        $.getJSON({
            url: urlRest,
        })

        .done(function(data){
            if(data.stat == "fail"){
                console.log("Fallo al cargar galerias");
                alert("Fallo al cargar galerías");
            }
            else{ 
                $("#criterio").empty();
                console.log("Criterio borrado");
                photos = data;
                $("#criterio").append($("<h2>Fotos de la galeria </h2>"));
                console.log("criterio escrito");
                mostrar_fotos(photos);
            }
        })

        .fail(function(){
            console.log("Error al cargar el recurso");
        });
    }

    /**
    * This function append to html, thumbnails and popup photos from "info" that contains
    * necessary data to build images urls.
    * @param info 
    */
    function mostrar_fotos(info){
        var i;
        $("#images").empty();
        if(info.photos.photo.length == 0){
            $("#images").append($("<p>Sin resultados</p>"));
        }
        for (i=0;i<info.photos.photo.length;i++) {
           var item = info.photos.photo[i];
           var urlSmall = 'https://farm'+item.farm+".staticflickr.com/"+item.server
                      +'/'+item.id+'_'+item.secret+'_m.jpg';
           var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
                      +'/'+item.id+'_'+item.secret+'_c.jpg'; 

            /* Miniatura */
           $("#images").append($("<a></a>").attr("id", "imageLink_" + i));
           $("#imageLink_" + i).attr("data-toggle", "modal");
           $("#imageLink_" + i).attr("data-target", "#popup_" + i); 

           $("#imageLink_" + i).append($("<img/>").attr("id","image_" + i));
           $("#image_" + i).attr("src", urlSmall);
           $("#image_" + i).attr("class", "img-thumbnail image");  

            /* Popup */
            $("#images").append($("<div></div>").attr("id", "popup_" + i));
            $("#popup_" + i).attr("class", "modal fade");
            $("#popup_" + i).attr("class", "modal fade");
            $("#popup_" + i).attr("tabindex", "-1");
            $("#popup_" + i).attr("role", "dialog");
            $("#popup_" + i).attr("aria-labelledby", "myModalLabel");
            $("#popup_" + i).attr("aria-hidden", "true");
            $("#popup_" + i).append($("<div class='modal-dialog'></div>")
                                .append($("<div class='modal-content'></div>")
                                .append($("<div class='modal-body'></div>")
                                .append($("<img class='img-responsive'/>").attr("src", url)))));                                              
        }
    }

})