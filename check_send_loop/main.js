const firebasedb = require("../server/firebase.js");
const sendGradeUpdateMsg = require("../server/send.js");
const clientAPI = require("../server/client_api.js");
const puppeteer = require("puppeteer");
const {
  urlLogin,
  urlHome,
  msgLoginFail,
  idXPath,
  passwordXPath,
  loginXPath,
} = require("../server/consts.js");

const TIMEOUT_ACCOUNT_VALID = 1000;
const TIMEOUT_GET_TABLE = 1000;

// const sendTimeInterval = 60 * 60 * 1000;
const sendTimeInterval = 30 * 1000; // 30초

async function gradeNotofication() {
  console.log("[gradeNotofication] " + new Date().toLocaleString());

  // 모든 유저데이터 가져오기
  let userDocs = await firebasedb.getAllUser();
  var count = 0;

  console.log("new browser");
  const browser = await puppeteer.launch({
    headless: true,
    PUPPETEER_DISABLE_HEADLESS_WARNING: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--PUPPETEER_DISABLE_HEADLESS_WARNING",
    ],
  });

  console.log("newPage");
  const page = await browser.newPage();

  for (const userDoc of userDocs) {
    count++;
    const user = userDoc.data();
    const id = user.id;
    const pw = user.pw;
    const phone = user.phone;
    let resultTable = [];
    const storedGradeArray = user.data;
    let updatedGradeArray = [...storedGradeArray];

    try {
      console.log(
        "\n\n\n🚀 ~ file: main.js:43 ~ gradeNotofication ~ count:",
        count
      );
      console.log("🚀 ~ file: main.js:45 ~ gradeNotofication ~ id:", id);
      console.log("🚀 ~ file: main.js:47 ~ gradeNotofication ~ pw:", pw);

      console.log(
        phone,
        "goto(",
        "https://hisnet.handong.edu/login/login.php",
        ")"
      );
      await page.goto("https://hisnet.handong.edu/login/login.php");
      console.log("after goto urlLogin : ", page.url());

      // console.log(phone, "idXPath");
      const idInput = await page.waitForSelector(idXPath);
      console.log(phone, "typeid");
      await idInput.type(id);

      // console.log(phone, "passwordXPath");
      const passwordInput = await page.waitForSelector(passwordXPath);
      console.log(phone, "typepw");
      await passwordInput.type(pw);

      console.log(phone, "click");
      await page.evaluate(
        (loginXPath) => document.querySelector(loginXPath).click(),
        loginXPath
      );

      // await new Promise((page) => setTimeout(page, TIMEOUT_GET_TABLE));
      console.log("before waitForNavigation");
      await page.waitForNavigation({
        timeout: 60000,
        waitUntil: "load",
      });
      console.log("after waitForNavigation");
      // console.log(phone, "urlHome");
      console.log("before urlHome : ", page.url());
      if (page.url() === "https://hisnet.handong.edu/login/login.php") {
        console.log(
          "--------------------------------------[continue]--------------------------------------"
        );
      } else {
        await page.goto(urlHome);
        console.log("after urlHome : ", page.url());

        // Get table data
        console.log(phone, "Get table data");
        resultTable = await page.evaluate(() => {
          const table = document.getElementById("att_list");
          const rows = table.querySelectorAll("tr");

          return Array.from(rows, (row) => {
            const cells = row.querySelectorAll("td, th");
            return Array.from(cells, (cell) => cell.innerText.trim());
          });
        });
        // console.table(resultTable);

        console.log(
          count,
          "번째 유저 : ",
          id,
          " : ",
          clientAPI.tableToGradeArray(resultTable)
        );

        for (let index = 0; index < resultTable.length; index++) {
          const row = resultTable[index];

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
    } catch (error) {
      console.log(error);
    }
  }

  console.log("browser.close();");
  await browser.close();
}

// 1시간 마다 함수를 실행하기 위한 setInterval
// setInterval(gradeNotofication, sendTimeInterval);
gradeNotofication();
