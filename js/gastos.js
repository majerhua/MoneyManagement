var database = firebase.database();
let periodoId = '';
let tableBody = document.querySelector("#table-responsive-body");
let $btnGuardarGasto = $("#guardar-gasto");
let $precio = $("#precio");
let $descripcion = $("#descripcion");
let $categoria = $("#categoria");
let $total = $("#total");
let $mElimId = $("#m-elim-id");
let $mEditId = $("#m-edit-id");
let keyPeriodo;

let $ediDescripcion = $("#edi-descripcion");
let $ediPrecio = $("#edi-precio");
let $ediCategoria = $("#edi-categoria");


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
    
    listarGastos();
    listarCategoria();
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
    database.ref('Gastos/').push({
        descripcion: $descripcion.val(),
        precio: $precio.val(),
        fecha : String(moment(new Date()).format("DD/MM/YYYY")),
        hora: String(moment(new Date()).format("HH:mm")),
        periodoId: periodoId,
        categoria: $("#categoria").val()
    }).then(function(res){
        $("#modal-guardar").modal('toggle');
        alertify.success('Se elimino correctamente.');
        $precio.val("");
        $descripcion.val("");
        $categoria.val("");
    });
}

function listarCategoria(){
    database.ref('Categorias').
        on('value',function(snap){
            $ediCategoria.empty();
            $ediCategoria.append("<option value=''>--Seleccionar--</option>");
            $categoria.empty();
            $categoria.append("<option value=''>--Seleccionar--</option>");
            $.each(snap.val(),function(index,value){
               $categoria.append("<option value='"+value.descripcion+"'>"+value.descripcion+"</option>");
               $ediCategoria.append("<option value='"+value.descripcion+"'>"+value.descripcion+"</option>");
            });
    });
}

function listarGastos(){
    database.ref('Periodo/')
    .orderByChild('vigente')
    .equalTo(1)
    .on('child_added',function(snapshot){
        keyPeriodo = snapshot.key;
        var periodo = snapshot.val();
        periodoId = periodo.id;

        if(periodo.vigente == 1){
            
            database.ref('Gastos').on('value',function(snap){
                let html='';
                let total=0;
                    $.each(snap.val(),function(index,value){

                        if(value.periodoId==periodoId){
                            html+= `<tr>`;
                            html+= `<td>${value.descripcion}</td>`;
                            html+= `<td>S/.${value.precio}</td>`;
                            html+= `<td>${value.categoria}</td>`;
                            html+= `<td>${value.fecha}</td>`;
                            html+= `<td><button  type='button' onclick='setIdReq("${index}","editar")' class='btn btn-success btn-sm' data-toggle="modal" data-target="#modal-editar" ><i class="far fa-edit"></i></button></td>`;
                            html+= `<td><button  type='button' onclick='setIdReq("${index}","eliminar")' class='btn btn-danger btn-sm' data-toggle="modal" data-target="#modal-eliminar" ><i class="far fa-trash-alt"></i></button></td>`;
                            html+= `</tr>`;
                            total+= parseFloat(value.precio);                         
                        }
                    });
                $("#total").text("S/."+total);
                tableBody.innerHTML = html;
            });
        }
    });
}

$precio.on('keyup',function(e){

    let val = String($precio.val());

    let re = /([.])\1/;
    //if(re.test(val))
        //$precio.val(val.substring(0,val.length-1));
    console.log(re.test(val));
    if( ( val.charCodeAt(val.length-1) >=48 && val.charCodeAt(val.length-1)<=57) || val.charCodeAt(val.length-1)==46){
    }else{
        $precio.val(val.substring(0,val.length-1));
    }
});

function eliminar(){
    var refId = database.ref('Gastos').child($mElimId.val());
    refId.remove().then(function(res){
        $("#modal-eliminar").modal('toggle');
        alertify.success('Se elimino correctamente.');
    });
}

function editar(){
 
    database.ref('Gastos/'+$mEditId.val()).update({
        descripcion:$ediDescripcion.val(),
        precio:$ediPrecio.val(),
        categoria:$ediCategoria.val()
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
        database.ref('Gastos/'+id).on('value',function(snap){

            $ediDescripcion.val(snap.val().descripcion);
            $ediPrecio.val(snap.val().precio);
            $ediCategoria.val(snap.val().categoria);
        });
    }
}
