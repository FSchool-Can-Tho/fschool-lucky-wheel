import React, { useState, useEffect } from "react";
import "../styles/attendee-list.css";

function AttendeeList({ value, onChange }) {
  const [text, setText] = useState();

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value.split("\n"));
  };

  // const handleSubmit = () => {
  //   onChange(text.split("\n"));
  // };

  useEffect(() => {
    setText(value.join("\n"));
  }, [value]);

  return (
    <div
      style={{
        width: 320,
        minWidth: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ marginBottom: 6 }}>
        <strong>Danh sách quay thưởng</strong>
      </h3>
      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "6px 0px",
        }}
      >
        <small>Mỗi mục trên một dòng.</small>
        <small>Đã nhập: {value.length}</small>
      </p>
      <div
        style={{
          flexGrow: 1,
          borderRadius: "12px",
          overflow: "hidden",
          width: "100%",
          paddingRight: 12,
          position: "relative",
        }}
      >
        <textarea
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFFFF99",
            border: "none",
            padding: "6px",
            lineHeight: 1.5,
            fontSize: 18,
            overflow: "scroll",
          }}
          value={text}
          onChange={handleTextChange}
          placeholder="Nhập danh sách quay thưởng..."
          title="Danh sách quay thưởng"
        />
        {/* <button
          onClick={handleSubmit}
          className="apply-btn"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            fontSize: "14px",
            padding: "6px 24px",
            outline: "none",
            fontWeight: "bold",
            borderTopLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            border: "solid 1px white",
          }}
        >
          {"Áp dụng >"}
        </button> */}
      </div>
    </div>
  );
}

export default AttendeeList;
