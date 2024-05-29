const puppeteer = require("puppeteer");
const firebasedb = require("./firebase/firebase.js");
const { urls, messages, xpaths, TIMEOUT_WAITFOR_NAV } = require("./consts.js");

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

exports.submit = async (id, pw, phone) => {
  try {
    let data = await this.crawlGradeArray(id, pw);
    return await firebasedb.addUser(id, pw, phone, data);
  } catch (error) {
    console.error("submit error:", error);
    return false;
  }
};

exports.crawlGradeArray = async (id, pw) => {
  const table = await this.crawlTable(id, pw);
  return this.tableToGradeArray(table);
};

exports.tableToGradeArray = (table) => table.map((row) => row[row.length - 3]);

exports.crawlTable = async (id, pw) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(urls.login);
  console.log("[crawlTable] enter ", urls.login);

  const idInput = await page.waitForSelector(xpaths.id);
  await idInput.type(id);
  const passwordInput = await page.waitForSelector(xpaths.password);
  await passwordInput.type(pw);

  await page.evaluate((xpathsLogin) => document.querySelector(xpathsLogin).click(), xpaths.login);
  await page.waitForNavigation({
    timeout: TIMEOUT_WAITFOR_NAV,
    waitUntil: "load",
  });

  await idInput.dispose();
  await passwordInput.dispose();

  if (page.url() === urls.login || page.url() === urls.loginFail) {
    console.log("[crawlTable] login fail");
    await page.close();
    await browser.close();
    return messages.accountInvalid;
  }

  await page.goto(urls.home);
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

  await page.close();
  await browser.close();
  return result;
};

exports.acountVaildCheck = async (id, pw) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(urls.login);

  const idInput = await page.waitForSelector(xpaths.id);
  await idInput.type(id);
  const passwordInput = await page.waitForSelector(xpaths.password);
  await passwordInput.type(pw);

  await page.evaluate((xpathsLogin) => document.querySelector(xpathsLogin).click(), xpaths.login);
  await page.waitForNavigation({
    timeout: TIMEOUT_WAITFOR_NAV,
    waitUntil: "load",
  });

  await idInput.dispose();
  await passwordInput.dispose();

  console.log(page.url());
  if (page.url() === urls.login || page.url() === urls.loginFail) {
    await page.close();
    await browser.close();
    return false;
  }

  await page.close();
  await browser.close();
  return true;
};
