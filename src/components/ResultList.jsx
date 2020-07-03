import React from "react";
import "../styles/result-list.css";

const colors = [
  {
    color: "deeppink",
    backgroundColor: "lightpink",
  },
  {
    color: "darkorange",
    backgroundColor: "lightyellow",
  },
  {
    color: "dodgerblue",
    backgroundColor: "lightblue",
  },
  {
    color: "teal",
    backgroundColor: "lightcyan",
  },
];

function ResultList({ data = [], onChange }) {
  const handleDownload = () => {
    if (data.length === 0) return;
    const text = data
      .map(({ id, prize }, index) => `${index + 1},${prize},${id},`)
      .join("\n");
    const link = document.createElement("a");
    link.download = "ketqua.csv";
    const blob = new Blob([text], { type: "text/plain" });
    link.href = window.URL.createObjectURL(blob);
    link.click();
  };

  const handleClearAll = () => {
    const confirm = window.confirm(
      "Tất cả kết quả sẽ bị xóa sạch. Bạn chắc chứ?"
    );
    if (confirm) onChange([]);
  };

  const prizeSet = new Set(data.map(({ prize }) => prize));
  const prizeList = Array.from(prizeSet);

  return (
    <div
      style={{
        width: 300,
        minWidth: 300,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ marginBottom: 6 }}>
        <strong>Kết quả quay thưởng</strong>
      </h3>
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            overflowY: "scroll",
            backgroundColor: "#FFFFFF99",
            flexGrow: 1,
            height: 0,
            minHeight: "100%",
          }}
        >
          {data.map(({ id, prize }, index) => (
            <div
              key={`${id}${index}`}
              style={{
                color: "black",
                fontSize: 18,
                margin: "8px 0px",
                backgroundColor:
                  colors[prizeList.indexOf(prize) % colors.length]
                    .backgroundColor,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 14,
                  padding: "3px 12px",
                  backgroundColor:
                    colors[prizeList.indexOf(prize) % colors.length].color,
                  borderRadius: "0px 12px 12px 0px",
                }}
              >
                {prize}
              </span>
              <span
                style={{
                  padding: "3px 6px",
                  overflowWrap: 'break-word'
                }}
              >
                {id}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          margin: "6px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button onClick={handleDownload} className="btn-download">
          <strong>(&#8681;) Tải xuống</strong>
        </button>
        <button onClick={handleClearAll} className="btn-clearall">
          <strong>(&#10539;) Xóa hết</strong>
        </button>
      </div>
    </div>
  );
}

export default ResultList;
