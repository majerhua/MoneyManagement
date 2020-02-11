var database = firebase.database();

var $btnIngresar;
var $btnSalir;
var $email;
var $password;

$(document).ready(function(){

    $btnIngresar = $("#ingresar");
    $btnSalir = $("#salir");
    $email = $("#email");
    $password = $("#password");


    $btnIngresar.on('click',function(){
        ingresar($email.val(),$password.val())
    });

    $btnSalir.on('click',function(){
        salir();
    });
});


function ingresar(email,password){
    /*firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log("Error Code => ",errorCode);
      console.log("Error Message => ",errorMessage);
    });*/
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

function salir(){
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
  alert("Saliendo");
}).catch(function(error) {
  // An error happened.
});
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
    console.log("USUARIO LOGUEADO");
    window.location.href="panel.html"
  } else {
    // User is signed out.
    // ...
    console.log("USUARIO NO LOGUEADO");
  }
});
