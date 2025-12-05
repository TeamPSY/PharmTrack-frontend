import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicineById, updateMedicine } from "../../api/medicineApi";
import { getCategoryList } from "../../api/categoryApi";

export default function MedicineEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    barcode: "",
    expirationDate: "",
    categoryId: "",
  });

  // ✔ 카테고리 목록 불러오기
  useEffect(() => {
    getCategoryList().then((res) => setCategories(res.data));
  }, []);

  // ✔ 기존 약품 정보 불러오기
  useEffect(() => {
    getMedicineById(id)
      .then((res) => {
        const data = res.data;
        const medicine = data.data || data;
        setForm({
          ...medicine,
          expirationDate: (medicine.expirationDate || "").substring(0, 10),
        });
      })
      .catch((err) => {
        console.error("데이터 불러오기 실패:", err);
        alert("약품 정보를 불러오지 못했습니다.");
      });
  }, [id]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicine(id, {
        ...form,
        categoryId: Number(form.categoryId),
      });

      alert("약품 수정 완료!");
      navigate("/medicine/list");
    } catch (err) {
      console.error(err);
      alert("수정 실패!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>약품 수정</h2>

      <form onSubmit={onSubmit}>
        
        {/* ✔ 카테고리 드롭다운 적용 */}
        <div>
          <label>카테고리</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>이름</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>제조사</label>
          <input
            name="manufacturer"
            value={form.manufacturer || ""}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={form.price || ""}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>재고</label>
          <input
            name="stock"
            type="number"
            value={form.stock || ""}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>바코드</label>
          <input
            name="barcode"
            value={form.barcode || ""}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>유통기한</label>
          <input
            name="expirationDate"
            type="date"
            value={form.expirationDate || ""}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit">수정하기</button>

        <button
          type="button"
          onClick={() => navigate("/medicine/list")}
          style={{ marginLeft: "10px" }}
        >
          취소
        </button>
      </form>
    </div>
  );
}
