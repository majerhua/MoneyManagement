var database = firebase.database();
let periodoId = '';
let tableBody = document.querySelector("#table-responsive-body");
let $btnGuardarGasto = $("#guardar-gasto");
let $btnEditarCategoria = $("#editar-categoria");
let $descripcion = $("#descripcion");
let $ediDescripcion = $("#edi-descripcion");
let $mElimId = $("#m-elim-id");
let $mEditId = $("#m-edit-id");
let keyPeriodo;

$(document).ready(function(){

    var jsFiltrar = document.querySelectorAll('.filtrar');
    var jsBuscar = document.querySelectorAll('.buscar');
        $(jsFiltrar).keyup(function () {
            var idfil = $(this).attr('ident-buscar');
            var rex = new RegExp($(this).val(),'i');
            $(jsBuscar).children('tr').hide();
            $(jsBuscar).children('tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
    
    listarCategorias();
    $('[data-toggle="tooltip"]').tooltip();   
});

function salir(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
        window.location.href="login.html";
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
  } else {
    // User is signed out.
    // ...
    
  }
});

function guardar(){
    database.ref('Categorias/').push({
        descripcion: $descripcion.val(),
    }).then(function(res){
        $("#modal-guardar").modal('toggle');
        $descripcion.val("");
        alertify.success('Se guardo correctamente.');
    });
}


function listarCategorias(){
 
    database.ref('Categorias').on('value',function(snap){
        let html='';
            $.each(snap.val(),function(index,value){
                html+= `<tr>`;
                html+= `<td>${value.descripcion}</td>`;
                html+= `<td><button  type='button' onclick='setIdReq("${index}","editar")' class='btn btn-success btn-sm' data-toggle="modal" data-target="#modal-editar" ><i class="far fa-edit"></i></button></td>`;
                html+= `<td><button  type='button' onclick='setIdReq("${index}","eliminar")' class='btn btn-danger btn-sm' data-toggle="modal" data-target="#modal-eliminar" ><i class="far fa-trash-alt"></i></button></td>`;
                html+= `</tr>`;                        
            });
        tableBody.innerHTML = html;
    });
}

function eliminar(){
    var refId = database.ref('Categorias').child($mElimId.val());
    refId.remove().then(function(res){
        $("#modal-eliminar").modal('toggle');
        alertify.success('Se elimino correctamente.');
    });
}

function editar(){
    database.ref('Categorias/'+$mEditId.val()).update({
        descripcion: $ediDescripcion.val()
    },function(err){
        if(err){
            alertify.error('Ocurrio un error.');
        }else{
            alertify.success('Se edito correctamente.');
            $("#modal-editar").modal('toggle');
        }
    });
}

function setIdReq(id,type){

    if(type=="eliminar")
        $mElimId.val(id);
    else if(type == "editar"){
        $mEditId.val(id);
        database.ref('Categorias/'+id).on('value',function(snap){
            $ediDescripcion.val(snap.val().descripcion);
        });
    }
}
