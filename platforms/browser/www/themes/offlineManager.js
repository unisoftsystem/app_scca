/*
<!-- ==========================================  -->
<!--              SAVE DATA OFFLINE              -->
<!-- ==========================================  --> 
*/

$(document).ready(function() {

  // document.addEventListener("offline", navigatorOffLine, false);
  // Watcher para el cambio de estado de la conexion
  document.addEventListener("online", navigatorOnLine, false);
  
  function navigatorOnLine() {

    var $_data = localStorage.getItem('offLineData');  
    var $_storage = [];
    localStorage.removeItem('offLineData');
    
    if($_data != null) {
      $_storage = JSON.parse($_data);
      
      for (var i = $_storage.length - 1; i >= 0; i--) {
        var data = $_storage[i];
        var index = $_storage.indexOf(data);
                
        if(navigator.onLine) {
          
          if (index > -1) {
            $_storage.splice(index, 1);
          }

          if(data != null) {
            
            if(typeof data == 'object') {
              $.post(data.uri, data.data)
                .done(function(response) {
                  $.mobile.loading( "hide" );
                })
                .fail(function(error) {
                  alertify.alert('No se pudo guardar dato offline en central...');
                  $.mobile.loading( "hide" );
                });
            }

            if(i == 0) {
              alertify.alert('Sincronizacion de datos con central finalizada...');
            }
          }
        }else {
          localStorage.setItem('offLineData', JSON.stringify($_storage));  
        }

      }
    }

  }


});