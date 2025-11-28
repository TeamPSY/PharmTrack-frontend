import { useNavigate } from 'react-router-dom';

export default function MedicineMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/medicine/add")}>약품 등록 이동</button>
      <button onClick={() => navigate("/medicine/edit")}>약품 수정 이동</button>
      <button onClick={() => navigate("/medicine/delete")}>약품 삭제 이동</button>
      <button onClick={() => navigate("/medicine/list")}>약품 목록 조회 이동</button>
    </div>
  );
}
