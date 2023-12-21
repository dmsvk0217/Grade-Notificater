import React, { useState } from "react";
import "./App.css";

function App() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [idError, setIdError] = useState("*이미 등록된 아이디 입니다.");
  const [accountError, setAccountError] = useState("*계정이 유효하지 않습니다");
  const [phoneError, setPhoneError] = useState("*이미 등록된 전화번호 입니다.");

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleCheckDuplicateId = () => {
    // 여기에 id 중복 체크 로직 추가
    // 예시: 중복이면 setIdError('아이디가 이미 사용 중입니다.');
    // 중복이 아니면 setIdError('');
  };

  const handleCheckAccountValidity = () => {
    // 여기에 id, pw 유효성 체크 로직 추가
    // 유효하지 않으면 setIdError('유효하지 않은 계정입니다.');
    // 유효하면 setIdError('');
  };

  const handleCheckDuplicatePhone = () => {
    // 여기에 전화번호 중복 체크 로직 추가
    // 중복이면 setPhoneError('전화번호가 이미 사용 중입니다.');
    // 중복이 아니면 setPhoneError('');
  };

  return (
    <div className="app-container">
      <form className="signup-form">
        <div className="input-container">
          <label htmlFor="id">히즈넷 아이디</label>
          <div className="input-row">
            <input
              type="text"
              id="id"
              value={id}
              placeholder="히즈넷 아이디"
              onChange={handleIdChange}
            />
            <button
              type="button"
              className="input-button"
              onClick={handleCheckDuplicateId}
            >
              중복확인
            </button>
          </div>
          {idError && <div className="error-message">{idError}</div>}
        </div>

        <div className="input-container">
          <label htmlFor="password">히즈넷 비밀번호</label>
          <div className="input-row">
            <input
              type="password"
              id="password"
              value={password}
              placeholder="히즈넷 비밀번호"
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="input-button"
              onClick={handleCheckAccountValidity}
            >
              유효성 확인
            </button>
          </div>
          {accountError && <div className="error-message">{accountError}</div>}
        </div>

        <div className="input-container">
          <label htmlFor="phone">알림받으실 전화번호</label>
          <div className="input-row">
            <input
              type="text"
              id="phone"
              value={phone}
              placeholder="-없이 표기"
              onChange={handlePhoneChange}
            />
            <button
              type="button"
              className="input-button"
              onClick={handleCheckDuplicatePhone}
            >
              중복확인
            </button>
          </div>
          {phoneError && <div className="error-message">{phoneError}</div>}
        </div>

        <button
          className="submit-button"
          type="submit"
          onClick={handleCheckDuplicatePhone}
        >
          등록하기
        </button>
      </form>
    </div>
  );
}

export default App;
