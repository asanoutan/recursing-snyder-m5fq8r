import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// AG Grid にモジュールを登録
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// 1か月分の日付を生成し、罫線・文字色を設定
const getMonthDays = (year, month) => {
  const days = [];
  const lastDay = new Date(year, month, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    days.push({
      field: `day${i}`,
      headerName: `${i}日`,
      editable: true, // 編集可能にする
      cellEditor: "agSelectCellEditor", // ドロップダウンエディターを使用
      cellEditorParams: {
        values: ["出社", "在宅"], // 選択肢
      },
      cellStyle: (params) => {
        const value = params.value;
        let color = "black"; // デフォルトの文字色

        // 条件に応じて文字色を変更
        if (value === "出社") {
          color = "blue";
        } else if (value === "在宅") {
          color = "green";
        } else {
          color = "gray"; // 未入力の場合
        }

        // 罫線の適用
        return parseInt(params.column.colId.replace("day", ""), 10) % 2 === 1
          ? {
              borderRight: "0.5px solid black",
              color: color,
              textAlign: "center",
            }
          : { color: color, textAlign: "center" };
      },
    });
  }
  return days;
};

// 名前列の色を設定する関数
const getNameCellStyle = (params) => {
  const name = params.value;
  let color = "black"; // デフォルト

  if (name === "田中") {
    color = "black";
  } else if (name === "佐藤") {
    color = "black";
  } else if (name === "鈴木") {
    color = "black";
  }

  return { color: color, fontWeight: "bold", textAlign: "center" };
};

const CalendarGrid = () => {
  const year = 2025;
  const month = 3; // 3月
  const [rowData, setRowData] = useState([
    {
      name: "田中",
      ...Array(31)
        .fill("")
        .reduce((acc, _, i) => ({ ...acc, [`day${i + 1}`]: "" }), {}),
    },
    {
      name: "佐藤",
      ...Array(31)
        .fill("")
        .reduce((acc, _, i) => ({ ...acc, [`day${i + 1}`]: "" }), {}),
    },
    {
      name: "鈴木",
      ...Array(31)
        .fill("")
        .reduce((acc, _, i) => ({ ...acc, [`day${i + 1}`]: "" }), {}),
    },
  ]);

  // 列定義（左端に名前、残りに日付）
  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "名前",
        pinned: "left",
        editable: false,
        width: 100,
        cellStyle: getNameCellStyle,
      },
      ...getMonthDays(year, month),
    ],
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, width: 60 }}
        suppressClickEdit={false} // クリックで編集モードに入る
      />
    </div>
  );
};

export default CalendarGrid;
