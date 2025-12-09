// src/pages/inventory/InventoryList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🌟 useNavigate 추가
import { getMedicineList, updateMedicine } from "../../api/medicineApi";
import { useExpiringCount } from "../../hooks/useNotification"; // 🌟 useExpiringCount 훅 추가

export default function InventoryList() {
    const [list, setList] = useState([]);
    const [message, setMessage] = useState(null); // 성공·실패 메시지
    const navigate = useNavigate(); // 🌟 navigate 초기화
    
    // 🌟 유통기한 임박 약 개수 및 로딩 상태를 가져옵니다.
    const { expiringCount, loading } = useExpiringCount();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getMedicineList();
        setList(res.data);
    };

    // 재고 변경
    const changeStock = (id, value) => {
        setList((prev) =>
            prev.map((m) =>
                m.medicineId === id ? { ...m, stock: Number(value) } : m
            )
        );
    };

    // 서버 저장
    const saveStock = async (item) => {
        try {
            await updateMedicine(item.medicineId, item);
            setMessage("✅ 재고가 정상적으로 수정되었습니다!");
            setTimeout(() => setMessage(null), 2000);
            load();
        } catch (err) {
            console.error(err);
            setMessage("❌ 수정 실패! 값을 다시 확인하세요.");
            setTimeout(() => setMessage(null), 2000);
        }
    };

    // 🌟 유통기한 임박 페이지로 이동하는 핸들러
    const handleCheckExpiration = () => {
        navigate("/medicine/expiring-list");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>재고 관리</h2>

            {/* 🌟 유통기한 체크 버튼 및 알림 배지 */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={handleCheckExpiration}
                    style={{
                        padding: '10px 15px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: '#ffc107',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}
                >
                    유통기한 체크
                    {/* 알림 배지 (loading이 끝나고 count가 0보다 클 때만 표시) */}
                    {!loading && expiringCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '3px 7px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        >
                            {expiringCount}
                        </span>
                    )}
                </button>
            </div>
            {/* 🌟 End of button */}

            {/* 메시지 박스 */}
            {message && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        background: "#f6f6f6",
                    }}
                >
                    {message}
                </div>
            )}

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>약품명</th>
                        <th>재고</th>
                        <th>입고/출고</th>
                        <th>직접 입력</th>
                        <th>수정</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((m) => (
                        <tr key={m.medicineId}>
                            <td>{m.name}</td>

                            <td>{m.stock}</td>

                            <td>
                                <button onClick={() => changeStock(m.medicineId, m.stock + 1)}>
                                    +1
                                </button>
                                <button onClick={() => changeStock(m.medicineId, m.stock - 1)}>
                                    -1
                                </button>
                            </td>

                            <td>
                                <input
                                    type="number"
                                    value={m.stock}
                                    onChange={(e) =>
                                        changeStock(m.medicineId, e.target.value)
                                    }
                                    style={{ width: "80px" }}
                                />
                            </td>

                            <td>
                                <button onClick={() => saveStock(m)}>저장하기</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}