const puppeteer = require("puppeteer");

async function main() {
  var data = await crawlTable();
}

// Function to crawl the table and return the data
async function crawlTable() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto("https://hisnet.handong.edu");

  const idXPath =
    "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > input[type=text]";
  const passwordXPath =
    "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=password]";
  const loginXPath =
    "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > input[type=image]";

  // Switch to the frame
  const frame = page.frames().find((frame) => frame.name() === "MainFrame");
  const htmlContent = await frame.content();

  // input id,pw and login
  const idInput = await frame.waitForSelector(idXPath);
  await idInput.type("dmsvk01");

  const passwordInput = await frame.waitForSelector(passwordXPath);
  await passwordInput.type("111111");

  // does not work
  // await loginButton.click();

  // does work
  await frame.evaluate(
    (loginXPath) => document.querySelector(loginXPath).click(),
    loginXPath
  );

  // Switch back to the default content
  await page.waitForTimeout(1000); // Add a delay to ensure the frame switch is completed
  await page.goto("https://hisnet.handong.edu/haksa/record/HREC130M.php");

  // Get table data
  const tableData = await page.evaluate(() => {
    const table = document.getElementById("att_list");
    const rows = table.querySelectorAll("tr");

    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td, th");
      return Array.from(cells, (cell) => cell.innerText.trim());
    });
  });

  // Print the table in a tabular format
  console.log(new Date().toLocaleString());
  console.table(tableData);

  await browser.close();
  return tableData;
}

// Call the main function
main();
