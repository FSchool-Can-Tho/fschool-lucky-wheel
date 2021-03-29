import React, { useState, useEffect, useCallback } from "react";
import "../styles/wheel.css";

function Wheel({ showTextLabel, list, onCompleted }) {
  const [state, setState] = useState({
    radius: 120, // PIXELS
    rotate: 0, // DEGREES
    easeOut: 0, // SECONDS
    angle: 0, // RADIANS
    result: null, // INDEX
    spinning: false,
  });

  const cleanUp = () => {
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderSector = useCallback(
    (index, text, start, arc, color) => {
      let canvas = document.getElementById("wheel");
      let ctx = canvas.getContext("2d");
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      let radius = state.radius;
      let startAngle = start;
      let endAngle = start + arc;
      let angle = index * arc;
      let baseSize = radius * 2.08;
      let textRadius = baseSize - 52;

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle, false);
      ctx.lineWidth = radius * 2;
      ctx.strokeStyle = color;

      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.stroke();

      ctx.save();
      ctx.translate(
        baseSize + Math.cos(angle - arc / 2) * textRadius,
        baseSize + Math.sin(angle - arc / 2) * textRadius
      );
      ctx.rotate(angle - arc / 2);
      if (showTextLabel) {
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      }
      ctx.restore();
    },
    [state.radius, showTextLabel]
  );

  const getColor = () => {
    let r = Math.floor(Math.random() * 125);
    let g = Math.floor(Math.random() * 125);
    let b = Math.floor(Math.random() * 125);
    return `rgba(${r + 120},${g + 120},${b + 120}, 1)`;
  };

  const generateColorsList = useCallback((keylist) => {
    const keys = Array.from(new Set(keylist));
    const colors = {};
    keys.map((key) => (colors[key] = getColor()));
    return colors;
  }, []);

  const renderWheelByList = useCallback(
    (listdata) => {
      cleanUp();
      let numOptions = listdata.length;
      if (!numOptions) return;
      let arcSize = (2 * Math.PI) / numOptions;
      setState((prevState) => {
        return {
          ...prevState,
          angle: arcSize,
          result:
            prevState.result !== null
              ? prevState.result
              : Math.floor(Math.PI / 2 / arcSize),
          rotate: prevState.rotate || 0,
          easeOut: 0,
          spinning: false,
        };
      });

      const colors = generateColorsList(listdata);
      let angle = 0;
      for (let i = 0; i < numOptions; i++) {
        let text = listdata[i];
        let color = colors[text];
        renderSector(i + 1, text, angle, arcSize, color);
        angle += arcSize;
      }
    },
    [generateColorsList, renderSector]
  );

  const spin = async () => {
    const data = list;
    const listdata = data.filter((elem) => elem.split("/")[1] > 0);
    if (listdata.length === 0) return;
    renderWheelByList(listdata);
    const angle = (360 / (2 * Math.PI)) * state.angle;
    const random = Math.floor(Math.random() * listdata.length);
    const spinAngle = 360 * 3 + angle * random;
    const resultIndex = (state.result + random) % listdata.length;
    const realIndex = data.indexOf(listdata[resultIndex]);
    setState((prevState) => ({
      ...prevState,
      rotate: prevState.rotate + spinAngle,
      easeOut: 2,
      spinning: true,
    }));
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        result: realIndex,
        spinning: false,
      }));
      onCompleted(realIndex);
    }, 2000);
  };

  useEffect(() => {
    renderWheelByList(list.filter((elem) => elem.split("/")[1] > 0));
  }, [list, renderWheelByList]);

  return (
    <div className="wheel-wrapper">
      <canvas
        id="wheel"
        width="500"
        height="500"
        style={{
          WebkitTransform: `rotate(-${state.rotate}deg)`,
          WebkitTransition: `-webkit-transform ${state.easeOut}s ease-out`,
        }}
      />
      <span id="selector">&#9650;</span>

      <div className="display">
        <span id="result">{list[state.result] || "???"}</span>
      </div>
      <div style={{ position: "absolute" }}>
        <button
          type="button"
          id="spin"
          onClick={spin}
          disabled={state.spinning}
        >
          <strong>Start</strong>
        </button>
      </div>
    </div>
  );
}

export default Wheel;
