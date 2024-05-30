// 1. Ocupar el módulo File System para la manipulación de archivos alojados en el servidor. (3 Puntos)
// He ocupado el módulo File System adaptado para trabajar con promesas tal y como muestro a continuación:
import { promises as fs } from "fs";
import path from "path";
import { calcularDebeHaber } from "./utils.js";
async function crearGasto(idRoommate, roommate, descripcion, monto) {
  try {
    const filePath = path.join(path.resolve(), "data", "gastos.json");
    const dataJSON = await fs.readFile(filePath, "utf-8");
    const dataParse = JSON.parse(dataJSON);
    const objetoGasto = {
      id: dataParse.gastos.length + 1,
      idRoommate,
      roommate,
      descripcion,
      monto,
    };

    dataParse.gastos.push(objetoGasto);
    await fs.writeFile(filePath, JSON.stringify(dataParse, null, 2), "utf-8");

    //division de gastos
    const filePathRoomMate = path.join(
      path.resolve(),
      "data",
      "roommates.json",
    );
    const dataJSONRoommate = await fs.readFile(filePathRoomMate, "utf-8");
    const dataParseRoomMate = JSON.parse(dataJSONRoommate);
    const roommatesActualizado = calcularDebeHaber(
      dataParse.gastos,
      dataParseRoomMate.roommates,
    );
    await fs.writeFile(
      filePathRoomMate,
      JSON.stringify({ roommates: roommatesActualizado }, null, 2),
      "utf-8",
    );
    return "exito";
  } catch (error) {
    return error;
  }
}

export default crearGasto;
