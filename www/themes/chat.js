var socket;
jQuery(function($){
	socket = io.connect("http://190.60.211.17:3003");
	//socket = io.connect("http://192.168.1.54:3001");
	var $messageForm = $('#send-message');
	var $messageBox = $('#message');
	var $chat = $('#chat');
	
	socket.on('connect', function() {
		$(".btnEnviar").click(function(e){
      var idPage = $.mobile.activePage.attr('id');
      var texto = $( "#textMessage" + idPage ).val()
      //var idMonitorObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
      var idUsuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
      var tipoUsuarioDestino = "";

      // Los eliminamos todos
      for (var i = 0; i < specialChars.length; i++) {
         usuarioSesion= usuarioSesion.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
         idUsuarioObjetivo= idUsuarioObjetivo.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
      }   
      if(localStorage.getItem("idMonitorObjetivoAPPMONITOR") == "prueba@ssca.com"){
        idUsuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
        tipoUsuarioDestino = "CENTRO";
      }else{
        tipoUsuarioDestino = "ACUDIENTE";
      }
      if($.trim(texto).length != 0){
        socket.emit('send message', {
          message: texto, 
          origen: idUsuarioObjetivo, //"centro"
          objetivo: usuarioSesion,   //"acudiente"
          tipo: "MONITOR", 
          usuarioF: localStorage.getItem("idMonitorObjetivoAPPMONITOR"), 
          usuarioS: localStorage.getItem("idmonitorMonitor")
        });
        var array = {
          mensaje: texto,
          origen: localStorage.getItem("idmonitorMonitor"),
          destino: localStorage.getItem("idMonitorObjetivoAPPMONITOR"),
          usuario1: localStorage.getItem("idMonitorObjetivoAPPMONITOR"),
          usuario2: localStorage.getItem("idmonitorMonitor")
        }
        $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarMensajeChat", array)
        .done(function( dato ) {
        })
        $.post("http://190.60.211.17/push/ActionEnviarMensajeChat.php", {idestudiante: localStorage.getItem("idMonitorObjetivoAPPMONITOR"), tipoUsuario: tipoUsuarioDestino})
        .done(function( dato ) {
          console.log(dato)
        })
        console.log(idUsuarioObjetivo)
        $( "#textMessage" + idPage ).val("")
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
          '<span class="right">' + texto + '</span>' +
          '<div class="clear"></div>' +
        '</li>');
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
        
        //$( "#myPopup" + idPage + " > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > .panel-chat > .panel-body")[0].scrollHeight}, 1000);
      }
    });
		
		socket.on('new message', function(data){
			//$chat.append(data + "<br/>");
      console.log(JSON.stringify(data))
			var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
			var idPage = $.mobile.activePage.attr('id');
      var idObjeto = idPage.split("page");
      //var idMonitorObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
       
      switch(data.tipo){
        case "CENTRO":
          var origen = "prueba@ssca.com";
          if(data.usuarioF == usuarioSesion){
            console.log($("#chatCentro").length)
            if($("#chatCentro" + idObjeto[1]).length != 0 ){              
              localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO","prueba@ssca.com");  
              var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
              if(usuarioObjetivo != "prueba@ssca.com"){
                var contadorLi = 0;
                $( '#' + idPage + ' > .ui-content > a > img').css({"background": "orange", "border": "3px solid orange"})              
                $( '#chatCentro' + idObjeto[1]).css({"background": "orange", "border": "1px solid orange"})
                /*$( '#' + idPage + ' > .ui-content > a > img' ).each(function( index ) {
                  if($(this).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;
                  }
                });
                if($( '#' + idPage + ' > .ui-content > a > span').length != 0 ){
                  $( '#' + idPage + ' > .ui-content > a > span').html(contadorLi)
                }else{
                  $( '#' + idPage + ' > .ui-content > a').append('<span style="top: 55; position: absolute; left: 66; color: orange">' + contadorLi + '</span>')
                }*/
              }else{               

                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                  '<img src="themes/images/bus icono.png" alt=""/>' +
                  '<span class="left">' + data.message + '</span>' +
                  '<div class="clear"></div>' +
                '</li>');
                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                
              }
              
              

              $("#chatCentro" + idObjeto[1]).click(function(e){  
                var id = $(this).attr("id") 
                localStorage.setItem("idMonitorObjetivoAPPMONITOR","prueba@ssca.com");  
                var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
                var idMonitor = $(this).attr("id")
                var Monitor = $(this).html()
                $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
                  var idLi = $(this).attr("id")
                  if(idLi == "chatCentro" + idObjeto[1]){
                    if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;            
                    }
                  }else{
                    if($("#" + idLi).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;
                    }
                  }
                });
                
                
                if(contadorLi == 1 || contadorLi == 0){
                  $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
                }
                $("#" + id).css({"background": "none", "border": "none"})
                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
                if(usuarioObjetivo != "prueba@ssca.com" && usuarioObjetivo != null){
                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                                    
                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                }else{                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                  console.log(usuarioObjetivo)
                  //Mostrar mensajes anteriores
                }
                
                var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
                var array = {
                  usuario1: usuarioObjetivo,
                  usuario2: usuarioSesion
                }
                $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerChatUsuario", array)
                .done(function( resul ) {console.log(resul)
                  var mensajes = JSON.parse(resul);;
                  if(mensajes.length > 0){
                    for (var j = 0; j < mensajes.length; j++) {
                      console.log(mensajes[j].origen + " " + usuarioSesion)
                      if(usuarioSesion == mensajes[j].origen){
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                            '<span class="right">' + mensajes[j].message + '</span>' +
                            '<div class="clear"></div>' +
                        '</li>');
                      }else{
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                          '<img src="themes/images/bus icono.png" alt=""/>' +
                          '<span class="left">' + mensajes[j].message + '</span>' +
                          '<div class="clear"></div>' +
                        '</li>');                                    
                      }
                    }
                  }
                  var heightItems = 0;
                  //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
                    heightItems += parseInt($(this).height()) + 10;
                  });
                  console.log(heightItems)
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );

                })
              })

              if($( "#myPopup" + idPage + " > ul > li").length != 0 ){
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
              }else{
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
              }
            }else{                
              $( "#myPopup" + idPage + " > ul").append('<li id="chatCentro' + idObjeto[1] + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child">CENTRO DE OPERACIONES</li>')
              $( '#' + idPage + ' > .ui-content > a > img').css({"background": "orange", "border": "3px solid orange"})              
              $( '#chatCentro' + idObjeto[1]).css({"background": "orange", "border": "1px solid orange"})
              localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO","prueba@ssca.com");  
              var contadorLi = 0;
              /*$( '#' + idPage + ' > .ui-content > a > img' ).each(function( index ) {
                if($(this).css("background-color") == "rgb(255, 165, 0)"){
                    contadorLi++;
                }
              });*/

              if($( "#myPopup" + idPage + " > ul > li").length != 0 ){
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
              }else{
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
              }

              /*if($( '#' + idPage + ' > .ui-content > a > span').length != 0 ){
                $( '#' + idPage + ' > .ui-content > a > span').html(contadorLi)
              }else{
                $( '#' + idPage + ' > .ui-content > a').append('<span style="top: 55; position: absolute; left: 66; color: orange">' + contadorLi + '</span>')
              }*/
              
              $("#chatCentro" + idObjeto[1]).click(function(e){ 
                var id = $(this).attr("id") 
                localStorage.setItem("idMonitorObjetivoAPPMONITOR","prueba@ssca.com");   
                var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
                var idMonitor = $(this).attr("id")
                var Monitor = $(this).html()
                $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
                  var idLi = $(this).attr("id")
                  if(idLi == "chatCentro" + idObjeto[1]){
                    if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;            
                    }
                  }else{
                    if($("#" + idLi).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;
                    }
                  }
                });
                
                
                if(contadorLi == 1 || contadorLi == 0){
                  $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
                }
                $("#" + id).css({"background": "none", "border": "none"})
                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
                if(usuarioObjetivo != "prueba@ssca.com" && usuarioObjetivo != null){
                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                                    
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                }else{
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                  console.log(usuarioObjetivo)
                  //Mostrar mensajes anteriores
                }
                /*$( '#' + idPage + ' > .ui-content > a > img' ).each(function( index ) {
                  var contadorLi = 0;
                  if($(this).css("background-color") == "rgb(255, 165, 0)"){
                    contadorLi++;
                  }
                });
                if(contadorLi == 1){
                  $( '#' + idPage + ' > .ui-content > a > span').remove()
                }else{
                  $( '#' + idPage + ' > .ui-content > a > span').html(contadorLi)
                }*/
                var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
                var array = {
                  usuario1: usuarioObjetivo,
                  usuario2: usuarioSesion
                }
                $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerChatUsuario", array)
                .done(function( resul ) {console.log(resul)
                  var mensajes = JSON.parse(resul);;
                  if(mensajes.length > 0){
                    for (var j = 0; j < mensajes.length; j++) {
                      console.log(mensajes[j].origen + " " + usuarioSesion)
                      if(usuarioSesion == mensajes[j].origen){
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                            '<span class="right">' + mensajes[j].message + '</span>' +
                            '<div class="clear"></div>' +
                        '</li>');
                      }else{
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                          '<img src="themes/images/bus icono.png" alt=""/>' +
                          '<span class="left">' + mensajes[j].message + '</span>' +
                          '<div class="clear"></div>' +
                        '</li>');                                    
                      }
                    }
                  }
                  var heightItems = 0;
                  //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
                    heightItems += parseInt($(this).height()) + 10;
                  });
                  console.log(heightItems)
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );

                })
              })
              var origen = "prueba@ssca.com";
              $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerJSONChatSesion", {})
              .done(function( dato ) {console.log(dato)
                if($.trim(dato) != ""){
                  var jsonChats = JSON.parse(dato);
                  var usuarioSesion = localStorage.getItem("idmonitorMonitor");
                  var con = 0;
                  for (var i = 0; i < jsonChats.length; i++) {
                    if(jsonChats[i]){
                      if(jsonChats[i].usuarioF == data.usuarioF && jsonChats[i].usuarioS == usuarioSesion){
                        con++;
                      }
                    }
                  }
                  if(con == 0){
                    jsonChats[jsonChats.length] = {origen: origen, destino: usuarioSesion, usuarioF: origen, usuarioS: usuarioSesion, tipo:"CENTRO"}
                    $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
                    .done(function( result ) {
                      console.log(result)
                    });
                  }
                }else{
                  var jsonChats = JSON.parse("[]");
                  jsonChats[jsonChats.length] = {origen: origen, destino: usuarioSesion, usuarioF: origen, usuarioS: usuarioSesion, tipo:"CENTRO"}
                  $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
                  .done(function( result ) {
                    console.log(result)
                  });
                }
              });  
            }
            
          }
          break;

          case "ACUDIENTE":
          var origen = data.usuarioS;
          if(data.usuarioF == usuarioSesion){
            console.log($("#").length)
            if($("#" + idObjeto[1] + data.objetivo).length != 0 ){              
              
              var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
              if(usuarioObjetivo != origen){
                var contadorLi = 0;
                $( '#' + idPage + ' > .ui-content > a > img').css({"background": "orange", "border": "3px solid orange"})              
                $( "#" + idObjeto[1] + data.objetivo).css({"background": "orange", "border": "1px solid orange"})
                localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO", data.objetivo);  
                /*$( '#' + idPage + ' > .ui-content > a > img' ).each(function( index ) {
                  if($(this).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;
                  }
                });
                if($( '#' + idPage + ' > .ui-content > a > span').length != 0 ){
                  $( '#' + idPage + ' > .ui-content > a > span').html(contadorLi)
                }else{
                  $( '#' + idPage + ' > .ui-content > a').append('<span style="top: 55; position: absolute; left: 66; color: orange">' + contadorLi + '</span>')
                }*/
              }else{               

                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                  '<img src="themes/images/bus icono.png" alt=""/>' +
                  '<span class="left">' + data.message + '</span>' +
                  '<div class="clear"></div>' +
                '</li>');
                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                
              
              }              
              
              $("#" + idObjeto[1] + data.objetivo).click(function(e){ 
                var id = $(this).attr("id") 
                var idMonitor = $(this).attr("persona")
                var Monitor = $(this).html()
                localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
                var idPage = $.mobile.activePage.attr('id');   
                var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
                
                console.log(Monitor)
                $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
                
                if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                }else{
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                  //Mostrar mensajes anteriores
                  
                }
                $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
                  var idLi = $(this).attr("id")
                  if(idLi == "chatCentro" + idObjeto[1]){
                    if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;            
                    }
                  }else{
                    if($("#" + idLi).css("background-color") == "rgb(255, 165, 0)"){
                      contadorLi++;
                    }
                  }
                });
                
                
                if(contadorLi == 1 || contadorLi == 0){
                  $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
                }
                $("#" + id).css({"background": "none", "border": "none"})
                var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
                var array = {
                  usuario1: usuarioObjetivo,
                  usuario2: usuarioSesion
                }
                $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerChatUsuario", array)
                .done(function( resul ) {console.log(resul)
                  var mensajes = JSON.parse(resul);;
                  if(mensajes.length > 0){
                    for (var j = 0; j < mensajes.length; j++) {
                      console.log(mensajes[j].origen + " " + usuarioSesion)
                      if(usuarioSesion == mensajes[j].origen){
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                            '<span class="right">' + mensajes[j].message + '</span>' +
                            '<div class="clear"></div>' +
                        '</li>');
                      }else{
                        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                          '<img src="themes/images/bus icono.png" alt=""/>' +
                          '<span class="left">' + mensajes[j].message + '</span>' +
                          '<div class="clear"></div>' +
                        '</li>');                                    
                      }
                    }
                  }
                  var heightItems = 0;
                  //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
                    heightItems += parseInt($(this).height()) + 10;
                  });
                  console.log(heightItems)
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );

                })
               
                
              })

              if($( "#myPopup" + idPage + " > ul > li").length != 0 ){
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
              }else{
                $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
              }
            }else{  
              $.post("http://190.60.211.17/Fontan/index.php/usuarios_aplicaciones/ObtenerusuarioAplicacion", {usuario:data.usuarioS})
              .done(function( datos ) {
                  console.log(datos)

                if($.trim(datos) != ""){
                  var jsonDatos = JSON.parse(datos);   
                  $( "#myPopup" + idPage + " > ul").append('<li id="' + idObjeto[1] + data.objetivo + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child" persona="' + data.usuarioS + '" estudiantes="' + jsonDatos[0].idEstudiantes + '">ACUDIENTE: ' + jsonDatos[0].PrimerNombre + ' ' + jsonDatos[0].SegundoNombre + ' ' + jsonDatos[0].PrimerApellido + ' ' + jsonDatos[0].SegundoApellido + ' (' + jsonDatos[0].Estudiantes + ')</li>')
                  $( '#' + idPage + ' > .ui-content > a > img').css({"background": "orange", "border": "3px solid orange"})              
                  $( '#chatCentro' + idObjeto[1]).css({"background": "orange", "border": "1px solid orange"})
                  localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO", data.objetivo);  
                  /*var contadorLi = 0;
                  $( '#' + idPage + ' > .ui-content > a > img' ).each(function( index ) {
                    if($(this).css("background-color") == "rgb(255, 165, 0)"){
                        contadorLi++;
                    }
                  });*/

                  if($( "#myPopup" + idPage + " > ul > li").length != 0 ){
                    $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
                  }else{
                    $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
                  }

                  /*if($( '#' + idPage + ' > .ui-content > a > span').length != 0 ){
                    $( '#' + idPage + ' > .ui-content > a > span').html(contadorLi)
                  }else{
                    $( '#' + idPage + ' > .ui-content > a').append('<span style="top: 55; position: absolute; left: 66; color: orange">' + contadorLi + '</span>')
                  }*/
                 
                  $("#" + idObjeto[1] + data.objetivo).click(function(e){ 
                    var id = $(this).attr("id") 
                    var idMonitor = $(this).attr("persona")
                    var Monitor = $(this).html()
                    localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
                    var idPage = $.mobile.activePage.attr('id');   
                    var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
                    
                    console.log(Monitor)
                    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
                    
                    if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                    }else{
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                      
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                      //Mostrar mensajes anteriores
                      
                    }
                    $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
                      var idLi = $(this).attr("id")
                      if(idLi == "chatCentro" + idObjeto[1]){
                        if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
                          contadorLi++;            
                        }
                      }else{
                        if($("#" + idLi).css("background-color") == "rgb(255, 165, 0)"){
                          contadorLi++;
                        }
                      }
                    });
                    
                    
                    if(contadorLi == 1 || contadorLi == 0){
                      $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
                    }
                    $("#" + id).css({"background": "none", "border": "none"})

                    var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
                    var array = {
                      usuario1: usuarioObjetivo,
                      usuario2: usuarioSesion
                    }
                    $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerChatUsuario", array)
                    .done(function( resul ) {console.log(resul)
                      var mensajes = JSON.parse(resul);;
                      if(mensajes.length > 0){
                        for (var j = 0; j < mensajes.length; j++) {
                          console.log(mensajes[j].origen + " " + usuarioSesion)
                          if(usuarioSesion == mensajes[j].origen){
                            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                                '<span class="right">' + mensajes[j].message + '</span>' +
                                '<div class="clear"></div>' +
                            '</li>');
                          }else{
                            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                              '<img src="themes/images/bus icono.png" alt=""/>' +
                              '<span class="left">' + mensajes[j].message + '</span>' +
                              '<div class="clear"></div>' +
                            '</li>');                                    
                          }
                        }
                      }
                      var heightItems = 0;
                      //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
                        heightItems += parseInt($(this).height()) + 10;
                      });
                      console.log(heightItems)
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );
                    })
                   
                    
                  })


                  $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerJSONChatSesion", {})
                  .done(function( dato ) {console.log(dato)
                    if($.trim(dato) != ""){
                      var jsonChats = JSON.parse(dato);
                      var usuarioSesion = localStorage.getItem("idmonitorMonitor");
                      var con = 0;
                      for (var i = 0; i < jsonChats.length; i++) {
                        if(jsonChats[i]){
                          if(jsonChats[i].usuarioF == data.usuarioF && jsonChats[i].usuarioS == usuarioSesion){
                            con++;
                          }
                        }
                      }
                      if(con == 0){
                        jsonChats[jsonChats.length] = {origen: data.objetivo, destino: usuarioSesion, usuarioF: data.usuarioS, usuarioS: usuarioSesion, tipo:"ACUDIENTE", estudiantes: jsonDatos[0].idEstudiantes}
                        $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
                        .done(function( result ) {
                          console.log(result)
                        });
                      }
                    }else{
                      var jsonChats = JSON.parse("[]");
                      jsonChats[jsonChats.length] = {origen: data.objetivo, destino: usuarioSesion, usuarioF: data.usuarioS, usuarioS: usuarioSesion, tipo:"ACUDIENTE", estudiantes: jsonDatos[0].idEstudiantes}
                      $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
                      .done(function( result ) {
                        console.log(result)
                      });
                    }
                  });
                }
              })
                           
                
            }
            
          }
          break;
        
      }

    })
  });
	
	var screenHeight = $(window).height() / 2;
	var height = (screenHeight) + "px";
	
    $( "#textMessage" ).css({
      "height": "37px",
      "width":"100%"
    });

	$( ".panel-body" ).css({
	  "height": height
	});

});
function validar(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  var idPage = $.mobile.activePage.attr('id');
  var texto = $( "#textMessage" + idPage ).val()
  if (tecla==13){
    
    var idUsuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
    var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
    var tipoUsuarioDestino = "";

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
       usuarioSesion= usuarioSesion.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
       idUsuarioObjetivo= idUsuarioObjetivo.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }   
    if(localStorage.getItem("idMonitorObjetivoAPPMONITOR") == "prueba@ssca.com"){
      idUsuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      tipoUsuarioDestino = "CENTRO";
    }else{
      tipoUsuarioDestino = "ACUDIENTE";
    }
    if($.trim(texto).length != 0){
      socket.emit('send message', {
        message: texto, 
        origen: idUsuarioObjetivo,
        objetivo: usuarioSesion, 
        tipo: "MONITOR", 
        usuarioF: localStorage.getItem("idMonitorObjetivoAPPMONITOR"), 
        usuarioS: localStorage.getItem("idmonitorMonitor")
      });

      var array = {
        mensaje: texto,
        origen: localStorage.getItem("idmonitorMonitor"),
        destino: localStorage.getItem("idMonitorObjetivoAPPMONITOR"),
        usuario1: localStorage.getItem("idMonitorObjetivoAPPMONITOR"),
        usuario2: localStorage.getItem("idmonitorMonitor")
      }
      $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarMensajeChat", array)
      .done(function( dato ) {
      })
      $.post("http://190.60.211.17/push/ActionEnviarMensajeChat.php", {idestudiante: localStorage.getItem("idMonitorObjetivoAPPMONITOR"), tipoUsuario: tipoUsuarioDestino})
      .done(function( dato ) {
        console.log(dato)
      })

      $( "#textMessage" + idPage ).val("")
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
          '<span class="right">' + texto + '</span>' +
          '<div class="clear"></div>' +
        '</li>');
      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
      
    }
  }

}

$("#estudianteChatAcudiente").change (function(e) { 
  if($("#estudianteChatAcudiente").val() != "Seleccione"){
    var estudiante = $("#estudianteChatAcudiente").val();
    $("#btnSeleccionarAcudiente").css({"display":"block"})
  }else{
    $("#btnSeleccionarAcudiente").css({"display":"none"})
  }
});

$("#btnSeleccionarAcudiente").click(function(e) {
	var socket = io.connect("http://190.60.211.17:3003");
  var ruta = $("#selectruta").val();
  var estudiante = $("#estudianteChatAcudiente").val();
  var usuarioSesion = localStorage.getItem("idmonitorMonitor");
  var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
  var idPage = $.mobile.activePage.attr('id');
  var idObjeto = idPage.split("page"); 

      var usuarioSesion = localStorage.getItem("idmonitorMonitor");
      
      $.mobile.loading( "show", {
        text: "",
        textVisible: true,
        theme: "z",
        html: ""
      });

      $.post("http://190.60.211.17/Fontan/index.php/usuarios_aplicaciones/ObtenerusuarioAplicacion", {usuario:$("#estudianteChatAcudiente").val()})
      .done(function( respuesta ) {console.log(respuesta)
        var json = JSON.parse(respuesta); 
        $( "#myPopup" + idPage).popup("open")
        estudiante = json[0].idAcudiente;
        // Los eliminamos todos
        for (var i = 0; i < specialChars.length; i++) {
            estudiante= estudiante.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }    

        if($("#" + idObjeto[1] + estudiante).length != 0 ){ 
          var array = $("#" + idObjeto[1] + estudiante).attr("estudiantes").split(",");
          var estudiantes = $("#" + idObjeto[1] + estudiante).attr("estudiantes")
          var estado = 0;

          if(array.length > 0){
            var arrayDatos = $("#" + idObjeto[1] + estudiante).html().split(")");

            for (var i = 0; i < array.length; i++) {
                if(array[i] == json[0].idUsuario){
                    estado = 1;
                }
            }
            
            if(estado == 0){
              var span = "";
              for (var i = 0; i < arrayDatos.length - 1; i++) {
                  span+= arrayDatos[i];
              }
              span += " - " + json[0].PrimerNombre + ' ' + json[0].SegundoNombre + ' ' + json[0].PrimerApellido + ' ' + json[0].SegundoApellido + ")";
              $("#" + idObjeto[1] + estudiante).html(span)
              estudiantes += "," + json[0].idUsuario;
              $("#" + idObjeto[1] + estudiante).attr("estudiantes", estudiantes)
            }
          }  
        }else{
          var jsonEstudiante = [json[0].idUsuario]
          $( "#myPopup" + idPage + " > ul").prepend('<li id="' + idObjeto[1] + estudiante + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child" estudiantes="' + jsonEstudiante + '" persona="' + json[0].idAcudiente + '">ACUDIENTE: ' + json[0].NombreAcudiente + ' (' + json[0].PrimerNombre + ' ' + json[0].SegundoNombre + ' ' + json[0].PrimerApellido + ' ' + json[0].SegundoApellido + ')</li>')
        } 
        if($( "#myPopup" + idPage + " > ul > li").length > 0){
          $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
        }else{
          $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
          $( "#myPopup" + idPage ).popup( "close" );
        }       
        
        var estudiantes = $("#" + idObjeto[1] + estudiante).attr("estudiantes")
        var origen = estudiante;
        $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerJSONChatSesion", {})
        .done(function( dato ) {
          if($.trim(dato) != ""){
            var jsonChats = JSON.parse(dato);
            var usuarioSesion = localStorage.getItem("idmonitorMonitor");
            var origen = localStorage.getItem("idMonitorObjetivoAPPMONITOR");
            if(existeDatos(origen, usuarioSesion, jsonChats) == -1){
              jsonChats[jsonChats.length] = {origen: estudiante, destino: usuarioSesion, usuarioF: json[0].idAcudiente, usuarioS: usuarioSesion, tipo:"ACUDIENTE", estudiantes: estudiantes}
              $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
              .done(function( result ) {
                console.log(result)
              });
            }
          }else{
            var jsonChats = JSON.parse("[]");
            var usuarioSesion = localStorage.getItem("idmonitorMonitor");
            var origen = localStorage.getItem("idMonitorObjetivoAPPMONITOR");
            jsonChats[jsonChats.length] = {origen: estudiante, destino: usuarioSesion, usuarioF: json[0].idAcudiente, usuarioS: usuarioSesion, tipo:"ACUDIENTE", estudiantes: estudiantes}
            $.post("http://190.60.211.17/Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
            .done(function( result ) {
              console.log(result)
            });
          }
        });    
        localStorage.setItem("idMonitorObjetivoAPPMONITOR", json[0].idAcudiente);
        localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO",json[0].idAcudiente);    
        mostrarDatos()  
        $.mobile.loading( "hide" );
        $("#" + idObjeto[1] + estudiante).click(function(e){ 
          var idPage = $.mobile.activePage.attr('id');   
          var usuarioObjetivo = $(this).attr("persona")
          localStorage.setItem("idMonitorObjetivoAPPMONITOR",  usuarioObjetivo);
          var idMonitor = $(this).attr("persona")
          var Monitor = $(this).html()
          $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
          console.log(Monitor)
          $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
          
          if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
          }else{            
            localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
            //Mostrar mensajes anteriores
            
          }

          var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
          var array = {
            usuario1: usuarioObjetivo,
            usuario2: usuarioSesion
          }
          $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerChatUsuario", array)
          .done(function( resul ) {console.log(resul)
            var mensajes = JSON.parse(resul);;
            if(mensajes.length > 0){
              for (var j = 0; j < mensajes.length; j++) {
                console.log(mensajes[j].origen + " " + usuarioSesion)
                if(usuarioSesion == mensajes[j].origen){
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                      '<span class="right">' + mensajes[j].message + '</span>' +
                      '<div class="clear"></div>' +
                  '</li>');
                }else{
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).append('<li>' +
                    '<img src="themes/images/bus icono.png" alt=""/>' +
                    '<span class="left">' + mensajes[j].message + '</span>' +
                    '<div class="clear"></div>' +
                  '</li>');                                    
                }
              }
            }
            var heightItems = 0;
            //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
              heightItems += parseInt($(this).height()) + 10;
            });
            console.log(heightItems)
            $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );
          })
         
          
          
        })
      })        
        
 
});

