const puppeteer = require("puppeteer");
const firebasedb = require("./firebase.js");
const {
  urlLogin,
  urlHome,
  msgLoginFail,
  idXPath,
  passwordXPath,
  loginXPath,
} = require("./consts.js");

const TIMEOUT_ACCOUNT_VALID = 1000;
const TIMEOUT_GET_TABLE = 1000;

exports.crawlTable = async (id, pw, phone) => {
  console.log(phone, "browser");
  const browser = await puppeteer.launch({
    headless: true,
    PUPPETEER_DISABLE_HEADLESS_WARNING: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--PUPPETEER_DISABLE_HEADLESS_WARNING",
    ],
  });
  console.log(phone, "newPage");
  const page = await browser.newPage();

  console.log(phone, "goto(urlLogin)");
  await page.goto(urlLogin);

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

  await new Promise((page) => setTimeout(page, TIMEOUT_GET_TABLE));

  if (page.url() === urlLogin) {
    return msgLoginFail;
  }

  // console.log(phone, "urlHome");
  await page.goto(urlHome);
  console.log("after goto : ", page.url());

  // Get table data
  console.log(phone, "Get table data");
  let result = await page.evaluate(() => {
    const table = document.getElementById("att_list");
    const rows = table.querySelectorAll("tr");

    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td, th");
      return Array.from(cells, (cell) => cell.innerText.trim());
    });
  });

  console.table(result);
  console.log(phone, "browser.close();");

  await browser.close();
  return result;
};

exports.tableToGradeArray = (table) => table.map((row) => row[row.length - 3]);

exports.crawlGradeArray = async (id, pw) => {
  const table = await this.crawlTable(id, pw);
  return this.tableToGradeArray(table);
};

exports.acountVaildCheck = async (id, pw) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(urlLogin);

  const idInput = await page.waitForSelector(idXPath);
  await idInput.type(id);

  const passwordInput = await page.waitForSelector(passwordXPath);
  await passwordInput.type(pw);

  await page.evaluate(
    (loginXPath) => document.querySelector(loginXPath).click(),
    loginXPath
  );

  await new Promise((page) => setTimeout(page, TIMEOUT_ACCOUNT_VALID));

  // console.log(page.url());
  if (page.url() === urlLogin) {
    return false;
  }

  return true;
};

exports.idVaildCheck = async (id) => {
  try {
    return await firebasedb.checkDuplicateID(id);
  } catch (error) {
    console.error("error:", error);
  }
};

exports.phoneVaildCheck = async (phone) => {
  try {
    return await firebasedb.checkDuplicatePhone(phone);
  } catch (error) {
    console.error("error:", error);
  }
};

exports.submit = async (id, pw, phone, data) => {
  try {
    return await firebasedb.addUser(id, pw, phone, data);
  } catch (error) {
    console.error("error:", error);
  }
};
