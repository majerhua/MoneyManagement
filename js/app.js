var database = firebase.database();
let periodoId = '';
let $btnGuardarGasto = $("#guardar-gasto");
let $precio = $("#precio");
let $descripcion = $("#descripcion");


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

$btnGuardarGasto.on('click',function(){
    database.ref('Periodo/')
    .orderByChild('vigente')
    .equalTo(1)
    .on('child_added',function(snapshot){
        var periodo = snapshot.val();
        if(periodo.vigente == 1){
            periodoId = periodo.Id;
            database.ref('Movimientos/').push({
                descripcion: $descripcion.val(),
                precio: $precio.val(),
                fecha : String(moment(new Date()).format("DD/MM/YYYY HH:mm")),
                periodoId: periodoId
            });
        }
    });
    console.log("Guardando");
});

listarMovimientos();
let tableBody = document.querySelector("#table-responsive-body");

function listarMovimientos(){
    
    database.ref('Movimientos').on('value',function(snap){
        let html='';
        let arrayMov = Object.values(snap.val());
        console.log("tam array =>",arrayMov)
        for(let i=0;i< arrayMov.length ; i++){
            html+= `<tr>`;
            html+= `<td>${arrayMov[i].descripcion}</td>`;
            html+= `<td>S/.${arrayMov[i].precio}</td>`;
            html+= `<td>${arrayMov[i].fecha}</td>`;
            html+= `<td><button  type='button' class='btn btn-danger btn-sm'>Eliminar</button></td>`;
            html+= `</tr>`;
        }
        tableBody.innerHTML = html;
        // console.log(Object.values(snap.val()));
    });
}

console.log("uuid =>",uuid.v1());
// database.ref('Periodo/').push({
//     id: "2",
//     fecha : String(moment(new Date()).format("DD/MM/YYYY")),
//     vigente: 0
//   });