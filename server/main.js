const express = require("express");
const clientAPI = require("./client_api.js");
const cors = require("cors");
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

app.use(
  cors({
    origin: ["http://localhost:3000", "http://3.36.68.224:3000"],
  })
);
app.use(express.json());

app.post("/api/submit", async (req, res) => {
  printAPILog("submit");

  try {
    const id = req.body.id;
    const pw = req.body.pw;
    const phone = req.body.phone;
    let data = await clientAPI.crawlGradeArray(id, pw);

    console.log("🚀 ~ file: main.js:28 ~ app.post ~ data:", data);

    let result = await clientAPI.submit(id, pw, phone, data);
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
  printAPILog("AccountVaildCheck");
  try {
    const id = req.body.id;
    const pw = req.body.pw;
    let result = await clientAPI.acountVaildCheck(id, pw);
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
  printAPILog("phoneVaildCheck");
  try {
    const phone = req.body.phone;
    let result = await clientAPI.phoneVaildCheck(phone);
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
  printAPILog("idVaildCheck");
  try {
    const id = req.body.id;
    let result = await clientAPI.idVaildCheck(id);
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

function printAPILog(name) {
  console.log("[%s] %s", getTime(), name);
}

function getTime() {
  var today = new Date();

  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var timeString = hours + ":" + minutes + ":" + seconds;

  return timeString;
}
