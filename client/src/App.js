import React, { useState } from "react";
import axios from "axios";
import { CiCircleCheck } from "react-icons/ci";
import { GiPartyPopper } from "react-icons/gi";
import "./App.css";
import Modal from "react-modal";
import {
  msgIdInvaild,
  msgIdDupError,
  msgAccountInvaild,
  msgAccountVaild,
  msgPhoneDupError,
  msgIdVaild,
  msgPhoneVaild,
  msgPhoneInvaild,
  msgSubmitFail,
  msgSubmitSuccess,
} from "./consts.js";

const serverURL = require("./config.js");

const ContentDoneCheck = (
  <div className="checked-button">
    <p className="checked-text">확인됨</p>
    <CiCircleCheck className="checked-icon" />
  </div>
);

const Loader = (
  <svg
    width="13"
    className="spinner"
    height="13"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
      stroke="white"
    />
  </svg>
);

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

  const handleCheckDuplicateId = async () => {
    console.log("clicked id");
    setLoadingId(true);
    setButtonContentId(Loader);
    try {
      const response = await axios.post(`${serverURL}:4000/api/idVaildCheck`, {
        id: id,
      });
      console.log("🚀 ~ file: App.js:35 ~ result ~ response:", response.data);
      const result = response.data.result;
      if (response.status === 200 && result === msgIdVaild) {
        setIdError("");
        setCheckedID(true);
        setLoadingId(true);
        setButtonContentId(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msgIdInvaild
      ) {
        setIdError(msgIdDupError);
        setLoadingId(false);
        setButtonContentId("중복확인");
      } else {
        setIdError("*알 수 없는 서버오류 발생.");
        setLoadingId(false);
        console.error("Error fetching data:", error);
        setButtonContentId("중복확인");
      }
    }
  };

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
      const response = await axios.post(
        `${serverURL}:4000/api/AccountVaildCheck`,
        {
          id: id,
          pw: password,
        }
      );
      const result = response.data.result;
      console.log(
        "🚀 ~ file: App.js:84 ~ handleCheckAccountVaildation ~ result:",
        result
      );
      if (response.status === 200 && result === msgAccountVaild) {
        setAccountError("");
        setCheckedAccount(true);
        setLoadingAccount(true);
        setButtonContentAccount(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msgAccountInvaild
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
      const response = await axios.post(
        `${serverURL}:4000/api/phoneVaildCheck`,
        {
          phone: phone,
        }
      );
      const result = response.data.result;
      console.log(
        "🚀 ~ file: App.js:89 ~ handleCheckDuplicatePhone ~ result:",
        result
      );
      if (response.status === 200 && result === msgPhoneVaild) {
        setPhoneError("");
        setCheckedPhone(true);
        setLoadingPhone(true);
        setButtonContentPhone(ContentDoneCheck);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msgPhoneInvaild
      ) {
        setPhoneError(msgPhoneDupError);
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
      const response = await axios.post(`${serverURL}:4000/api/submit`, {
        id: id,
        pw: password,
        phone: phone,
      });
      console.log("🚀 ~ file: App.js:181 ~ handleSubmit ~ response:", response);
      const result = response.data.result;
      console.log("🚀 ~ file: App.js:168 ~ handleSubmit ~ result:", result);
      if (response.status === 200 && result === msgSubmitSuccess) {
        setSubmitError("");
        openModal();
        setLoadingSubmit(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === msgSubmitFail
      ) {
        setSubmitError(msgPhoneDupError);
        setLoadingSubmit(false);
      } else {
        setSubmitError("*알 수 없는 서버오류 발생.");
        console.error("Error fetching data:", error);
        setLoadingSubmit(false);
      }
    }
  };

  return (
    <div className="app-container">
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: "gray",
            },
            content: {
              paddingBottom: "0",
              color: "black",
              left: "20vw",
              right: "20vw",
              top: "40vh",
              bottom: "43vh",
            },
          }}
        >
          <div className="done-row">
            <GiPartyPopper className="done-icon" size={25} />
            <div className="done-texts">
              <p className="done-text">축하합니다. </p>
              <p className="done-text">등록이 완료되었습니다!</p>
            </div>
            <GiPartyPopper className="done-icon" size={25} />
          </div>
          <br />

          <button onClick={closeModal}>닫기</button>
        </Modal>
      </div>
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
      </form>
    </div>
  );
}

export default App;
