// src/hooks/useNotification.js

import { useState, useEffect } from 'react';
// 2단계에서 추가한 API 함수를 가져옵니다.
import { getExpiringSoon } from '../api/medicineApi'; 

// 데이터 업데이트 주기 (5분 = 300,000ms)
const POLLING_INTERVAL = 300000; 

/**
 * 유통기한 임박 약의 개수를 주기적으로 확인하고 반환하는 Custom Hook
 * @returns {{expiringCount: number, loading: boolean}} 임박 약 개수 및 로딩 상태
 */
export const useExpiringCount = () => {
    // 유통기한 임박 약의 개수를 저장할 상태
    const [expiringCount, setExpiringCount] = useState(0); 
    // 데이터 로딩 상태
    const [loading, setLoading] = useState(true); 

    /**
     * API를 호출하여 임박 약 개수를 체크하는 비동기 함수
     */
    const checkCount = async () => {
        try {
            // API 호출
            const response = await getExpiringSoon();
            const expiringMedicines = response.data; // 약 목록 데이터 (배열)

            // 목록의 길이(개수)로 상태 업데이트
            setExpiringCount(expiringMedicines.length); 
            setLoading(false);
        } catch (error) {
            console.error("유통기한 임박 약 정보를 가져오는 데 실패했습니다:", error);
            setExpiringCount(0); // 오류 발생 시 개수를 0으로 초기화
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 및 주기적 폴링 로직
    useEffect(() => {
        // 1. 컴포넌트가 로드될 때 즉시 한 번 실행
        checkCount();

        // 2. POLLING_INTERVAL 간격으로 checkCount 함수 반복 실행
        const intervalId = setInterval(checkCount, POLLING_INTERVAL);

        // 3. 컴포넌트 언마운트 시(정리 작업) 인터벌 해제
        return () => clearInterval(intervalId);
    }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행됨을 의미합니다.

    return { expiringCount, loading };
};