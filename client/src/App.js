import React, { useState } from "react";

import axios from "axios";
import Modal from "react-modal";
import msg from "./config/consts.js";

import { GiPartyPopper } from "react-icons/gi";
import { ContentDoneCheck } from "./common/ContentDoneCheck.js";
import { Loader } from "./common/Loader.js";
import "./App.css";

const serverURL = require("./config/config.js");

function App() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [idError, setIdError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [checkedID, setCheckedID] = useState(false);
  const [checkedAccount, setCheckedAccount] = useState(false);
  const [checkedPhone, setCheckedPhone] = useState(false);

  const [loadingId, setLoadingId] = useState(false);
  const [buttonContentId, setButtonContentId] = useState("중복확인");
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [buttonContentAccount, setButtonContentAccount] = useState("계정확인");
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [buttonContentPhone, setButtonContentPhone] = useState("중복확인");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [buttonContentSubmit, setButtonContentSubmit] = useState("등록하기");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.reload();
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
    setCheckedID(false);
    setCheckedAccount(false);
    setLoadingId(false);
    setButtonContentId("중복확인");
    setButtonContentAccount("계정확인");
    setLoadingAccount(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setCheckedAccount(false);
    setLoadingAccount(false);
    setButtonContentAccount("계정확인");
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setCheckedPhone(false);
    setLoadingPhone(false);
    setButtonContentPhone("중복확인");
  };

  async function handleCheckDuplicateId() {
    console.log("clicked id");
    setLoadingId(true);
    setButtonContentId(Loader);
    try {
      const response = await axios.post(`${serverURL}/api/idVaildCheck`, {
        id: id,
      });
      console.log("🚀 ~ file: App.js:35 ~ result ~ response:", response.data);
      const result = response.data.result;
      if (response.status === 200 && result === msg.IdVaild) {
        setIdError("");
        setCheckedID(true);
        setLoadingId(true);
        setButtonContentId(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msg.IdInvaild
      ) {
        setIdError(msg.ServIdDupError);
        setLoadingId(false);
        setButtonContentId("중복확인");
      } else {
        setIdError("*알 수 없는 서버오류 발생.");
        setLoadingId(false);
        console.error("Error fetching data:", error);
        setButtonContentId("중복확인");
      }
    }
  }

  const handleCheckAccountVaildation = async () => {
    console.log("clicked Account");
    if (id === "") {
      setAccountError("*아이디를 입력해주세요.");
      return;
    }
    if (password === "") {
      setAccountError("*비밀번호를 입력해주세요.");
      return;
    }
    setLoadingAccount(true);
    setButtonContentAccount(Loader);
    try {
      const response = await axios.post(`${serverURL}/api/AccountVaildCheck`, {
        id: id,
        pw: password,
      });
      const result = response.data.result;
      console.log(
        "🚀 ~ file: App.js:84 ~ handleCheckAccountVaildation ~ result:",
        result
      );
      if (response.status === 200 && result === msg.ServAccountVaild) {
        setAccountError("");
        setCheckedAccount(true);
        setLoadingAccount(true);
        setButtonContentAccount(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msg.ServAccountInvaild
      ) {
        setAccountError("*유효하지 않은 히즈넷 계정입니다.");
        setLoadingAccount(false);
        setButtonContentAccount("계정확인");
      } else {
        setAccountError("*알 수 없는 서버오류 발생.");
        console.error("Error fetching data:", error);
        setLoadingAccount(false);
        setButtonContentAccount("계정확인");
      }
    }
  };

  const handleCheckDuplicatePhone = async () => {
    console.log("clicked phone");

    const phonePattern = /^010\d{8}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError("올바른 형식을 입력해 주세요. (ex.01012341234)");
      return;
    }

    setLoadingPhone(true);
    setButtonContentPhone(Loader);

    try {
      const response = await axios.post(`${serverURL}/api/phoneVaildCheck`, {
        phone: phone,
      });
      const result = response.data.result;
      console.log(
        "🚀 ~ file: App.js:89 ~ handleCheckDuplicatePhone ~ result:",
        result
      );
      if (response.status === 200 && result === msg.ServPhoneVaild) {
        setPhoneError("");
        setCheckedPhone(true);
        setLoadingPhone(true);
        setButtonContentPhone(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msg.ServPhoneInvaild
      ) {
        setPhoneError(msg.PhoneDupError);
        setLoadingPhone(false);
        setButtonContentPhone("중복확인");
      } else {
        setPhoneError("*알 수 없는 서버오류 발생.");
        console.error("Error fetching data:", error);
        setLoadingPhone(false);
        setButtonContentPhone("중복확인");
      }
    }
  };

  const handleSubmit = async () => {
    if (!checkedID || !checkedAccount || !checkedPhone) {
      setSubmitError("*모든 항목이 확인되어야 합니다.");
      return;
    }
    setButtonContentSubmit(Loader);
    setLoadingSubmit(true);

    try {
      const response = await axios.post(`${serverURL}/api/submit`, {
        id: id,
        pw: password,
        phone: phone,
      });
      console.log("🚀 ~ file: App.js:181 ~ handleSubmit ~ response:", response);
      const result = response.data.result;
      console.log("🚀 ~ file: App.js:168 ~ handleSubmit ~ result:", result);
      if (response.status === 200 && result === msg.SubmitSuccess) {
        setSubmitError("");
        openModal();
        setLoadingSubmit(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msg.SubmitFail
      ) {
        setSubmitError(msg.PhoneDupError);
        setLoadingSubmit(false);
      } else {
        setSubmitError("*알 수 없는 서버오류 발생.");
        console.error("Error fetching data:", error);
        setLoadingSubmit(false);
      }
    }
  };

  const handleTest = async () => {
    console.log("handleTest");
    openModal();
  };

  return (
    <div className="app-container">
      <Modal
        className="modal"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "gray",
          },
        }}
      >
        <div className="done-row">
          <GiPartyPopper className="done-icon" size={25} />
          <div className="done-text-container">
            <p className="done-text">축하합니다.</p>
            <p className="done-text">등록이 완료되었습니다!</p>
          </div>
          <GiPartyPopper className="done-icon" size={25} />
        </div>
        <br />
        <button onClick={closeModal}>닫기</button>
      </Modal>
      <form className="signup-form">
        <h2 className="header-text">히즈넷 성적 알림 서비스</h2>
        <div className="content-text">
          - 히즈넷 학사정보 성적이 업데이트되면 등록하신 전화번호로 알림문자를
          보내드립니다.
        </div>
        <div className="content-text">
          - 입력된 정보는 성적알림 외의 용도로 사용되지 않습니다.
        </div>
        <br />
        <div className="input-container">
          <div className="input-container">
            {/* <label htmlFor="id">히즈넷 아이디</label> */}
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
                disabled={loadingId}
                onClick={handleCheckDuplicateId}
              >
                {buttonContentId}
              </button>
            </div>
            {idError && <div className="error-message">{idError}</div>}
          </div>

          <div className="input-container">
            {/* <label htmlFor="password">히즈넷 비밀번호</label> */}
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
                disabled={loadingAccount}
                onClick={handleCheckAccountVaildation}
              >
                {buttonContentAccount}
              </button>
            </div>
            {accountError && (
              <div className="error-message">{accountError}</div>
            )}
          </div>

          {/* <label htmlFor="phone">알림받으실 전화번호</label> */}
          <div className="input-row">
            <input
              type="text"
              id="phone"
              value={phone}
              placeholder="알림받을 전화번호(-없이표기)"
              onChange={handlePhoneChange}
            />
            <button
              type="button"
              className="input-button"
              disabled={loadingPhone}
              onClick={handleCheckDuplicatePhone}
            >
              {buttonContentPhone}
            </button>
          </div>
          {phoneError && <div className="error-message">{phoneError}</div>}
        </div>

        <button type="button" disabled={loadingSubmit} onClick={handleSubmit}>
          {buttonContentSubmit}
        </button>
        {submitError && <div className="error-message">{submitError}</div>}
        <br />
        <br />
        <button type="button" onClick={handleTest}>
          등록팝업
        </button>
      </form>
    </div>
  );
}

export default App;
