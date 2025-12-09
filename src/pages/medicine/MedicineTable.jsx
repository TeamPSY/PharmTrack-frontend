import React from "react";
import { useNavigate } from "react-router-dom";

// 🌟 list={list} 대신 list={list = []}를 사용하여, list가 undefined일 때 빈 배열로 초기화합니다.
// 또한, 이전 대화에서 MedicineExpiringList에서 props 이름은 medicines가 아닌 list를 사용했으므로,
// props 이름을 list로 유지합니다.
export default function MedicineTable({ list = [] }) { 
    
    // 이전에 onUpdate prop도 있었으나, 제공해주신 코드에는 없으므로 제거하고 list만 처리합니다.
    
    const navigate = useNavigate();

    return (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>제조사</th>
                    <th>가격</th>
                    <th>재고</th>
                    <th>바코드</th>
                    <th>수정</th>
                </tr>
            </thead>

            <tbody>
                {/* list가 빈 배열([])로 보장되므로, map 호출은 안전합니다. */}
                {list.map((m) => (
                    <tr key={m.medicineId}>
                        <td>{m.medicineId}</td>
                        <td>{m.name}</td>
                        <td>{m.manufacturer}</td>
                        <td>{m.price}</td>
                        <td>{m.stock}</td>
                        <td>{m.barcode}</td>
                        <td>
                            <button onClick={() => navigate(`/medicines/edit/${m.medicineId}`)}>
                                수정
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}