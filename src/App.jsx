import "./App.css";
import Table from "./components/Table";
import React from "react";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Crop Data Analysis</h1>
          <Table />;
        </header>
      </div>
    </>
  );
}

export default App;
