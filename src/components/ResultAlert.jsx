import React from "react";
import "../styles/result-alert.css";

function ResultAlert({ settings, prize, id, show, onHide }) {
  const imageIndex = settings.imageKeys.indexOf(id);

  return (
    <div className={"dialog" + (show ? " show-up" : "")}>
      <div className={"dialog-content" + (show ? " show-up" : "")}>
        {settings.mode === "text" && (
          <>
            <h2 className="title">Chúc mừng!</h2>
            <p className="bigtext">
              {settings.attendeePrefix} {id}
            </p>
            {prize && (
              <p className="subtitle">
                {settings.prizePrefix} {prize}
              </p>
            )}
          </>
        )}
        {settings.mode === "image" && (
          <div>
            {imageIndex < 0 && (
              <p className="bigtext">
                {settings.attendeePrefix} {id}
              </p>
            )}
            <img
              width="500px"
              src={settings.imageSources[imageIndex]}
              alt={id}
            />
          </div>
        )}
        <button className="close-btn" onClick={onHide}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default ResultAlert;
