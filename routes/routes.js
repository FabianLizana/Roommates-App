import express from "express";

import {
  renderHome,
  getRoommates,
  getGastos,
  notFound,
  postRoommate,
  postGasto,
  deleteGasto,
  deleteRoommate,
  updateGasto,
  resetData,
} from "../controllers/index.js";

import { resetScript } from "../controllers/utils.js";

const router = express.Router();

router.get("/", renderHome);

// get Roommates
// 4.5. GET /roommates: Devuelve todos los roommates almacenados en el servidor (roommates.json). Se debe considerar recalcular y actualizar las cuentas de los roommates luego de este proceso. (3 Puntos)
// ---PASO 5 PUNTO 4---La siguiente ruta me permite devuelve todos los roommates almacenados en el servidor (roommates.json):
router.get("/roommates", getRoommates);

//Post Roommate
// PASO 3 PREGUNTA 3: La ruta que crea un usuario es la siguiente:
router.post("/roommate", postRoommate);

//Delete roommate

router.delete("/roommate", deleteRoommate);

//get Gastos
// 4. Crear una API REST que contenga las siguientes rutas
// 4.1. GET /gastos: Devuelve todos los gastos almacenados en el archivo gastos.json
// ---PASO 1 PUNTO 4---He creado la siguiente ruta que devuelve todos los gastos almacenados en el archivo gastos.json:
router.get("/gastos", getGastos);

//post Gasto
// 4.2. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un archivo JSON (gastos.json)
// ---PASO 2 PUNTO 4---La siguiente ruta me permite crear un gasto:
router.post("/gasto", postGasto);

//Update Gasto
// 4.3. PUT /gasto: Recibe el payload de la consulta y modifica los datos almacenados en el servidor (gastos.json)
// ---PASO 3 PUNTO 4---La siguiente ruta me permite editar un gasto:
router.put("/gasto", updateGasto);

//delete Gasto
// 4.4. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine del historial de gastos (gastos.json)
// ---PASO 4 PUNTO 4---La siguiente ruta me permite eliminar un gasto:
router.delete("/gasto", deleteGasto);

//Ruta para resetear archivos json
// Extra: Reseteo de Data vía Ruta y vía intervalo cada 30 minutos
// Creación de ruta reset para reseteo de data vía ruta:
router.get("/reset", resetData);

//No found
router.get("/*", notFound);


// ---PASO 3 EXTRA BORRAR DATA 30 MIN---Y creación de un setInterval para reseteo de data cada 30 minutos:
setInterval(async () => {
  try {
    const resultado = await resetScript();
    if (resultado === "exito") {
      console.log("Data reseteada");
    } else {
      throw new Error("No se pudo resetear la data");
    }
  } catch (error) {
    console.error("Error al resetear la data", error.message);
  }
}, 1800000);

export default router;
