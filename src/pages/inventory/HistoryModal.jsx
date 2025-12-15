import React, { useEffect, useState } from "react";
import { getHistoryByMedicine } from "../../api/historyApi";

export default function HistoryModal({ medicineId, onClose }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!medicineId) return;

    getHistoryByMedicine(medicineId)
      .then((res) => setList(res.data))
      .catch((e) => {
        console.error("재고 이력 조회 실패", e);
        setList([]);
      });
  }, [medicineId]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "600px",
          borderRadius: "8px"
        }}
      >
        <h3>변경 이력</h3>

        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>날짜</th>
              <th>유형</th>
              <th>수량</th>
              <th>전</th>
              <th>후</th>
              <th>사유</th>
            </tr>
          </thead>
          <tbody>
  {list.length === 0 ? (
    <tr>
      <td colSpan="6">이력이 없습니다.</td>
    </tr>
  ) : (
    list.map(h => (
      <tr key={h.historyId}>
        <td>{h.createdAt}</td>
        <td>{h.changeType}</td>
        <td>{h.amount}</td>
        <td>{h.beforeStock}</td>
        <td>{h.afterStock}</td>
        <td>{h.reason}</td>
      </tr>
    ))
  )}
</tbody>


        </table>

        <button onClick={onClose} style={{ marginTop: "10px" }}>
          닫기
        </button>
      </div>
    </div>
  );
}
