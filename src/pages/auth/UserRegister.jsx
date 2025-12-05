import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",  // 🔥 email → username
    password: "",
    name: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("보내는 데이터:", form); // 🔥 디버깅용

    try {
      await registerUser(form);

      alert("회원가입 완료!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "400px" }}>
      <h2>회원가입</h2>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>아이디(이메일)</label>
        <input
          type="email"
          name="username"   // 🔥 여기 중요
          value={form.username}
          onChange={onChange}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />

        <label>이름</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />

        <button type="submit" style={{ marginTop: "20px" }}>
          회원가입
        </button>
      </form>
    </div>
  );
}
