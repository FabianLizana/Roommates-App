const getRoommates = async () => {
  try {
    const res = await fetch("/roommates");
    const data = await res.json();

    const roommates = data.roommates;
    return roommates;
  } catch (error) {
    return error;
  }
};
export default getRoommates;
