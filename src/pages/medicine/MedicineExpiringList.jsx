// src/pages/inventory/medicine/MedicineExpiringList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getExpiringSoon } from '../../api/medicineApi';
import MedicineTable from './MedicineTable';
import './MedicineList.css';

const MedicineExpiringList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    // useCallback으로 fetch 함수 메모이제이션
    const fetchExpiringSoonList = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getExpiringSoon();
            setMedicines(response.data);
        } catch (error) {
            console.error("유통기한 임박 약 목록을 불러오는 데 실패했습니다:", error);
            setMedicines([]); // 오류 발생 시 목록 초기화
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpiringSoonList();
    }, [fetchExpiringSoonList]);

    // MedicineTable에서 상태 변경/삭제 후 목록 새로고침 핸들러
    const handleUpdate = () => {
        fetchExpiringSoonList();
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="medicine-list-container">
            <h2>🚨 유통기한 임박 약품 목록 ({medicines.length}개)</h2>
            <p>7일 이내 만료 예정이거나 이미 만료된 약품입니다.</p>

            {medicines.length === 0 ? (
                <div className="no-data">현재 유통기한 임박 약품이 없습니다.</div>
            ) : (
                <MedicineTable list={medicines} />
            )}
        </div>
    );
};

export default MedicineExpiringList;
