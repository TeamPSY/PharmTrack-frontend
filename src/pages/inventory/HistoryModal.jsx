import React, { useEffect, useState } from "react";
import { getHistoryByMedicine } from "../../api/historyApi";
import "../../styles/HistoryModal.css";

export default function HistoryModal({ medicineId, onClose }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!medicineId) return;

    getHistoryByMedicine(medicineId)
      .then((res) => setList(res.data || []))
      .catch((e) => {
        console.error("재고 이력 조회 실패", e);
        setList([]);
      });
  }, [medicineId]);

  return (
    <div className="history-overlay" onClick={onClose}>
      <div
        className="history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="history-title">변경 이력</h3>

        <table className="history-table">
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
                <td colSpan="6" className="history-empty">
                  이력이 없습니다.
                </td>
              </tr>
            ) : (
              list.map((h) => (
                <tr key={h.historyId}>
                  <td>{h.createdAt}</td>
                  <td
                    className={
                      h.changeType === "IN"
                        ? "history-in"
                        : "history-out"
                    }
                  >
                    {h.changeType}
                  </td>
                  <td>{h.amount}</td>
                  <td>{h.beforeStock}</td>
                  <td>{h.afterStock}</td>
                  <td>{h.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="history-footer">
          <button className="btn-close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
