const puppeteer = require("puppeteer");
// Import the functions you need from the SDKs you need
// main.js
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

// 나머지 코드...

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyxFtavog6fc1ajkCMFzlwVKqoFpc5hVg",
  authDomain: "hgu-grade-notification.firebaseapp.com",
  projectId: "hgu-grade-notification",
  storageBucket: "hgu-grade-notification.appspot.com",
  messagingSenderId: "210372146962",
  appId: "1:210372146962:web:5677021e214e9cb245e5cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조 얻기
const db = getFirestore(app);

// Create (추가)
const addDocument = async () => {
  try {
    const docRef = await addDoc(collection(db, "user"), {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    });
    console.log("Document added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

// Read (조회)
const getDocuments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      return doc.id;
    });
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

// Update (수정)
const updateDatabyId = async (docId, data) => {
  try {
    const userRef = doc(db, "user", docId);
    await updateDoc(userRef, {
      data: data,
    });
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

// 예제 실행
// Uncomment the line below to test the addDocument function
// addDocument();

// Uncomment the line below to test the getDocuments function
// getDocuments();

// Uncomment the line below to test the updateDocument function (provide a valid document ID)
// updateDocument('your-document-id');

// Uncomment the line below to test the deleteDocument function (provide a valid document ID)
// deleteDocument('your-document-id');

async function main() {
  var data = await crawlTable();
  if (data == "incorrect account") {
    console.log("🚀 ~ file: main.js:92 ~ main ~ data:", data);
  } else {
    console.log("🚀 ~ file: main.js:94 ~ main ~ data:", data);
  }
}

// Function to crawl the table and return the data
async function crawlTable() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  var result;

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
  console.log("1");
  console.log("2");
  await new Promise((page) => setTimeout(page, 300));
  console.log(page.url());
  if (page.url() === "https://hisnet.handong.edu/") {
    console.log("3");
    result = "incorrect account";
  } else {
    console.log("4");
    await page.goto("https://hisnet.handong.edu/haksa/record/HREC130M.php");

    console.log("5");

    // Get table data
    result = await page.evaluate(() => {
      const table = document.getElementById("att_list");
      const rows = table.querySelectorAll("tr");

      return Array.from(rows, (row) => {
        const cells = row.querySelectorAll("td, th");
        return Array.from(cells, (cell) => cell.innerText.trim());
      });
    });

    // Print the table in a tabular format
    console.log(new Date().toLocaleString());
    console.table(result);
    console.log("🚀 ~ file: main.js:60 ~ crawlTable ~ result:", result);
  }

  await browser.close();
  return result;
}

// Call the main function
main();
