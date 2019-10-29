var database = firebase.database();
let periodoId = '';
let $btnGuardarGasto = $("#guardar-gasto");
let $precio = $("#precio");
let $descripcion = $("#descripcion");
let keyPeriodo;

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

function guardar(){
    database.ref('Movimientos/').push({
        descripcion: $descripcion.val(),
        precio: $precio.val(),
        fecha : String(moment(new Date()).format("DD/MM/YYYY")),
        hora: String(moment(new Date()).format("HH:mm")),
        periodoId: periodoId
    }).then(function(res){
        $("#myModal").modal('toggle');
    });
}

listarMovimientos();
let tableBody = document.querySelector("#table-responsive-body");

function listarMovimientos(){
    database.ref('Periodo/')
    .orderByChild('vigente')
    .equalTo(1)
    .on('child_added',function(snapshot){
        console.log("SnapShot =>",snapshot);
        keyPeriodo = snapshot.key;
        var periodo = snapshot.val();
        periodoId = periodo.id;
        console.log("Periodo =>",periodo.id);
        if(periodo.vigente == 1){
            
            database.ref('Movimientos').on('value',function(snap){
                let html='';
                let total=0;
                    $.each(snap.val(),function(index,value){
                        if(value.periodoId==periodoId){
                            html+= `<tr>`;
                            html+= `<td>${value.descripcion}</td>`;
                            html+= `<td>S/.${value.precio}</td>`;
                            html+= `<td>${value.fecha}</td>`;
                            html+= `<td><button  type='button' class='btn btn-danger btn-sm' onclick='eliminar("${index}")' ><i class="far fa-trash-alt"></i></button></td>`;
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

function eliminar(id){
    var refId = database.ref('Movimientos').child(id);
    refId.remove();
}

function nuevoPeriodo(){

    var refPeriodoId = database.ref('Periodo').child(keyPeriodo)
    refPeriodoId.update({
        vigente: 0
    }).then(function(res){
        console.log("Nuevo Periodo");
        database.ref('Periodo/').push({
            id: uuid.v1(),
            fecha : String(moment(new Date()).format("DD/MM/YYYY")),
            vigente: 1
        })
    });
}