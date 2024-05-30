import imprimir from "./printScreen.js";
import postRoommate from "./crud/postRoommate.js";
import postGasto from "./crud/postGasto.js";

import updateGasto from "./crud/updateGasto.js";

$(function () {
  let roommates = [];
  let gastos = [];
  let gastoEditing = null;

  // Print screen and get Roommates and Gastos
  imprimir()
    .then((array) => {
      [roommates, gastos] = array;
    })
    .catch((e) => console.log(e.message));

  // Agregar nuevo roommate
  async function nuevoRoommate() {
    try {
      const res = await postRoommate();
      if (res.status == 200) {
        [roommates, gastos] = await imprimir();
        Swal.fire({
          title: "Exito!",
          text: "Se agrego un nuevo usuario",
          icon: "success",
        });
      } else {
        throw new Error("No se pudo crear el usuario");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  window.nuevoRoommate = nuevoRoommate;

  // Agregar gasto

  $("#formulario_agregar_gasto").submit(function (e) {
    e.preventDefault();
    agregarGasto();
  });

  const agregarGasto = async () => {
    const elementoSelect = $("#roommatesSelect");
    const indexSelected = elementoSelect[0].options.selectedIndex;
    const optionSelected = elementoSelect[0].options[indexSelected];

    const idRoommate = $(optionSelected).attr("data-id");
    const roommateSelected = elementoSelect.val();
    const descripcion = $("#descripcion").val();
    const monto = Number($("#monto").val());

    try {
      const res = await postGasto(
        idRoommate,
        roommateSelected,
        descripcion,
        monto,
      );
      if (res.status == 200) {
        [roommates, gastos] = await imprimir();
        Swal.fire({
          title: "Exito!",
          text: "Se agrego un nuevo gasto",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Delete Gasto
  const deleteGasto = async (id) => {
    try {
      const res = await fetch("/gasto?id=" + id, {
        method: "DELETE",
      });
      if (res.status == 200) {
        [roommates, gastos] = await imprimir();
        Swal.fire({
          title: "¡Éxito!",
          text: "Se elimino el gasto",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "No se pudo eliminar el gasto",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  window.deleteGasto = deleteGasto;

  //Editar gasto
  const editGasto = (id) => {
    const { roommate, descripcion, monto } = gastos.find((g) => g.id == id);
    $("#roommatesSelectModal").val(roommate);
    $("#descripcionModal").html(descripcion);
    $("#montoModal").val(monto);
    $("#form_editar_gasto").attr("data-id-gasto", id);
  };
  window.editGasto = editGasto;

  $("#form_editar_gasto").on("submit", async function (e) {
    e.preventDefault();

    const id = $(this).attr("data-id-gasto");
    const descripcion = $("#descripcionModal").val();
    const monto = $("#montoModal").val();

    try {
      const res = await updateGasto(id, descripcion, monto);
      if (res.status === 200) {
        $("#exampleModal").modal("hide");
        [roommates, gastos] = await imprimir();
        Swal.fire({
          title: "Exito!",
          text: "Se edito el gasto",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  //Delete Roommate
  async function deleteRoommate(id) {
    try {
      const res = await fetch("/roommate?id=" + id, {
        method: "DELETE",
      });
      if (res.status == 200) {
        [roommates, gastos] = await imprimir();
        Swal.fire({
          title: "¡Exito!",
          text: "Se elimino el usuario",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  window.deleteRoommate = deleteRoommate;
});
