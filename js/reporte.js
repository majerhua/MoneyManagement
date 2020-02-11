var ctx = document.getElementById('myChart').getContext('2d');
var database = firebase.database();
var totalIngresos = 0;
var totalGastos = 0;

$(document).ready(function(){

    database.ref('Periodo/')
    .orderByChild('vigente')
    .equalTo(1)
    .on('child_added',function(snapshot){
        
        keyPeriodo = snapshot.key;
        var periodo = snapshot.val();
        periodoId = periodo.id;
        
        if(periodo.vigente == 1){
            
            database.ref('Ingresos').on('value',function(snap){
                let total_i = 0;
                    $.each(snap.val(),function(index,value){
                        if(value.periodoId==periodoId){
                            total_i+= parseFloat(value.monto);                         
                        }
                    });
                totalIngresos = total_i;

                database.ref('Movimientos').on('value',function(snap){

                let total_g = 0;
                    $.each(snap.val(),function(index,value){
                        if(value.periodoId==periodoId){
                            total_g+= parseFloat(value.precio);                         
                        }
                    });
                    totalGastos = total_g;

                    var data = {
                            labels: ['Ingresos', 'Gastos'],
                            datasets: [{
                                backgroundColor: ['#aaff99','#ff756b'],
                                borderColor: ['#aaff99','#ff756b'],
                                data: [totalIngresos, totalGastos]
                            }]
                        }

                    var myDoughnutChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: data
                    });
                });
            });
        }
    });
    
});
