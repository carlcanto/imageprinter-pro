import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then((res) => res.text())
      .then((data) => setMensaje(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
}

export default App;
