const express = require("express");
const clientAPI = require("./client_api.js");
const firebasedb = require("./firebase.js");
const sendGradeUpdateMsg = require("./send.js");
const {
  id,
  pw,
  phone,
  msgLoginFail,
  msgLoginsuccess,
  msgPhoneVaild,
  msgPhoneInvaild,
  msgServerError,
  msgIdVaild,
  msgIdInvaild,
  msgSubmitFail,
  msgSubmitSuccess,
} = require("./consts.js");
const app = express();
const port = 3000;

// 라우팅 설정
app.get("/submit", async (req, res) => {
  try {
    const data = await clientAPI.crawlGradeArray(id, pw);
    if (data === msgLoginFail) {
      res.status(400).json({ error: msgLoginFail });
    } else {
      console.log("🚀 ~ file: main.js:28 ~ app.get ~ data:", data);

      const result = await clientAPI.submit(id, pw, phone, data);
      if (!result) {
        res.status(400).json({ error: msgSubmitFail });
      } else {
        res.json({ data: msgSubmitSuccess });
      }
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgServerError });
  }
});

app.get("/crawlTable", async (req, res) => {
  try {
    const data = await clientAPI.crawlTable(id, pw);
    if (data === msgLoginFail) {
      res.status(400).json({ error: msgLoginFail });
    } else {
      res.json({ data: data });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgServerError });
  }
});

app.get("/loginVaildCheck", async (req, res) => {
  try {
    const result = await clientAPI.loginVaildCheck(id, pw);
    if (result) {
      res.status(400).json({ error: msgLoginFail });
    } else {
      res.json({ result: msgLoginsuccess });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgServerError });
  }
});

app.get("/phoneVaildCheck", async (req, res) => {
  try {
    const result = await clientAPI.phoneVaildCheck(phone);
    if (result) {
      console.log(`전화번호 ${phone}는 중복됩니다.`);
      res.status(400).json({ error: msgPhoneInvaild });
    } else {
      console.log(`전화번호 ${phone}는 중복되지 않습니다.`);
      res.json({ result: msgPhoneVaild });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgPhoneVaild });
  }
});

app.get("/idVaildCheck", async (req, res) => {
  try {
    const result = await clientAPI.idVaildCheck(id);
    if (result) {
      console.log(`아이디 ${id}는 중복됩니다.`);
      res.status(400).json({ error: msgIdInvaild });
    } else {
      console.log(`아이디 ${id}는 중복되지 않습니다.`);
      res.json({ result: msgIdVaild });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgIdVaild });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 5초마다 실행될 함수
async function gradeNotofication() {
  // 모든 유저데이터 가져오기
  const uesrs = await firebasedb.getAllUser();
  // console.log("🚀 ~ file: main.js:112 ~ gradeNotofication ~ uesrs:", uesrs);

  // for문돌면서
  uesrs.forEach(async (user) => {
    const id = user.id;
    const pw = user.pw;
    const tableCur = await clientAPI.crawlTable(id, pw);
    const storedGradeArray = user.data;

    tableCur.forEach((row, index) => {
      if (index !== 0 && row[row.length - 3] !== storedGradeArray[index]) {
        // '성적' 제외 && 성적이 업데이트 되었을 시 과목명 저장
        const updatedSubject = row[2];
        console.log(
          id + "님의 " + updatedSubject + "의 성적이 업데이트 되었습니다."
        );
        sendGradeUpdateMsg(updatedSubject, phone);
      }
    });
  });
}

// 1분 함수를 실행하기 위한 setInterval
setInterval(gradeNotofication, 5000);
