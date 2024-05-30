const getGastos = async () => {
  try {
    const res = await fetch("/gastos");
    const data = await res.json();
    const gastos = data.gastos;

    return gastos;
  } catch (error) {
    return error;
  }
};

export default getGastos;
