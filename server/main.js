const express = require("express");
const clientAPI = require("./client_api.js");
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
} = require("./consts.js");
const app = express();
const port = 3000;

// 라우팅 설정
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
