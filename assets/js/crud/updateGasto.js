const updateGasto = async (id, descripcion, monto) => {
  try {
    return await fetch("/gasto", {
      method: "PUT",
      body: JSON.stringify({
        id,
        descripcion,
        monto,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return error;
  }
};

export default updateGasto;
