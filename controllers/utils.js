import { promises as fs } from "fs";
import path from "path";

export function calcularDebeHaber(gastos, roommates) {
  const gastoTotalporRoommate = {};
  gastos.forEach((gasto) => {
    if (gasto.idRoommate in gastoTotalporRoommate) {
      gastoTotalporRoommate[gasto.idRoommate] =
        Number(gastoTotalporRoommate[gasto.idRoommate]) + gasto.monto;
    } else {
      gastoTotalporRoommate[gasto.idRoommate] = Number(gasto.monto);
    }
  });

  const gastoTotal = Object.values(gastoTotalporRoommate).reduce(
    (total, gasto) => total + gasto,
    0,
  );

  const cantidadRoommates = roommates.length;
  const gastoTotalRepartido = gastoTotal / cantidadRoommates;

  roommates.forEach((roommate) => {
    roommate.debe = -Math.round(
      gastoTotalRepartido -
        (gastoTotalporRoommate[roommate.id] ?? 0) / cantidadRoommates,
    );

    roommate.recibe = Math.round(
      (gastoTotalporRoommate[roommate.id] ?? 0) -
        (gastoTotalporRoommate[roommate.id] ?? 0) / cantidadRoommates,
    );
  });

  return roommates;
}



// ---PASO 4 EXTRA BORRAR DATA 30 MIN---El cual hace uso de la siguiente función resetScript:
export async function resetScript() {
  try {
    await fs.writeFile(
      path.join(path.resolve(), "data", "roommates.json"),
      JSON.stringify({ roommates: [] }, null, 2),
      "utf-8",
    );
    await fs.writeFile(
      path.join(path.resolve(), "data", "gastos.json"),
      JSON.stringify({ gastos: [] }, null, 2),
      "utf-8",
    );
    return "exito";
  } catch (error) {
    return error;
  }
}
