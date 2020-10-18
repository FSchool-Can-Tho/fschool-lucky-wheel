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
  const isAuth = true;
  const [sessionId, setSessionId] = useState("0000");
  const { db, serverValue } = useContext(FirebaseContext);
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
    result,
    prize,
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

  const saveOnCloud = useCallback(() => {
    db.ref(sessionId).update({
      prize,
      showLabel,
      showLeft,
      showRight,
      settings,
    });
  }, [db, prize, showLabel, showLeft, showRight, settings]);

  const saveOnLocal = useCallback(() => {
    localStorage.setItem(sessionId, JSON.stringify(state));
  }, [state]);

  const readFromLocal = useCallback(() => {
    const localState = localStorage.getItem(sessionId);
    if (localState) {
      setState((prevState) => ({
        ...prevState,
        ...JSON.parse(localState),
      }));
    }
  }, []);

  const updateAttendee = (index) => {
    const [value, count = 1] = attendee[index].split("/");
    if (count <= 1 || isNaN(count * 1)) {
      handleChangeState("attendee")([
        ...attendee.slice(0, index),
        `${value}/${0}`,
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

  const handleFinishSpin = (index) => {
    setShowAlert({ id: attendee[index].split("/")[0], index });
    updateAttendee(index);
    handleChangeState("result")([
      ...result,
      {
        id: attendee[index].split("/")[0],
        prize: prize.name || new Date().toLocaleString("vi-VN"),
      },
    ]);
  };

  const handleResult = (index) => {
    if (isAuth) {
      db.ref(sessionId)
        .child("resultList")
        .push({
          id: attendee[index].split("/")[0],
          prize: prize.name || new Date().toLocaleString("vi-VN"),
        });
      db.ref(sessionId)
        .child("attendeeList")
        .child(`${index}`)
        .child("count")
        .set(serverValue.increment(-1));
    }
  };

  const handleCloseAlert = (index) => {
    setShowAlert(null);
    syncData();
  };

  const uploadAttendees = () => {
    const attendeeList = attendee
      .filter((elem) => !!elem)
      .map((elem) => {
        const [name, count = 1] = elem.split("/");
        if (isNaN(count * 1)) {
          return { name, count: 1 };
        }
        return { name, count: count * 1 };
      });
    db.ref(sessionId).update({ attendeeList });
  };

  const syncData = async () => {
    const snapshot = await db.ref(sessionId).once("value");
    const { attendeeList, resultList, ...data } = snapshot.val() || {};
    if (!attendeeList) {
      uploadAttendees();
    } else {
      data.attendee = attendeeList.map((elem) => `${elem.name}/${elem.count}`);
    }
    data.result = resultList ? Object.values(resultList) : [];
    setState((prevState) => ({
      ...prevState,
      ...data,
    }));
    return data.attendee || attendee;
  };

  useEffect(() => {
    if (isAuth) {
      syncData();
    } else {
      readFromLocal();
    }
  }, [db, isAuth, readFromLocal]);

  useEffect(() => {
    if (isAuth) {
      saveOnCloud();
    }
    saveOnLocal();
  }, [isAuth, saveOnCloud, saveOnLocal]);

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
          onCompleted={handleFinishSpin}
          onResult={handleResult}
          syncData={syncData}
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
          <div className="input-group">
            <button onClick={syncData}>
              Đồng bộ
            </button>
            <input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              type="number"
            />
          </div>
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
