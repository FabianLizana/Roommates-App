const postGasto = async (idRoommate, roommateSelected, descripcion, monto) => {
  try {
    return await fetch("/gasto", {
      method: "POST",
      body: JSON.stringify({
        idRoommate,
        roommate: roommateSelected,
        descripcion,
        monto,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return error;
  }
};

export default postGasto;
