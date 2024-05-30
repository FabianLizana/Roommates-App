import { promises as fs } from "fs";
import path from "path";

import crearUsuario from "./crearUsuario.js";
import crearGasto from "./crearGasto.js";
import { calcularDebeHaber } from "./utils.js";

export function renderHome(req, res) {
  res.sendFile("views/index.html", { root: "." });
}

export function notFound(req, res) {
  res.status(404).sendFile("views/no_found.html", { root: "." });
}

// 5. Devolver los códigos de estado HTTP correspondientes a cada situación. (1 Punto)
// He devuelto los códigos de estado para cada situación y procedo a manejarlos en el front end. A continuación muestro un ejemplo:
export async function getRoommates(req, res) {
  try {
    const filePath = path.join(path.resolve(), "data", "roommates.json");
    const dataJSON = await fs.readFile(filePath, "utf-8");
    const dataParse = JSON.parse(dataJSON);
    res.json(dataParse);
  } catch (error) {
    res.status(500).send(error);
  }
}
// 2. Capturar los errores para condicionar el código a través del manejo de excepciones. (1 Punto)
// todo mi codigo usa try y catch.
export async function getGastos(req, res) {
  try {
    const filePath = path.join(path.resolve(), "data", "gastos.json");
    const dataJSON = await fs.readFile(filePath, "utf-8");

    const dataParse = JSON.parse(dataJSON);

    res.status(200).json(dataParse);
  } catch (error) {
    res.status(500).send(error);
  }
}

// PASO 2 PREGUNTA 3: Dicho código lo utilizo en el siguiente middleware:
export async function postRoommate(req, res) {
  try {
    await crearUsuario();
    res.status(200).send("usuario creado");
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postGasto(req, res) {
  try {
    const { idRoommate, roommate, descripcion, monto } = req.body;

    const resultado = await crearGasto(
      idRoommate,
      roommate,
      descripcion,
      monto,
    );
    console.log(resultado);
    if (resultado === "exito") {
      res.status(200).send("gasto creado");
    } else {
      throw new Error("No se pudo crear el gasto");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function deleteGasto(req, res) {
  try {
    const id = req.query.id;
    const filePathGastos = path.join(path.resolve(), "data", "gastos.json");
    const dataJSONGastos = await fs.readFile(filePathGastos, "utf-8");
    const dataParseGastos = JSON.parse(dataJSONGastos);
    const gastos = dataParseGastos.gastos;
    const newGastos = gastos.filter((gasto) => gasto.id != id);

    const filePathRoomMates = path.join(
      path.resolve(),
      "data",
      "roommates.json",
    );
    const dataJSONRoomMates = await fs.readFile(filePathRoomMates, "utf-8");
    const dataParseRoomMates = JSON.parse(dataJSONRoomMates);
    const roommates = dataParseRoomMates.roommates;

    const nuevosRoommates = calcularDebeHaber(newGastos, roommates);

    await fs.writeFile(
      filePathGastos,
      JSON.stringify({ gastos: newGastos }, null, 2),
      "utf-8",
    );
    await fs.writeFile(
      filePathRoomMates,
      JSON.stringify({ roommates: nuevosRoommates }, null, 2),
      "utf-8",
    );
    res.status(200).send("gasto eliminado");
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updateGasto(req, res) {
  try {
    const { id, descripcion, monto } = req.body;

    const filePathGastos = path.join(path.resolve(), "data", "gastos.json");
    const dataJSONGastos = await fs.readFile(filePathGastos, "utf-8");
    const dataParseGastos = JSON.parse(dataJSONGastos);
    const gastos = dataParseGastos.gastos;
    const newGastos = gastos.map((gasto) => {
      if (gasto.id == id) {
        gasto.monto = monto;
        gasto.descripcion = descripcion;
      }
      return gasto;
    });

    const filePathRoomMates = path.join(
      path.resolve(),
      "data",
      "roommates.json",
    );
    const dataJSONRoomMates = await fs.readFile(filePathRoomMates, "utf-8");
    const dataParseRoomMates = JSON.parse(dataJSONRoomMates);
    const roommates = dataParseRoomMates.roommates;

    const nuevosRoommates = calcularDebeHaber(newGastos, roommates);
    await fs.writeFile(
      filePathGastos,
      JSON.stringify({ gastos: newGastos }, null, 2),
      "utf-8",
    );
    await fs.writeFile(
      filePathRoomMates,
      JSON.stringify({ roommates: nuevosRoommates }, null, 2),
      "utf-8",
    );

    res.status(200).send("gasto actualizado");
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function deleteRoommate(req, res) {
  const { id } = req.query;
  try {
    const filePathRoomMates = path.join(
      path.resolve(),
      "data",
      "roommates.json",
    );
    const dataJSONRoomMates = await fs.readFile(filePathRoomMates, "utf-8");
    const dataParseRoomMates = JSON.parse(dataJSONRoomMates);
    const roommates = dataParseRoomMates.roommates;
    const newRoommates = roommates.filter((roommate) => roommate.id !== id);

    const filePathGastos = path.join(path.resolve(), "data", "gastos.json");
    const dataJSONGastos = await fs.readFile(filePathGastos, "utf-8");
    const dataParseGastos = JSON.parse(dataJSONGastos);
    const gastos = dataParseGastos.gastos;
    const newGastos = gastos.filter((gasto) => gasto.idRoommate !== id);

    const nuevosRoommates = calcularDebeHaber(newGastos, newRoommates);
    await fs.writeFile(
      filePathGastos,
      JSON.stringify({ gastos: newGastos }, null, 2),
      "utf-8",
    );
    await fs.writeFile(
      filePathRoomMates,
      JSON.stringify({ roommates: nuevosRoommates }, null, 2),
      "utf-8",
    );

    res.status(200).send("roommate eliminado");
  } catch (error) {
    res.status(500).send(error);
  }
}

// ---PASO 2 EXTRA BORRAR DATA 30 MIN---Para lo cual he creado el siguiente middleware:
export async function resetData(req, res) {
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
    res.status(200).send("Data reseteada 😄");
  } catch (error) {
    res.status(500).send(error);
  }
}
