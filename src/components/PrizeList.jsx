import React from "react";

function PrizeList({ value, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({
      ...value,
      [field]: e.target.value,
    });
  };

  return (
    <div
      style={{
        width: 300,
        color: "white",
      }}
    >
      <h3 style={{ marginBottom: 6 }}>
        <strong>Cơ cấu giải thưởng</strong>
      </h3>
      <p style={{ margin: "6px 0px" }}>
        <small>Tùy chỉnh giải thưởng và số lượng giải.</small>
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <input
          value={value.name}
          onChange={handleChange("name")}
          placeholder="Tên giải thưởng"
          title="Tên giải thưởng"
          style={{
            width: "100%",
            flexGrow: 1,
            padding: 6,
            borderRadius: 8,
            backgroundColor: "lightgrey",
            border: "1px solid grey",
            fontSize: 18,
          }}
        />
        <input
          value={value.count}
          onChange={handleChange("count")}
          placeholder="Số lượng"
          title="Số lượng giải"
          type="number"
          style={{
            width: 52,
            padding: 6,
            borderRadius: 8,
            backgroundColor: "lightgrey",
            border: "1px solid grey",
            fontSize: 18,
          }}
        />
      </div>
    </div>
  );
}

export default PrizeList;
