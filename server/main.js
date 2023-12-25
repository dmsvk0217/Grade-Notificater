const express = require("express");
const clientAPI = require("./client_api.js");
const firebasedb = require("./firebase.js");
const cors = require("cors");
const sendGradeUpdateMsg = require("./send.js");
const {
  msgAccountInvaild,
  msgAccountVaild,
  msgPhoneVaild,
  msgPhoneInvaild,
  msgServerError,
  msgIdVaild,
  msgIdInvaild,
  msgSubmitFail,
  msgSubmitSuccess,
} = require("./consts.js");

const app = express();
const port = 4000;
// const sendTimeInterval = 60 * 60 * 1000;
const sendTimeInterval = 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://ec2-43-200-184-150.ap-northeast-2.compute.amazonaws.com:3000",
    ],
  })
);
app.use(express.json());

// 라우팅 설정
app.post("/api/submit", async (req, res) => {
  try {
    const id = req.body.id;
    const pw = req.body.pw;
    const phone = req.body.phone;
    const data = await clientAPI.crawlGradeArray(id, pw);

    console.log("🚀 ~ file: main.js:28 ~ app.post ~ data:", data);

    const result = await clientAPI.submit(id, pw, phone, data);
    if (!result) {
      res.status(400).json({ error: msgSubmitFail });
    } else {
      res.json({ result: msgSubmitSuccess });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgServerError });
  }
});

app.post("/api/AccountVaildCheck", async (req, res) => {
  try {
    const id = req.body.id;
    const pw = req.body.pw;
    const result = await clientAPI.acountVaildCheck(id, pw);
    if (!result) {
      // false -> 로그인 실패
      res.status(400).json({ error: msgAccountInvaild });
    } else {
      // true -> 로그인 성공
      res.json({ result: msgAccountVaild });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: msgServerError });
  }
});

app.post("/api/phoneVaildCheck", async (req, res) => {
  try {
    const phone = req.body.phone;
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

app.post("/api/idVaildCheck", async (req, res) => {
  try {
    const id = req.body.id;
    console.log("🚀 ~ file: main.js:94 ~ app.post ~ id:", id);

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
  const userDocs = await firebasedb.getAllUser();
  // console.log("🚀 ~ file: main.js:112 ~ gradeNotofication ~ uesrs:", uesrs);

  console.log("[gradeNotofication] " + new Date().toLocaleString());

  // for문돌면서
  for (const userDoc of userDocs) {
    const user = userDoc.data();
    const id = user.id;
    const pw = user.pw;
    const phone = user.phone;
    let tableCur = [];
    const storedGradeArray = user.data;
    let updatedGradeArray = [...storedGradeArray];

    try {
      tableCur = await clientAPI.crawlTable(id, pw);
    } catch (error) {
      console.log(error);
    }

    console.log("🚀 ", id, " : ", clientAPI.tableToGradeArray(tableCur));

    for (let index = 0; index < tableCur.length; index++) {
      const row = tableCur[index];

      if (index !== 0 && row[row.length - 3] !== storedGradeArray[index]) {
        // '성적' 제외 && 성적이 업데이트 되었을 시 과목명 저장
        const updatedSubject = row[2];
        updatedGradeArray[index] = row[row.length - 3];
        console.log(
          id +
            "님의 " +
            updatedSubject +
            "의 성적이 " +
            storedGradeArray[index] +
            "에서" +
            row[row.length - 3] +
            "으로 업데이트 되었습니다."
        );
        sendGradeUpdateMsg(updatedSubject, phone);
        firebasedb.updateGradeArrayByUserdoc(userDoc, updatedGradeArray);
      }
    }
  }
}

// 1시간 마다 함수를 실행하기 위한 setInterval
setInterval(gradeNotofication, sendTimeInterval);
