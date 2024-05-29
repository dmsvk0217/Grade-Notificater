const firebasedb = require("../firebase/firebase.js");
const sendGradeUpdateMsg = require("./send.js");
const clientAPI = require("../client_api.js");
const util = require("../util.js");
const puppeteer = require("puppeteer");
const { urls, messages, xpaths, TIMEOUT_WAITFOR_NAV, TIME_INTERVAL_SEND } = require("../consts.js");

// setInterval(CheckSendRoutine, TIME_INTERVAL_SEND);
CheckSendRoutine();

async function CheckSendRoutine() {
  const fname = "[CheckSendRoutine] ";
  console.log(fname, util.getTime());

  let userDocs = await firebasedb.getAllUser();
  let count = 0;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (const userDoc of userDocs) {
    const user = userDoc.data();
    const id = user.id;
    const pw = user.pw;
    const phone = user.phone;
    const storedGradeArray = user.data;
    let updatedGradeArray = [...storedGradeArray];

    count++;
    console.log(util.getTime(), " count:", count, " id: ", id, " pw: ", pw);

    try {
      await page.goto(urls.login, {
        timeout: TIMEOUT_WAITFOR_NAV,
        waitUntil: "load",
      });

      console.log(fname, "enter ", urls.login);

      const idInput = await page.waitForSelector(xpaths.id);
      await idInput.type(id);
      const passwordInput = await page.waitForSelector(xpaths.password);
      await passwordInput.type(pw);

      await page.evaluate((xpath) => document.querySelector(xpath).click(), xpaths.login);
      await page.waitForNavigation({
        timeout: TIMEOUT_WAITFOR_NAV,
        waitUntil: "load",
      });

      await idInput.dispose();
      await passwordInput.dispose();

      if (page.url() === urls.login || page.url() === urls.loginFail) {
        console.log(fname, "login fail");
        continue;
      }

      await page.goto(urls.home, {
        timeout: TIMEOUT_WAITFOR_NAV,
        waitUntil: "load",
      });
      console.log(fname, "enter ", urls.home);

      let resultTable = await getResultTable(page);
      console.table(resultTable);
      console.log(clientAPI.tableToGradeArray(resultTable));

      for (let index = 1; index < resultTable.length; index++) {
        const row = resultTable[index];
        const element = row[row.length - 3];
        // if (element == true && storedGradeArray[index] == false) {
        const updatedSubject = row[2];
        updatedGradeArray[index] = true;
        console.log(id + updatedSubject + storedGradeArray[index] + element);
        // sendGradeUpdateMsg(updatedSubject, phone);
        // firebasedb.updateGradeArrayByUserdoc(userDoc, updatedGradeArray);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  }

  await page.close();
  await browser.close();
  process.exit();
}

async function getResultTable(page) {
  return await page.evaluate(() => {
    const table = document.getElementById("att_list");
    const rows = table.querySelectorAll("tr");

    // return Array.from(rows, (row) => {
    //   const cells = row.querySelectorAll("td, th");
    //   return Array.from(cells, (cell) => cell.innerText.trim());
    // });
    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells, (cell) => {
        const element = cell.innerText.trim();
        console.log(element);
        if (element == "미입력") return false;
        else return true;
      });
    });
  });
}
