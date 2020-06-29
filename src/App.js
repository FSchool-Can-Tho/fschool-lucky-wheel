import React from "react";
import Wheel from "./components/Wheel";

function App() {
  return <Wheel list={["", "", ""]} onCompleted={(result) => alert(result)} />;
}

export default App;
