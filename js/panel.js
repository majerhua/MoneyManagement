


$(document).ready(function () {

    $('#menu-action').click(function() {
        $('.sidebar').toggleClass('active');
        $('.main').toggleClass('active');
        $(this).toggleClass('active');
      
        if ($('.sidebar').hasClass('active')) {
          $(this).find('i').addClass('fa-times');
          $(this).find('i').removeClass('fa-bars');
        } else {
          $(this).find('i').addClass('fa-bars');
          $(this).find('i').removeClass('fa-times');
        }
      });
      
      // Add hover feedback on menu
      $('#menu-action').hover(function() {
          $('.sidebar').toggleClass('hovered');
      });
});


function salir(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href="login.html";
    }).catch(function(error) {
        // An error happened.
    });
}


