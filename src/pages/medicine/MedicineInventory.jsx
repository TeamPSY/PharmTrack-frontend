import { useState } from "react";
import { Search, Edit2, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { EditMedicineModal } from "./EditMedicineModal";
/* eslint-disable no-restricted-globals */


export function MedicineInventory({ medicines, onDelete, onUpdate, onSell }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingMedicine, setEditingMedicine] = useState(null);

  const categories = ["all", ...new Set(medicines.map((m) => m.category))];

  const filtered = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === "all" || m.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const isExpiringSoon = (date) => {
    const expiry = new Date(date);
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    return expiry <= threeMonths;
  };

  return (
    <div className="space-y-6">
      {/* 검색 + 카테고리 */}
      <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
            <input
              type="text"
              placeholder="약품명 또는 제조사 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "전체 카테고리" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50 border-b border-green-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-green-800">약품명</th>
                <th className="px-6 py-3 text-left text-sm text-green-800">카테고리</th>
                <th className="px-6 py-3 text-left text-sm text-green-800">재고</th>
                <th className="px-6 py-3 text-left text-sm text-green-800">가격</th>
                <th className="px-6 py-3 text-left text-sm text-green-800">유통기한</th>
                <th className="px-6 py-3 text-left text-sm text-green-800">제조사</th>
                <th className="px-6 py-3 text-right text-sm text-green-800">작업</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-green-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                      {m.name}

                      {m.quantity < 50 && (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}

                      {isExpiringSoon(m.expiryDate) && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                        {m.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          m.quantity < 50 ? "text-orange-600" : "text-gray-900"
                        }
                      >
                        {m.quantity}개
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-900">
                      {m.price.toLocaleString()}원
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          isExpiringSoon(m.expiryDate)
                            ? "text-red-600"
                            : "text-gray-900"
                        }
                      >
                        {new Date(m.expiryDate).toLocaleDateString("ko-KR")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{m.manufacturer}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* 판매 */}
                        <button
                          onClick={() => onSell(m)}
                          className="p-2 text-green-700 hover:bg-green-100 rounded-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>

                        {/* 수정 */}
                        <button
                          onClick={() => setEditingMedicine(m)}
                          className="p-2 text-gray-700 hover:bg-green-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* 삭제 */}
                        <button
                          onClick={() => {
                            if (confirm(`"${m.name}" 삭제하시겠습니까?`)) {
                              onDelete(m.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 요약 */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-green-700">검색 결과</p>
            <p className="text-green-900 mt-1">{filtered.length}종</p>
          </div>

          <div>
            <p className="text-sm text-green-700">총 재고</p>
            <p className="text-green-900 mt-1">
              {filtered.reduce((s, m) => s + m.quantity, 0)}개
            </p>
          </div>

          <div>
            <p className="text-sm text-green-700">총 가치</p>
            <p className="text-green-900 mt-1">
              {filtered
                .reduce((s, m) => s + m.quantity * m.price, 0)
                .toLocaleString()}
              원
            </p>
          </div>

          <div>
            <p className="text-sm text-green-700">재고 부족</p>
            <p className="text-green-900 mt-1">
              {filtered.filter((m) => m.quantity < 50).length}종
            </p>
          </div>
        </div>
      </div>

      {editingMedicine && (
        <EditMedicineModal
          medicine={editingMedicine}
          onClose={() => setEditingMedicine(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
