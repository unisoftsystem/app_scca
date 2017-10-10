$("#OpcionChatAcudiente").click(function(e){
			
	var usuarioSesion = localStorage.getItem("idMonitorUsuario");
	$("#estudianteChatAcudiente").html("")
	$("#estudianteChatAcudiente-button > span").html("&nbsp;")
	$("#estudianteChatAcudiente").append('<option value="Seleccione">SELECCIONE...</option>');
	  
  	var ruta = localStorage.getItem("idrutaMonitor"); 
	var date = new Date();
	var dia = date.getDate();
	var mes = (date.getMonth() + 1);
	var year = date.getFullYear();
	
	if(dia < 10) {
		dia = '0' + dia;
	} 
	
	if(mes < 10) {
		mes = '0' + mes;
	} 
	
	var fechaActual = year + "-" + mes + "-" + dia;
	var datos = {
		idRuta: ruta,
		fecha: fechaActual
	}
	$.post("http://190.60.211.17//ssca/ActionListarEstudiantesRuta.php", datos)
	.done(function( data ) {console.log(data)
		if($.trim(data) != "[]"){
			var json = JSON.parse(data);
			$.each(json, function(i, item) {
				$("#estudianteChatAcudiente").append('<option value="' + json[i].usuario + '">' + json[i].primerNombre + ' ' + json[i].segundoNombre + ' ' + json[i].primerApellido + ' ' + json[i].segundoApellido + '</option>');
			});
			//$( "#estudianteChatAcudiente" ).selectmenu( "refresh" );
			jQuery.mobile.changePage("#pageChatAcudiente");	
		}else{
			$("#btnSeleccionarAcudiente").css({"display":"none"})
		}
		
	});
  	
});

$("#OpcionChatCentro").click(function(e){
  console.log($("#chatCentro").length)
  var idPage = $.mobile.activePage.attr('id');
  var idObjeto = idPage.split("page"); 
  if($("#chatCentro" + idObjeto[1]).length == 0 ){
    var usuarioSesion = localStorage.getItem("idmonitorMonitor");
    
    $( "#panelChat" ).panel( "close" );
    $( "#myPopup" + idPage).popup("open") 

    if($("#chatCentro" + idObjeto[1]).length != 0 ){ 
          
    }else{
      $( "#myPopup" + idPage + " > ul").prepend('<li id="chatCentro' + idObjeto[1] + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child">CENTRO DE OPERACIONES</li>')
    } 
    if($( "#myPopup" + idPage + " > ul > li").length > 0){
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
    }else{
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
      $( "#myPopup" + idPage ).popup( "close" );
    }
    localStorage.setItem("idMonitorObjetivoAPPMONITOR", "prueba@ssca.com");
    localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO","prueba@ssca.com");    
    mostrarDatos()
    //Eventos de presionar y soltar
    
    $("#chatCentro" + idObjeto[1]).click(function(e){    
      localStorage.setItem("idMonitorObjetivoAPPMONITOR","prueba@ssca.com");
      var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      var idMonitor = "prueba@ssca.com"
      var Monitor = $(this).html()
      console.log(Monitor)
      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
      //console.log($( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span"))
      //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span")[0].innerHTML = Monitor;
     
      if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
      }else{
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
        localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
        //Mostrar mensajes anteriores
        
      }
      var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
      var array = {
        usuario1: usuarioObjetivo,
        usuario2: usuarioSesion
      }
      $.post("http://190.60.211.17//Fontan/index.php/rutas/obtenerChatUsuario", array)
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
    .done(function( dato ) {
      if($.trim(dato) != ""){
        var jsonChats = JSON.parse(dato);
        var usuarioSesion = localStorage.getItem("idmonitorMonitor");
        var origen = localStorage.getItem("idMonitorObjetivoAPPMONITOR");
        if(existeDatos(origen, usuarioSesion, jsonChats) == -1){
          jsonChats[jsonChats.length] = {origen: "prueba@ssca.com", destino: usuarioSesion, usuarioF: "prueba@ssca.com", usuarioS: usuarioSesion, tipo:"CENTRO"}
          $.post("http://190.60.211.17//Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
          .done(function( result ) {
            console.log(result)
          });
        }
      }else{
        var jsonChats = JSON.parse("[]");
        var usuarioSesion = localStorage.getItem("idmonitorMonitor");
        var origen = localStorage.getItem("idMonitorObjetivoAPPMONITOR");
        jsonChats[jsonChats.length] = {origen: "prueba@ssca.com", destino: usuarioSesion, usuarioF: "prueba@ssca.com", usuarioS: usuarioSesion, tipo:"CENTRO"}
        $.post("http://190.60.211.17//Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
        .done(function( result ) {
          console.log(result)
        });
      }
    });    
  }else{
    //localStorage.setItem("idMonitorObjetivoAPPMONITOR","prueba@ssca.com");
    $( "#panelChat" ).panel( "close" );
    $( "#myPopup" + idPage ).popup( "open" );
    localStorage.setItem("idMonitorObjetivoAPPMONITOR", "prueba@ssca.com");
    localStorage.setItem("idMonitorObjetivoAPPMONITORNUEVO","prueba@ssca.com");    
    mostrarDatos()
    //$('#popupMensaje').fadeIn('slow');
    //$( "#myPopup" + idPage + " > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > .panel-chat > .panel-body")[0].scrollHeight}, 1000);
    //$(".panel-chat > .panel-heading > table > tbody > tr > td > span").html("CENTRO DE OPERACIONES")
  }
  	
});
$(".panel-chat > .panel-heading > table > tbody > tr > td > .chatClose").click(function(){
  //$('#popupMensaje').fadeOut('slow');
  var idPage = $.mobile.activePage.attr('id');
  var idObjeto = idPage.split("page");
  var personaS = localStorage.getItem("idMonitorObjetivoAPPMONITOR")
  var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
  //$( "#myPopup" + idPage ).popup( "close" );
  
  $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerJSONChatSesion", {})
  .done(function( dato ) {
    if($.trim(dato) != ""){
      var jsonChats = JSON.parse(dato);console.log(jsonChats)
      var con = -1;
      for (var i = 0; i < jsonChats.length; i++) {
        if(jsonChats[i]){
          console.log(jsonChats[i].usuarioF + " " + personaS + " " + jsonChats[i].usuarioS + " " + usuarioSesion)
          if(jsonChats[i].usuarioF == personaS && jsonChats[i].usuarioS == usuarioSesion){
            con = i;
            
            console.log(personaS + " " + usuarioSesion + " " + con)
          }
        }
      }
      var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

      // Los eliminamos todos
      for (var j = 0; j < specialChars.length; j++) {
         personaS= personaS.replace(new RegExp("\\" + specialChars[j], 'gi'), '');         
      }   
      
      if(con != -1){        
        delete jsonChats[con];
        
        $.post("http://190.60.211.17//Fontan/index.php/rutas/guardarJSONChatSesion", {JSONCHAT:JSON.stringify(jsonChats)})
        .done(function( result ) {
          console.log(result)
          
        });
      }
      
      
    }
    if(localStorage.getItem("idMonitorObjetivoAPPMONITOR") == "prueba@ssca.com"){
      $("#chatCentro" + idObjeto[1]).remove()
    }else{
      $("#" + idObjeto[1] + personaS).remove()
    }
    if($( "#myPopup" + idPage + " > ul > li").length > 0){
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
    }else{
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
      $( "#myPopup" + idPage ).popup( "close" );
    }
    
    //localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
  });
});    

/*$(".panel-chat > .panel-heading").click(function(){
  //$('#popupMensaje').fadeOut('slow');
  var idPage = $.mobile.activePage.attr('id');
  $( "#myPopup" + idPage ).popup( "close" );
  localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
})*/

window.addEventListener('load',init);
function init(){ 
  var width = $(window).width() - 50 
  $( "#myPopuppageHome" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageEnvioMensajes" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageTracking" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageListado" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageListado" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageAlertas" ).css({"width":width, "padding":"0"})
  
  var socket = io.connect("http://190.60.211.17:3003");
  document.addEventListener("backbutton", function(){}, false);
  if(localStorage.getItem("idmonitorMonitor")){
      jQuery.mobile.changePage("#pageHome");      
  } 
  $(".ui-popup").css({"padding":"0"})
  localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
  //mostrarDatosChat()

}

$( window ).on( "orientationchange", function( event ) {
  var width = $(window).width() - 50 
  $( "#myPopuppageHome" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageEnvioMensajes" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageTracking" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageListado" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageChatAcudiente" ).css({"width":width, "padding":"0"})
  $( "#myPopuppageAlertas" ).css({"width":width, "padding":"0"})
});

$( "#myPopuppageHome" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageHome > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageHome > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageHome > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")    
    mostrarDatos()
  }
});
$( "#myPopuppageAlertas" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageAlertas > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageAlertas > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageAlertas > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
    mostrarDatos()
  }
});
$( "#myPopuppageTracking" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageTracking > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageTracking > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageTracking > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
    mostrarDatos()
  }
});
$( "#myPopuppageEnvioMensajes" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageEnvioMensajes > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageEnvioMensajes > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageEnvioMensajes > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
    mostrarDatos()
  }
});
$( "#myPopuppageListado" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageListado > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageListado > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageListado > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
    mostrarDatos()
  }
});
$( "#myPopuppageChatAcudiente" ).bind({
  popupafterclose: function(event, ui) {
    localStorage.removeItem("idMonitorObjetivoAPPMONITOR");
    localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  },
  popupafteropen: function(event, ui) {
    
    $( "#myPopuppageChatAcudiente > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
    $( "#myPopuppageChatAcudiente > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
    $( "#myPopuppageChatAcudiente > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
    mostrarDatos()
  }
});
function mostrarDatos() {
  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
  var usuarioObjetivoNuevo = localStorage.getItem("idMonitorObjetivoAPPMONITORNUEVO"); 
  if(usuarioObjetivoNuevo != null){
    var idPage = $.mobile.activePage.attr('id');
    var idObjeto = idPage.split("page");
    //$( "#myPopup" + idPage + " > ul").html("")
    if(usuarioObjetivoNuevo == "prueba@ssca.com"){
      localStorage.setItem("idMonitorObjetivoAPPMONITOR","prueba@ssca.com");  
      var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      var idMonitor = $("#chatCentro" + idObjeto[1]).attr("id")
      var Monitor = $("#chatCentro" + idObjeto[1]).html()
      var contadorLi = 0;
      $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
        var id = $(this).attr("id")
        if(id == "chatCentro" + idObjeto[1]){
          if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
            contadorLi++;            
          }
        }else{
          if($("#" + id).css("background-color") == "rgb(255, 165, 0)"){
            contadorLi++;
          }
        }
      });
      
      
      if(contadorLi == 1 || contadorLi == 0){
        $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
      }
      $("#chatCentro" + idObjeto[1]).css({"background": "none", "border": "none"})
      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
      if(usuarioObjetivo != "prueba@ssca.com" && usuarioObjetivo != null){
        
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                          
        
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
      }else{                  
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
        //console.log(usuarioObjetivo)
        //Mostrar mensajes anteriores
      }
     
      var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
      var array = {
        usuario1: usuarioObjetivo,
        usuario2: usuarioSesion
      }
      $.post("http://190.60.211.17//Fontan/index.php/rutas/obtenerChatUsuario", array)
      .done(function( resul ) {//console.log(resul)
        var mensajes = JSON.parse(resul);;
        if(mensajes.length > 0){
          for (var j = 0; j < mensajes.length; j++) {
            //console.log(mensajes[j].origen + " " + usuarioSesion)
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
        localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
      })
    }else{
      var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

      // Los eliminamos todos
      for (var i = 0; i < specialChars.length; i++) {
        usuarioObjetivoNuevo = usuarioObjetivoNuevo.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
      }  
      var idMonitor = $("#" + idObjeto[1] + usuarioObjetivoNuevo).attr("persona")
      var Monitor = $("#" + idObjeto[1] + usuarioObjetivoNuevo).html()
      localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
      var idPage = $.mobile.activePage.attr('id');   
      var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
      
      //console.log(Monitor)
      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
      
      if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
      }else{
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
        
        $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
        //Mostrar mensajes anteriores
        
      }
      var contadorLi = 0;
      $( "#myPopup" + idPage + " > ul > li").each(function( index ) {
        var id = $(this).attr("id")
        if(id == "chatCentro" + idObjeto[1]){
          if($("#chatCentro" + idObjeto[1]).css("background-color") == "rgb(255, 165, 0)"){
            contadorLi++;            
          }
        }else{
          if($("#" + id).css("background-color") == "rgb(255, 165, 0)"){
            contadorLi++;
          }
        }
      });
      
      
      if(contadorLi == 1 || contadorLi == 0){
        $( '#' + idPage + ' > .ui-content > a > img').css({"background": "none", "border": "none"})
      }
      $("#" + idObjeto[1] + usuarioObjetivoNuevo).css({"background": "none", "border": "none"})
      var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
      var array = {
        usuario1: usuarioObjetivo,
        usuario2: usuarioSesion
      }
      $.post("http://190.60.211.17//Fontan/index.php/rutas/obtenerChatUsuario", array)
      .done(function( resul ) {//console.log(resul)
        var mensajes = JSON.parse(resul);;
        if(mensajes.length > 0){
          for (var j = 0; j < mensajes.length; j++) {
            //console.log(mensajes[j].origen + " " + usuarioSesion)
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
        localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
      })
    }
  }
}
function mostrarDatosChat(){
  localStorage.removeItem("idMonitorObjetivoAPPMONITORNUEVO");
  var idPage = $.mobile.activePage.attr('id');

  var idObjeto = idPage.split("page");
  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
  $( "#myPopup" + idPage + " > ul").html("")
  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"hidden"})
  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html("")
  $.post("http://190.60.211.17/Fontan/index.php/rutas/obtenerJSONChatSesion", {})
  .done(function( dato ) {
    var contadorChats = 0;
    console.log(dato)
    if($.trim(dato) != ""){
      var jsonChats = JSON.parse(dato);
      for (var i = 0; i < jsonChats.length; i++) {
        if(jsonChats[i]){
          var usuarioSesion = localStorage.getItem("idmonitorMonitor");
          var origen = localStorage.getItem("idMonitorObjetivoAPPMONITOR");console.log(usuarioSesion)
          if(jsonChats[i].usuarioS == usuarioSesion){
            contadorChats++;
            console.log(jsonChats[i])
            switch(jsonChats[i].tipo){
              case "CENTRO":
                $( "#myPopup" + idPage + " > ul").append('<li id="chatCentro' + idObjeto[1] + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child">CENTRO DE OPERACIONES</li>')
                

                $("#chatCentro" + idObjeto[1]).click(function(e){    
                  var id = $(this).attr("id") 
                  var idMonitor = "prueba@ssca.com"
                  localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
                  var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR");
                  var Monitor = $(this).html()
                  console.log(Monitor)
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)
                  //console.log($( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span"))
                  //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span")[0].innerHTML = Monitor;
                  $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("") 
                  if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
                    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                  }else{
                    
                    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                    //Mostrar mensajes anteriores
                    
                  }
                  var contadorLi = 0;
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
                  $.post("http://190.60.211.17//Fontan/index.php/rutas/obtenerChatUsuario", array)
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
                break;

                case "ACUDIENTE":
                  $( "#myPopup" + idPage + " > ul").append('<li id="' + idObjeto[1] + jsonChats[i].origen + '" estudiantes="' + jsonChats[i].estudiantes + '" class="ui-li-static ui-body-inherit ui-first-child ui-last-child" persona="' + jsonChats[i].usuarioF + '">ACUDIENTE: ' + jsonChats[i].NombreAcudiente + ' (' + jsonChats[i].Nombre + ')</li>')
                  

                  $("#" + idObjeto[1] + jsonChats[i].origen).click(function(e){  
                    var id = $(this).attr("id") 
                    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).html("")                     
                    var Monitor = $(this).html()
                    $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-heading > table > tbody > tr > td > span").html(Monitor)  
                    var idMonitor = $(this).attr("persona")
                    localStorage.setItem("idMonitorObjetivoAPPMONITOR", idMonitor);
                    var usuarioObjetivo = localStorage.getItem("idMonitorObjetivoAPPMONITOR"); 
                    console.log(Monitor)
                    var contadorLi = 0;
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
                    if(usuarioObjetivo == idMonitor && usuarioObjetivo != null){
                      
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                    }else{
                      
                      
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat").css({"visibility":"visible"})
                      //Mostrar mensajes anteriores
                      
                    }
                    var usuarioSesion = localStorage.getItem("idmonitorMonitor"); 
                    var array = {
                      usuario1: usuarioObjetivo,
                      usuario2: usuarioSesion
                    }
                    $.post("http://190.60.211.17//Fontan/index.php/rutas/obtenerChatUsuario", array)
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
                      //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                      var heightItems = 0;
                      //$( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").animate({ scrollTop: $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul" ).height()}, 5000);                                                  
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body > ul > li").each(function( index ) {
                        heightItems += parseInt($(this).height()) + 10;
                      });
                      console.log(heightItems)
                      $( "#myPopup" + idPage + " > table > tbody > tr > td > .panel-chat > .panel-body").scrollTop( heightItems );
                    })
                    
                  })
                  break;
            }           

          }
        }
      }
     
    }
    if($( "#myPopup" + idPage + " > ul > li").length > 0){
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"block"})
    }else{
      $( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
      $( "#myPopup" + idPage ).popup( "close" );
    }
    if($( "#myPopup" + idPage + " > ul > li").length == 0){
      //$( '#' + idPage + ' > .ui-content > a > img').css({"display":"none"})
    }
  });
}
function existeDatos(usuario1, usuario2, json){
  var estado = -1;
  for (var i = 0; i < json.length; i++) {
    if(json[i]){
      if(json[i].usuarioF == usuario1 && json[i].usuarioS == usuario2){
        estado = i;
      }
    }
  }
  return estado;
}
$( document ).on( "pageshow", "#pageHome", function() {
  $( "#myPopuppageHome > ul").html("")
  mostrarDatosChat()
  clearInterval(intervalAlertas);
  clearInterval(interval);
});
$( document ).on( "pageshow", "#pageEnvioMensajes", function() {
  $( "#myPopuppageEnvioMensajes > ul").html("")
  mostrarDatosChat()
});
$( document ).on( "pageshow", "#pageListado", function() {
  $( "#myPopuppageListado > ul").html("")
  mostrarDatosChat()
});
$( document ).on( "pageshow", "#pageChatAcudiente", function() {
  $( "#myPopuppageChatAcudiente > ul").html("")
  mostrarDatosChat()
});
$("#OpcionCerrarSesion").click(function(e){
	alertify.confirm("<p><b>¿Desea cerrar sesión?</b></p>", function (e) {
		if (e) {
			var idmonitorMonitor = localStorage.getItem("idmonitorMonitor"); 
			$.post( "http://190.60.211.17//ssca/ActionCerrarSesionMonitor.php", {usuario: idmonitorMonitor})
			.done(function( dataResultado ) {
				//console.log(dataResultado);
				localStorage.removeItem("nombreMonitor");
				localStorage.removeItem("apellidoMonitor");
				localStorage.removeItem("direccionMonitor");
				localStorage.removeItem("telefonoMonitor");
				localStorage.removeItem("idmonitorMonitor");
				localStorage.removeItem("CoordenadasMonitor");
				localStorage.removeItem("ImagenFotograficaMonitor");
				localStorage.removeItem("idCredencialMonitor");
				localStorage.removeItem("SaldoCredencialMonitor");
				localStorage.removeItem("idMonitorUsuario");
				localStorage.removeItem("id_conductorMonitor");
				localStorage.removeItem("idrutaMonitor");
				localStorage.removeItem("latdestinoMonitor");
				localStorage.removeItem("latorigenMonitor");
				localStorage.removeItem("longdestinoMonitor");
				localStorage.removeItem("longorigenMonitor");
				jQuery.mobile.changePage("#pageScan");
				if (watchID != null) {
          navigator.geolocation.clearWatch(watchID);
          watchID = null;
        }
        clearInterval(interval);
        jQuery.mobile.changePage("#pageScan");
			});
		}
	})
})