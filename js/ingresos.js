var database = firebase.database();
let periodoId = "";
let tableBody = document.querySelector("#table-responsive-body");
let $btnGuardarGasto = $("#guardar-gasto");
let $monto = $("#monto");
let $tipo = $("#tipo");
let $total = $("#total");
let $mElimId = $("#m-elim-id");
let keyPeriodo;

$(document).ready(function () {
  var jsFiltrar = document.querySelectorAll(".filtrar");
  var jsBuscar = document.querySelectorAll(".buscar");
  $(jsFiltrar).keyup(function () {
    var idfil = $(this).attr("ident-buscar");
    var rex = new RegExp($(this).val(), "i");
    $(jsBuscar).children("tr").hide();
    $(jsBuscar)
      .children("tr")
      .filter(function () {
        return rex.test($(this).text());
      })
      .show();
  });

  listarIngresos();
  listarTipos();
  $('[data-toggle="tooltip"]').tooltip();
});

function salir() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      window.location.href = "login.html";
    })
    .catch(function (error) {
      // An error happened.
    });
}

firebase.auth().onAuthStateChanged(function (user) {
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

function guardar() {
  database
    .ref("Ingresos/")
    .push({
      tipo: $tipo.val(),
      monto: $monto.val(),
      fecha: String(moment(new Date()).format("DD/MM/YYYY")),
      hora: String(moment(new Date()).format("HH:mm")),
      periodoId: periodoId,
    })
    .then(function (res) {
      $("#myModal").modal("toggle");
      $monto.val("");
      $tipo.val("");
    });
}

function listarTipos() {
  database.ref("Tipos").on("value", function (snap) {
    $tipo.empty();
    $tipo.append("<option value=''>--Seleccionar--</option>");
    $.each(snap.val(), function (index, value) {
      $tipo.append(
        "<option value='" +
          value.descripcion +
          "'>" +
          value.descripcion +
          "</option>"
      );
    });
  });
}

function listarIngresos() {
  database
    .ref("Periodo/")
    .orderByChild("vigente")
    .equalTo(1)
    .on("child_added", function (snapshot) {
      keyPeriodo = snapshot.key;
      var periodo = snapshot.val();
      periodoId = periodo.id;

      if (periodo.vigente == 1) {
        database.ref("Ingresos").on("value", function (snap) {
          let html = "";
          let total = 0;
          $.each(snap.val(), function (index, value) {
            if (value.periodoId == periodoId) {
              html += `<tr>`;
              html += `<td>${value.tipo}</td>`;
              html += `<td>S/.${value.monto}</td>`;
              html += `<td>${value.fecha}</td>`;
              html += `<td><button  type='button' onclick='setIdReq("${index}")' class='btn btn-danger btn-sm' data-toggle="modal" data-target="#modal-eliminar" ><i class="far fa-trash-alt"></i></button></td>`;
              html += `</tr>`;
              total += parseFloat(value.monto);
            }
          });
          $("#total").text("S/." + total);
          tableBody.innerHTML = html;
        });
      }
    });
}

function eliminar() {
  var refId = database.ref("Ingresos").child($mElimId.val());
  refId.remove().then(function (res) {
    $("#modal-eliminar").modal("toggle");
  });
}

function setIdReq(id) {
  $mElimId.val(id);
}

function openModalNewGasto() {
  $("#modal-guardar").modal("toggle");
}
