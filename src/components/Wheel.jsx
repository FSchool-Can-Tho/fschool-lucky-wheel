import React, { useState, useEffect, useCallback } from "react";
import "../styles/wheel.css";

function Wheel({ list, onCompleted }) {
  const [state, setState] = useState({
    radius: 120, // PIXELS
    rotate: 0, // DEGREES
    easeOut: 0, // SECONDS
    angle: 0, // RADIANS
    result: null, // INDEX
    spinning: false,
  });

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

      ctx.font = "17px Arial";
      ctx.fillStyle = "black";
      ctx.stroke();

      ctx.save();
      ctx.translate(
        baseSize + Math.cos(angle - arc / 2) * textRadius,
        baseSize + Math.sin(angle - arc / 2) * textRadius
      );
      ctx.rotate(angle - arc / 2);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    },
    [state.radius]
  );

  const getColor = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.4)`;
  };

  const spin = () => {
    const angle = (360 / (2 * Math.PI)) * state.angle;
    const random = Math.floor(Math.random() * list.length);
    const spinAngle = 360 * 3 + angle * random;
    setState((prevState) => ({
      ...prevState,
      rotate: prevState.rotate + spinAngle,
      easeOut: 2,
      spinning: true,
    }));
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        result: (prevState.result + random) % list.length,
        spinning: false,
      }));
      onCompleted((state.result + random) % list.length);
    }, 2000);
  };

  const reset = () => {
    // reset wheel and result
    setState((prevState) => ({
      ...prevState,
      rotate: 0,
      easeOut: 0,
      result: null,
      spinning: false,
    }));
  };

  const renderWheel = useCallback(() => {
    let numOptions = list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    setState((prevState) => ({
      ...prevState,
      angle: arcSize,
      result: Math.floor(Math.PI / 2 / arcSize),
    }));

    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      let text = list[i];
      renderSector(i + 1, text, angle, arcSize, getColor());
      angle += arcSize;
    }
  }, [renderSector, list]);

  useEffect(() => {
    renderWheel();
  }, [renderWheel]);

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
      {state.spinning ? (
        <button type="button" id="reset" onClick={reset}>
          reset
        </button>
      ) : (
        <button type="button" id="spin" onClick={spin}>
          spin
        </button>
      )}
    </div>
  );
}

export default Wheel;
