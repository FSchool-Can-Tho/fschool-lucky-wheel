import React, { useEffect, useState } from "react";
import "../styles/result-alert.css";

function SettingDialog({
  show,
  onHide,
  currentSettings = {},
  onChange,
  onReset,
}) {
  const [state, setState] = useState(currentSettings);

  const handleChangeState = (field) => (value) => {
    setState({ ...state, [field]: value });
  };

  const handleChangeImageKey = (index) => (value) => {
    setState({
      ...state,
      imageKeys: [
        ...state.imageKeys.slice(0, index),
        value,
        ...state.imageKeys.slice(index + 1),
      ],
    });
  };

  useEffect(() => {
    onChange(state);
  }, [state]);

  const textOptions = (
    <>
      <p>
        <label htmlFor="attendee-prefix">Chữ trước mục trúng giải</label>
      </p>
      <p>
        <input
          className="input-control"
          style={{ minWidth: "100%" }}
          id="attendee-prefix"
          value={state.attendeePrefix || ""}
          onChange={(e) => handleChangeState("attendeePrefix")(e.target.value)}
          placeholder="Trống"
        />
      </p>
      <p style={{ marginTop: 32 }}>
        <label htmlFor="prize-prefix">Chữ trước tên giải thưởng</label>
      </p>
      <p>
        <input
          className="input-control"
          style={{ minWidth: "100%" }}
          id="prize-prefix"
          value={state.prizePrefix || ""}
          onChange={(e) => handleChangeState("prizePrefix")(e.target.value)}
          placeholder="Trống"
        />
      </p>
    </>
  );

  const imageOptions = state.imageSources.map((imgSrc, index) => (
    <div
      key={`img${index}`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 32px",
      }}
    >
      <img
        className="hover-to-zoom"
        width="120px"
        src={imgSrc}
        style={{ border: "solid 1px grey", backgroundColor: "#fff" }}
        alt=""
      />
      <div style={{ flexGrow: 1, textAlign: "left", paddingLeft: "12px" }}>
        <p style={{ marginBottom: "3px" }}>
          <label htmlFor={`img${index}`}>Gán hình này cho mục</label>
        </p>
        <p style={{ marginTop: "6px" }}>
          <input
            id={`img${index}`}
            className="input-control"
            placeholder="Trống"
            value={state.imageKeys[index]}
            onChange={(e) => handleChangeImageKey(index)(e.target.value)}
          />
        </p>
      </div>
    </div>
  ));

  return (
    <div className={"dialog" + (show ? " show-up" : "")}>
      <div
        className={"dialog-content" + (show ? " show-up" : "")}
        style={{ minWidth: "400px" }}
      >
        <h2 className="title">Tùy chỉnh kết quả</h2>
        <p>Chế độ hiển thị</p>
        <p style={{ display: "flex", justifyContent: "space-evenly" }}>
          <span>
            <input
              type="radio"
              id="display-text"
              name="display-mode"
              value="text"
              checked={state.mode === "text"}
              onChange={(e) => handleChangeState("mode")(e.currentTarget.value)}
            />
            <label htmlFor="display-text">Văn bản</label>
          </span>
          <span>
            <input
              type="radio"
              id="display-image"
              name="display-mode"
              value="image"
              checked={state.mode === "image"}
              onChange={(e) => handleChangeState("mode")(e.currentTarget.value)}
            />
            <label htmlFor="display-image">Hình ảnh</label>
          </span>
        </p>
        <hr />
        <div
          style={{
            maxWidth: "400px",
            overflow: "hidden",
            height: "230px",
            maxHeight: "300px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              transition: "left 400ms",
              left: state.mode === "text" ? "0px" : "-500px",
              padding: "12px 32px",
              height: "100%",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            {textOptions}
          </div>
          <div
            style={{
              position: "absolute",
              transition: "left 400ms",
              left: state.mode === "image" ? "0px" : "500px",
              overflow: "auto",
              height: "100%",
              width: "100%",
            }}
          >
            {imageOptions}
          </div>
        </div>
        <hr />
        <button
          className="close-btn"
          style={{ marginRight: 12 }}
          onClick={onReset}
        >
          Reset
        </button>
        <button className="close-btn" onClick={onHide}>
          Xong
        </button>
      </div>
    </div>
  );
}

export default SettingDialog;
