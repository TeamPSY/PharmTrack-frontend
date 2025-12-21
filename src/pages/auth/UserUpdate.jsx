// src/pages/user/UserUpdate.jsx

import React, { useEffect, useState } from "react";
import { getLoginUser, updateUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";   // 🔥 추가

export default function UserUpdate() {
  const [userId, setUserId] = useState(null);

  const [user, setUser] = useState({
    username: "",
    name: "",
    phone: "",
    pharmacyName: "",
    password: "",
    role: ""
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();  // 🔥 추가

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getLoginUser();
      const id = res.data;

      if (!id) {
        setMessage("로그인이 필요합니다.");
        return;
      }

      setUserId(id);

      const detail = await fetch(`http://localhost:9090/api/auth/user/${id}`);
      const userInfo = await detail.json();

      setUser({
        username: userInfo.username ?? "",
        name: userInfo.name ?? "",
        phone: userInfo.phone ?? "",
        pharmacyName: userInfo.pharmacyName ?? "",
        password: "",
        role: userInfo.role ?? "USER"
      });

    } catch (err) {
      console.error(err);
      setMessage("유저 정보를 불러오지 못했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      setMessage("로그인 정보가 없습니다.");
      return;
    }

    try {
      const res = await updateUser(userId, user);

      if (res.data === "UPDATED") {
        setMessage("회원 정보가 성공적으로 수정되었습니다!");

        setTimeout(() => {
          navigate("/");     // 🔥 홈 화면으로 이동
        }, 1000); // 메시지가 잠깐 보이도록 1초 지연
      } else {
        setMessage("수정 실패. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>회원 정보 수정</h2>

      {message && (
        <p style={{ marginBottom: "15px", color: "green" }}>{message}</p>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>아이디</label>
        <input
          type="text"
          name="username"
          value={user.username}
          disabled
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>이름</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>전화번호</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>약국명</label>
        <input
          type="text"
          name="pharmacyName"
          value={user.pharmacyName}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>비밀번호 변경 (선택)</label>
        <input
          type="password"
          name="password"
          placeholder="변경 시에만 입력"
          value={user.password}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          fontSize: "16px",
          cursor: "pointer",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        저장하기
      </button>
    </div>
  );
}
