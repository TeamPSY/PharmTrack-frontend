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

  // ✅ 카테고리 목록
  useEffect(() => {
    getCategoryList()
      .then((res) => setCategories(res.data))
      .catch(() => alert("카테고리 로드 실패"));
  }, []);

  // ✅ 약품 정보
  useEffect(() => {
    getMedicineById(id)
      .then((res) => {
        const data = res.data.data || res.data;
        setForm({
          ...data,
          expirationDate: (data.expirationDate || "").substring(0, 10),
        });
      })
      .catch(() => alert("약품 정보를 불러오지 못했습니다."));
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
    } catch {
      alert("수정 실패!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>약품 수정</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>카테고리</label>
          <select
            name="categoryId"
            value={form.categoryId || ""}
            onChange={onChange}
            required
          >
            <option value="">선택</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>이름</label>
          <input name="name" value={form.name || ""} onChange={onChange} />
        </div>

        <div>
          <label>제조사</label>
          <input
            name="manufacturer"
            value={form.manufacturer || ""}
            onChange={onChange}
          />
        </div>

        <div>
          <label>가격</label>
          <input
            type="number"
            name="price"
            value={form.price || ""}
            onChange={onChange}
          />
        </div>

        <div>
          <label>재고</label>
          <input
            type="number"
            name="stock"
            value={form.stock || ""}
            onChange={onChange}
          />
        </div>

        <div>
          <label>바코드</label>
          <input
            name="barcode"
            value={form.barcode || ""}
            onChange={onChange}
          />
        </div>

        <div>
          <label>유통기한</label>
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate || ""}
            onChange={onChange}
          />
        </div>

        <button type="submit">수정하기</button>
        <button
          type="button"
          onClick={() => navigate("/medicine/list")}
          style={{ marginLeft: 10 }}
        >
          취소
        </button>
      </form>
    </div>
  );
}
