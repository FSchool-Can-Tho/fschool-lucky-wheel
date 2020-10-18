import React, { useState, useEffect, useContext, useCallback } from "react";
import Wheel from "./components/Wheel";
import "./styles/app.css";
import AttendeeList from "./components/AttendeeList";
import PrizeList from "./components/PrizeList";
import ResultList from "./components/ResultList";
import ResultAlert from "./components/ResultAlert";
import SettingDialog from "./components/SettingDialog";
import { FirebaseContext } from "./FirebaseProvider";

const imageSources = Array.from(Array(7)).map((v, i) =>
  require(`./images/img0${i}.png`)
);

const defaultSettings = {
  mode: "text",
  attendeePrefix: "",
  prizePrefix: "Đã đạt",
  imageKeys: imageSources.map(() => ""),
  imageSources,
};

function App() {
  const sessionId = "test";
  const isAuth = true;
  const { db } = useContext(FirebaseContext);
  const [state, setState] = useState({
    attendee: [""],
    prize: { name: "", count: 1 },
    result: [],
    showLabel: true,
    showLeft: true,
    showRight: true,
    settings: defaultSettings,
  });
  const [showSetting, setShowSetting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    attendee,
    prize,
    result,
    showLabel,
    showLeft,
    showRight,
    settings,
  } = state;

  const handleChangeState = (name) => (value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (isAuth) {
    db.ref(sessionId).on("value", function (snapshot) {});
  }

  const saveOnCloud = useCallback(() => {
    db.ref(sessionId).set(state);
  }, [db, state]);

  const saveOnLocal = useCallback(() => {
    localStorage.setItem(sessionId, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const localState = localStorage.getItem(sessionId);
    if (localState) {
      setState(JSON.parse(localState));
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      saveOnCloud();
    }
    saveOnLocal();
  }, [isAuth, saveOnCloud, saveOnLocal]);

  const updateAttendee = (index) => {
    const [value, count = 1] = attendee[index].split("/");
    if (count <= 1 || isNaN(count * 1)) {
      handleChangeState("attendee")([
        ...attendee.slice(0, index),
        ...attendee.slice(index + 1),
      ]);
    } else {
      handleChangeState("attendee")([
        ...attendee.slice(0, index),
        `${value}/${count - 1}`,
        ...attendee.slice(index + 1),
      ]);
    }
  };

  const handleResult = (index) => {
    updateAttendee(index);
    handleChangeState("result")([
      ...result,
      {
        id: attendee[index].split("/")[0],
        prize: prize.name || new Date().toLocaleString("vi-VN"),
      },
    ]);
    setShowAlert({ id: attendee[index].split("/")[0], index });
  };

  const handleCloseAlert = (index) => {
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
            onChange={(data) => {
              handleChangeState("attendee")(data);
            }}
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
            <PrizeList
              value={prize}
              onChange={(value) => handleChangeState("prize")(value)}
            />
            <ResultList
              data={result}
              onChange={(value) => handleChangeState("result")(value)}
            />
          </div>
        </div>
      </div>
      {!!showAlert && (
        <ResultAlert
          id={showAlert && showAlert.id}
          show={!!showAlert}
          onHide={() => handleCloseAlert(showAlert && showAlert.index)}
          prize={prize.name}
          settings={settings}
        />
      )}
      {showSetting && (
        <SettingDialog
          currentSettings={settings}
          onChange={(value) => handleChangeState("settings")(value)}
          show={showSetting}
          onHide={() => setShowSetting(false)}
          onReset={() => {
            setShowSetting(false);
            handleChangeState("settings")(defaultSettings);
          }}
        />
      )}
      <div className="toolbar">
        <button
          className="left-control"
          onClick={() => handleChangeState("showLeft")(!showLeft)}
        >
          {showLeft ? "<< Ẩn" : "Hiện >>"}
        </button>
        <div>
          <button
            className="setting-btn"
            onClick={() => setShowSetting(!showSetting)}
          >
            Tùy chỉnh kết quả
          </button>
          <button
            className="setting-btn"
            onClick={() => handleChangeState("showLabel")(!showLabel)}
          >
            {showLabel ? "Ẩn" : "Hiện"} nhãn trên vòng
          </button>
        </div>
        <button
          className="right-control"
          onClick={() => handleChangeState("showRight")(!showRight)}
        >
          {showRight ? "Ẩn >>" : "<< Hiện"}
        </button>
      </div>
    </>
  );
}

export default App;
