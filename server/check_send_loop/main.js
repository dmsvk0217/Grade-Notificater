const firebasedb = require("../firebase/firebase.js");
const sendGradeUpdateMsg = require("./send.js");
const clientAPI = require("../client_api.js");
const util = require("../util.js");
const puppeteer = require("puppeteer");
const { urls, messages, xpaths } = require("../consts.js");

const TIMEOUT_ACCOUNT_VALID = 1000;
const TIMEOUT_GET_TABLE = 1000;

const sendTimeInterval = 30 * 1000; // 30초
// setInterval(gradeNotification, sendTimeInterval);
gradeNotification();

async function gradeNotification() {
  const fname = "[gradeNotification] ";
  console.log(fname, util.getTime());

  let userDocs = await firebasedb.getAllUser();
  let count = 0;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (const userDoc of userDocs) {
    count++;

    const user = userDoc.data();
    const id = user.id;
    const pw = user.pw;
    const phone = user.phone;

    const storedGradeArray = user.data;
    let updatedGradeArray = [...storedGradeArray];

    try {
      console.log(util.getTime(), " count:", count, " id: ", id, " pw: ", pw);

      await page.goto(urls.login);
      console.log(fname, "enter ", urls.login);

      const idInput = await page.waitForSelector(xpaths.id);
      await idInput.type(id);
      const passwordInput = await page.waitForSelector(xpaths.password);
      await passwordInput.type(pw);

      await page.evaluate((xpath) => document.querySelector(xpath).click(), xpaths.login);

      // Todo: waitForNavigation과 setTimeout 성능비교
      // await new Promise((page) => setTimeout(page, TIMEOUT_GET_TABLE));
      await page.waitForNavigation({
        timeout: 50000,
        waitUntil: "load",
      });

      if (page.url() === urls.login || page.url() === urls.loginFail) {
        console.log(fname, "login fail");
        continue;
      }

      await page.goto(urls.home);

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
  console.log("browser.close()");
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
