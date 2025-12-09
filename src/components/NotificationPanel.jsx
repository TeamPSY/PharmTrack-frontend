import React, { useEffect, useState } from "react";
import { getNotifications } from "../../api/notificationApi";

export default function NotificationPanel() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getNotifications().then((res) => {
      console.log("🔔 알림 데이터:", res.data);
      setList(res.data);
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        right: "20px",
        top: "20px",
        width: "280px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
        maxHeight: "500px",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>⚠ 재고 부족 / 만료 임박</h3>

      {list.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#777" }}>알림이 없습니다.</p>
      ) : (
        list.map((n) => (
          <div
            key={n.notifyId}
            style={{
              padding: "10px",
              marginBottom: "8px",
              border: "1px solid #eee",
              borderRadius: "6px",
              background: n.type === "LOW_STOCK" ? "#ffe6e6" : "#fff3cd",
            }}
          >
            <strong>{n.message}</strong>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              {n.type === "LOW_STOCK" ? "재고 부족" : "유통기한 임박"}
            </div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>
              {n.createdAt}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
