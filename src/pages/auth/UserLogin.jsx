import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);

      console.log("로그인 응답:", res?.data); // <- 꼭 확인하세요

      // 응답 구조 보호적으로 파싱 (res.data.user OR res.data)
      const user = res?.data?.user ?? res?.data ?? null;

      if (!user) {
        alert("로그인 실패! (서버 응답 없음)");
        return;
      }

      // 전체 user 객체를 저장 (나중에 이름, 역할 등 사용 가능)
      localStorage.setItem("user", JSON.stringify(res.data));
      // id만 따로 쓸거면 user.userId 혹은 user.id로 읽으면 됨
      localStorage.setItem("userId", user.userId ?? user.id ?? "");

      alert("로그인 성공!");
      navigate("/"); // 홈으로
    } catch (err) {
      console.error("로그인 중 에러:", err);
      alert("로그인 실패");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
