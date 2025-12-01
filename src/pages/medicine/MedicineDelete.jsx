import React, { useEffect, useState } from "react";
import { getMedicineList, deleteMedicine } from "../../api/medicineApi"; // ← API 연결

const MedicineDelete = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getMedicineList();
    setMedicines(result.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteMedicine(id);
      alert("삭제 완료");
      loadData(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>약품 삭제</h2>

      {medicines.length === 0 ? (
        <p>등록된 약품이 없습니다.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>약품명</th>
              <th>제조사</th>
              <th>재고</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((item) => (
              <tr key={item.medicineId}>
                <td>{item.medicineId}</td>
                <td>{item.name}</td>
                <td>{item.manufacturer}</td>
                <td>{item.stock}</td>
                <td>
                  <button
                    style={{ background: "red", color: "white" }}
                    onClick={() => handleDelete(item.medicineId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicineDelete;