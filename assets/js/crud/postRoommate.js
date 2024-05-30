const postRoommate = async () => {
  try {
    return await fetch("/roommate", { method: "POST" });
  } catch (error) {
    return error;
  }
};

export default postRoommate;
