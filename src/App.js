import React, { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import "./styles/app.css";
import AttendeeList from "./components/AttendeeList";
import PrizeList from "./components/PrizeList";
import ResultList from "./components/ResultList";

function App() {
  const [attendee, setAttendee] = useState([""]);
  const [prize, setPrize] = useState({ name: "", count: 1 });
  const [result, setResult] = useState([]);

  useEffect(() => {
    setAttendee(JSON.parse(localStorage.getItem("attendee") || "['']"));
    setPrize(JSON.parse(localStorage.getItem("prize") || "['']"));
    setResult(JSON.parse(localStorage.getItem("result") || "['']"));
  }, []);

  useEffect(() => {
    localStorage.setItem("attendee", JSON.stringify(attendee));
    localStorage.setItem("prize", JSON.stringify(prize));
    localStorage.setItem("result", JSON.stringify(result));
  }, [attendee, prize, result]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        height: "90vh",
      }}
    >
      <AttendeeList value={attendee} onChange={(list) => setAttendee(list)} />
      <Wheel
        list={attendee}
        loop={prize.count}
        onCompleted={(index) =>
          setResult((prevResult) => [
            ...prevResult,
            { id: attendee[index], prize: prize.name },
          ])
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <PrizeList value={prize} onChange={(value) => setPrize(value)} />
        <ResultList data={result} onChange={(value) => setResult(value)} />
      </div>
    </div>
  );
}

export default App;
