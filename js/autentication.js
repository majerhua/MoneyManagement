
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
        console.log("Usuario Logueado");
        //location.reload();
    // ...
    }else {
    // User is signed out.
    // ...
    console.log("Usuario No Logueado");
    window.location.href="login.html";
    }
});