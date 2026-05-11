import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API_BASE = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    async function fetchToys() {
      const response = await fetch(API_BASE);
      if (!response.ok) return;
      const toysData = await response.json();
      setToys(toysData);
    }

    fetchToys();
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleAddToy(toyData) {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...toyData, likes: 0 }),
    });
    if (!response.ok) return;
    const newToy = await response.json();
    setToys((toys) => [...toys, newToy]);
  }

  async function handleDeleteToy(toyId) {
    const response = await fetch(`${API_BASE}/${toyId}`, {
      method: "DELETE",
    });
    if (!response.ok) return;

    setToys((toys) => toys.filter((toy) => toy.id !== toyId));
  }

  async function handleLikeToy(toyId) {
    const toy = toys.find((toy) => toy.id === toyId);
    if (!toy) return;

    const response = await fetch(`${API_BASE}/${toyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    });
    if (!response.ok) return;
    const updatedToy = await response.json();

    setToys((toys) =>
      toys.map((currentToy) =>
        currentToy.id === toyId ? updatedToy : currentToy
      )
    );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
