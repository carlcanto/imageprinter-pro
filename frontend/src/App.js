// frontend/src/App.js
import React, { useEffect, useState } from "react";
import { fetchHello } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchHello().then((data) => {
      if (data?.message) {
        setMessage(data.message);
      }
    });
  }, []);

  return (
    <div>
      <h1>Conexión Backend - Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
