import React from "react";
import "../styles/result-alert.css";

function ResultAlert({ prize, id, show, onHide }) {
  return (
    <div className={"dialog" + (show ? " show-up" : "")}>
      <div className={"dialog-content" + (show ? " show-up" : "")}>
        <h2 className="title">Chúc mừng!</h2>
        <p className="bigtext">{id}</p>
        <p className="subtitle">Đã đạt {prize}</p>
        <button className="close-btn" onClick={onHide}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default ResultAlert;
