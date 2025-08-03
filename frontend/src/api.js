// frontend/src/api.js
export const fetchHello = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/hello`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error al conectar con el backend:", err);
  }
};
