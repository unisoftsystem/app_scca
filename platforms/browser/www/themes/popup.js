// JavaScript Document
$(document).ready(function(){
  $('#open').click(function(){
        $('#popup').fadeIn('slow');
        $('.popup-overlay').fadeIn('slow');
        $('.popup-overlay').height($(window).height());
        return false;
    });
    
    $('#close').click(function(){
        $('#popup').fadeOut('slow');
        $('.popup-overlay').fadeOut('slow');
        return false;
    });
	
	 $('#close1').click(function(){
        $('#popupCarrito').fadeOut('slow');
        $('.popup-overlay').fadeOut('slow');
        return false;
    });
});