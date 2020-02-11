var database = firebase.database();
let tableBody = document.querySelector("#table-responsive-body");
var $descripcion;
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
    $('[data-toggle="tooltip"]').tooltip();   

    $descripcion = $("#descripcion");
    getKeyPeriodoActual();
    getPeriodos();
});


function getPeriodos(){
    database.ref('Periodo/').on('value',function(snap){
        let html="";
        $.each(snap.val(),function(index,value){
            html+= `<tr>`;
            html+= `<td>${value.descripcion}</td>`;
            html+= `<td>${value.fecha}</td>`;
            if(value.vigente==1){
                html+= `<td style='color:green'>Activo</td>`;
            }else{
                html+= `<td style='color:red'>Inactivo</td>`;
            }
            
            html+= `</tr>`;
        });
    tableBody.innerHTML = html;
    });
}

function getKeyPeriodoActual(){
    database.ref('Periodo/')
    .orderByChild('vigente')
    .equalTo(1)
    .on('child_added',function(snapshot){
        keyPeriodo = snapshot.key;
        var periodo = snapshot.val();
        periodoId = periodo.id;

    });
}

function nuevoPeriodo(){

    var refPeriodoId = database.ref('Periodo').child(keyPeriodo)
    refPeriodoId.update({
        vigente: 0
    }).then(function(res){
        console.log("Nuevo Periodo");
        database.ref('Periodo/').push({
            id: uuid.v1(),
            descripcion: $descripcion.val(),
            fecha : String(moment(new Date()).format("DD/MM/YYYY")),
            vigente: 1
        })
    });
}