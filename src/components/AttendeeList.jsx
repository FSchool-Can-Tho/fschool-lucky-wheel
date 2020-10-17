import React, { useState, useEffect } from "react";

function AttendeeList({ value, onChange }) {
  const [attendees, setAttendees] = useState();

  const handleAttendeeChange = (e) => {
    setAttendees(e.target.value);
    onChange(e.target.value.split("\n"));
  };

  useEffect(() => {
    setAttendees(value.join("\n"));
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
          value={attendees}
          onChange={handleAttendeeChange}
          placeholder="Nhập danh sách quay thưởng..."
          title="Danh sách quay thưởng"
        />
      </div>
    </div>
  );
}

export default AttendeeList;
