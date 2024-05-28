const puppeteer = require("puppeteer");
const firebasedb = require("./firebase/firebase.js");
const {
  urlLogin,
  urlLoginFail,
  urlHome,
  msgLoginFail,
  idXPath,
  passwordXPath,
  loginXPath,
} = require("./consts.js");

const TIMEOUT_ACCOUNT_VALID = 1000;
const TIMEOUT_GET_TABLE = 1000;

exports.crawlTable = async (id, pw) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(urlLogin);
  console.log("[crawlTable] enter ", urlLogin);

  const idInput = await page.waitForSelector(idXPath);
  await idInput.type(id);
  const passwordInput = await page.waitForSelector(passwordXPath);
  await passwordInput.type(pw);

  await page.evaluate((loginXPath) => document.querySelector(loginXPath).click(), loginXPath);

  // await new Promise((page) => setTimeout(page, TIMEOUT_GET_TABLE));
  await page.waitForNavigation({
    timeout: 50000,
    waitUntil: "load",
  });

  if (page.url() === urlLogin || page.url() === urlLoginFail) {
    console.log("[crawlTable] login fail");
    return msgLoginFail;
  }

  await page.goto(urlHome);
  console.log("[crawlTable] enter ", page.url());

  let result = await page.evaluate(() => {
    const table = document.getElementById("att_list");
    const rows = table.querySelectorAll("tr");

    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells, (cell, index) => {
        const element = cell.innerText.trim();
        console.log(`Index ${index}: ${element}`);
        if (element === "미입력") return false;
        else return true;
      });
    });
  });

  console.table("[crawlTable] result");
  console.table(result);
  console.log("[crawlTable] browser close");

  await browser.close();
  return result;
};

exports.tableToGradeArray = (table) => table.map((row) => row[row.length - 3]);

exports.crawlGradeArray = async (id, pw) => {
  const table = await this.crawlTable(id, pw);
  return this.tableToGradeArray(table);
};

exports.acountVaildCheck = async (id, pw) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(urlLogin);

  const idInput = await page.waitForSelector(idXPath);
  await idInput.type(id);
  const passwordInput = await page.waitForSelector(passwordXPath);
  await passwordInput.type(pw);

  await page.evaluate((loginXPath) => document.querySelector(loginXPath).click(), loginXPath);

  await new Promise((page) => setTimeout(page, TIMEOUT_ACCOUNT_VALID));

  console.log(page.url());
  if (page.url() === urlLoginFail) {
    return false;
  }

  return true;
};

exports.idVaildCheck = async (id) => {
  try {
    return await firebasedb.checkDuplicateID(id);
  } catch (error) {
    console.error("idVaildCheck error:", error);
  }
};

exports.phoneVaildCheck = async (phone) => {
  try {
    return await firebasedb.checkDuplicatePhone(phone);
  } catch (error) {
    console.error("phoneVaildCheck error:", error);
  }
};

exports.submit = async (id, pw, phone, data) => {
  try {
    return await firebasedb.addUser(id, pw, phone, data);
  } catch (error) {
    console.error("submit error:", error);
    return false;
  }
};
