import React, { useState } from "react";
import Wheel from "./components/Wheel";
import "./styles/app.css";
import AttendeeList from "./components/AttendeeList";
import PrizeList from "./components/PrizeList";

function App() {
  const [attendee, setAttendee] = useState([""]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <AttendeeList value={attendee} onChange={(list) => setAttendee(list)} />
      <Wheel list={attendee} onCompleted={(result) => alert(result)} />
      <PrizeList />
    </div>
  );
}

export default App;
