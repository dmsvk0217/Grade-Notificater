const firebasedb = require("../server/firebase.js");
const sendGradeUpdateMsg = require("../server/send.js");
const clientAPI = require("../server/client_api.js");

// const sendTimeInterval = 60 * 60 * 1000;
const sendTimeInterval = 5 * 1000;

async function gradeNotofication() {
  // 모든 유저데이터 가져오기
  let userDocs = await firebasedb.getAllUser();
  // console.log("🚀 ~ file: main.js:112 ~ gradeNotofication ~ uesrs:", uesrs);

  console.log("[gradeNotofication] " + new Date().toLocaleString());

  // for문돌면서
  for (const userDoc of userDocs) {
    const user = userDoc.data();
    const id = user.id;
    const pw = user.pw;
    const phone = user.phone;
    let tableCur = [];
    const storedGradeArray = user.data;
    let updatedGradeArray = [...storedGradeArray];

    try {
      tableCur = await clientAPI.crawlTable(id, pw, phone);
    } catch (error) {
      console.log(error);
    }

    console.log("🚀 ", id, " : ", clientAPI.tableToGradeArray(tableCur));

    for (let index = 0; index < tableCur.length; index++) {
      const row = tableCur[index];

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
        // sendGradeUpdateMsg(updatedSubject, phone);
        firebasedb.updateGradeArrayByUserdoc(userDoc, updatedGradeArray);
      }
    }
  }
}

// 1시간 마다 함수를 실행하기 위한 setInterval
setInterval(gradeNotofication, sendTimeInterval);
