import React, { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import "./styles/app.css";
import AttendeeList from "./components/AttendeeList";
import PrizeList from "./components/PrizeList";
import ResultList from "./components/ResultList";
import ResultAlert from "./components/ResultAlert";

function App() {
  const [attendee, setAttendee] = useState([""]);
  const [prize, setPrize] = useState({ name: "", count: 1 });
  const [result, setResult] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    setAttendee(JSON.parse(localStorage.getItem("attendee") || "[]"));
    setPrize(JSON.parse(localStorage.getItem("prize") || "{}"));
    setResult(JSON.parse(localStorage.getItem("result") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("attendee", JSON.stringify(attendee));
    localStorage.setItem("prize", JSON.stringify(prize));
    localStorage.setItem("result", JSON.stringify(result));
  }, [attendee, prize, result]);

  const handleResult = (index) => {
    setResult((prevResult) => [
      ...prevResult,
      { id: attendee[index], prize: prize.name },
    ]);
    setShowAlert({ id: attendee[index], index });
  };

  const handleCloseAlert = (index) => {
    setAttendee([
      ...attendee.slice(0, index),
      ...attendee.slice(index + 1, attendee.length),
    ]);
    setShowAlert(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "90vh",
          paddingRight: 12,
          paddingLeft: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "12px",
            bottom: "72px",
            transition: "left 400ms",
            zIndex: 9,
            left: showLeft ? "12px" : "-360px",
          }}
        >
          <AttendeeList
            value={attendee}
            onChange={(list) => setAttendee(list)}
          />
        </div>
        <Wheel
          list={attendee}
          loop={prize.count}
          showTextLabel={showLabel}
          onCompleted={handleResult}
        />
        <div
          style={{
            position: "fixed",
            top: "12px",
            bottom: "72px",
            zIndex: 9,
            transition: "right 400ms",
            right: showRight ? "12px" : "-360px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minWidth: "300px",
            }}
          >
            <PrizeList value={prize} onChange={(value) => setPrize(value)} />
            <ResultList data={result} onChange={(value) => setResult(value)} />
          </div>
        </div>
      </div>
      <ResultAlert
        id={showAlert && showAlert.id}
        show={!!showAlert}
        onHide={() => handleCloseAlert(showAlert && showAlert.index)}
        prize={prize.name}
      />
      <div className="toolbar">
        <button className="left-control" onClick={() => setShowLeft(!showLeft)}>
          {showLeft ? "<< Ẩn" : "Hiện >>"}
        </button>
        <div>
          <button className="setting-btn">Tùy chỉnh kết quả</button>
          <button
            className="setting-btn"
            onClick={() => setShowLabel(!showLabel)}
          >
            {showLabel ? "Ẩn" : "Hiện"} nhãn trên vòng
          </button>
        </div>
        <button
          className="right-control"
          onClick={() => setShowRight(!showRight)}
        >
          {showRight ? "Ẩn >>" : "<< Hiện"}
        </button>
      </div>
    </>
  );
}

export default App;
