import getRoommates from "./crud/getRoommates.js";

import getGastos from "./crud/getGastos.js";

const imprimir = async () => {
  try {
    const roommates = await getRoommates();
    const gastos = await getGastos();

    $("#roommates").html("");
    $("#roommatesSelect").html(
      "<option value=''>Selecciona una opción</option>",
    );
    $("#roommatesSelectModal").html("");
    roommates.forEach((r) => {
      $("#roommatesSelect").append(`
      <option data-id="${r.id}" value="${r.nombre}">${r.nombre}</option>
      `);
      $("#roommatesSelectModal").append(`
      <option value="${r.nombre}">${r.nombre}</option>
      `);
      $("#roommates").append(`
              <tr>
                <td>${r.nombre}</td>
                <td class="text-danger">${r.debe ? r.debe : "-"}</td>
                <td class="text-success">${r.recibe ? r.recibe : "-"}</td>
                <td class="text-danger"><i class="fas fa-trash-alt" onclick="deleteRoommate('${
                  r.id
                }')"></i></td>
              </tr>
          `);
    });
    $("#gastosHistorial").html("");
    gastos.forEach((g) => {
      $("#gastosHistorial").append(`
            <tr>
              <td>${g.roommate}</td>
              <td>${g.descripcion}</td>
              <td>${g.monto}</td>
              <td>
                <div class="d-flex align-items-center justify-content-evenly">
                  <i class="fas fa-edit text-warning" onclick="editGasto('${g.id}')" data-toggle="modal" data-target="#exampleModal"></i>
                  <i class="fas fa-trash-alt text-danger" onclick="deleteGasto('${g.id}')" ></i>
                </div>
              </td>
            </tr>
          `);
    });

    return [roommates, gastos];
  } catch (e) {
    console.log(e);
    return e;
  }
};
export default imprimir;
