const puppeteer = require("puppeteer");
const firebasedb = require("./firebase.js");
const {
  urlLogin,
  urlHome,
  msgLoginFail,
  idXPath,
  passwordXPath,
  loginXPath,
  msgLoginsuccess,
} = require("./consts.js");

exports.crawlTable = async (id, pw) => {
  const browser = await puppeteer.launch({
    headless: true,
    PUPPETEER_DISABLE_HEADLESS_WARNING: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--PUPPETEER_DISABLE_HEADLESS_WARNING",
    ],
  });
  const page = await browser.newPage();

  await page.goto(urlLogin);

  const frame = page.frames().find((frame) => frame.name() === "MainFrame");

  const idInput = await frame.waitForSelector(idXPath);
  await idInput.type(id);

  const passwordInput = await frame.waitForSelector(passwordXPath);
  await passwordInput.type(pw);

  await frame.evaluate(
    (loginXPath) => document.querySelector(loginXPath).click(),
    loginXPath
  );

  await new Promise((page) => setTimeout(page, 300));

  // console.log(page.url());
  if (page.url() === urlLogin) {
    return msgLoginFail;
  }

  await page.goto(urlHome);

  // Get table data
  var result = await page.evaluate(() => {
    const table = document.getElementById("att_list");
    const rows = table.querySelectorAll("tr");

    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td, th");
      return Array.from(cells, (cell) => cell.innerText.trim());
    });
  });

  console.table(result);

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

  const frame = page.frames().find((frame) => frame.name() === "MainFrame");

  const idInput = await frame.waitForSelector(idXPath);
  await idInput.type(id);

  const passwordInput = await frame.waitForSelector(passwordXPath);
  await passwordInput.type(pw);

  await frame.evaluate(
    (loginXPath) => document.querySelector(loginXPath).click(),
    loginXPath
  );

  await new Promise((page) => setTimeout(page, 300));

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
