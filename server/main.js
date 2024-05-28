const express = require("express");
const clientAPI = require("./client_api.js");
const util = require("./util.js");
const cors = require("cors");
const { messages } = require("./consts.js");

const app = express();
const port = 4000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://3.36.68.224:3000"],
  })
);
app.use(express.json());

app.post("/api/submit", async (req, res) => {
  util.printAPILog("submit");

  try {
    const id = req.body.id;
    const pw = req.body.pw;
    const phone = req.body.phone;
    let data = await clientAPI.crawlGradeArray(id, pw);

    let result = await clientAPI.submit(id, pw, phone, data);
    if (!result) {
      res.status(400).json({ error: messages.submitFail });
    } else {
      res.json({ result: messages.submitSuccess });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: messages.serverError });
  }
});

app.post("/api/AccountVaildCheck", async (req, res) => {
  util.printAPILog("AccountVaildCheck");
  try {
    const id = req.body.id;
    const pw = req.body.pw;
    let result = await clientAPI.acountVaildCheck(id, pw);
    if (!result) {
      // false -> 로그인 실패
      res.status(400).json({ error: messages.accountInvalid });
    } else {
      // true -> 로그인 성공
      res.json({ result: messages.accountValid });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: messages.serverError });
  }
});

app.post("/api/phoneVaildCheck", async (req, res) => {
  util.printAPILog("phoneVaildCheck");
  try {
    const phone = req.body.phone;
    let result = await clientAPI.phoneVaildCheck(phone);
    if (result) {
      console.log(`전화번호 ${phone}는 중복됩니다.`);
      res.status(400).json({ error: messages.phoneInvalid });
    } else {
      console.log(`전화번호 ${phone}는 중복되지 않습니다.`);
      res.json({ result: messages.accountValid });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: messages.phoneInvalid });
  }
});

app.post("/api/idVaildCheck", async (req, res) => {
  util.printAPILog("idVaildCheck");
  try {
    const id = req.body.id;
    let result = await clientAPI.idVaildCheck(id);
    if (result) {
      console.log(`아이디 ${id}는 중복됩니다.`);
      res.status(400).json({ error: messages.idInvalid });
    } else {
      console.log(`아이디 ${id}는 중복되지 않습니다.`);
      res.json({ result: messages.idValid });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: messages.idInvalid });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
