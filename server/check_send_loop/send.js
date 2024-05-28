const { SolapiMessageService } = require("solapi");
const { messageServiceKey } = require("./messageServiceKey.js");

const messageService = new SolapiMessageService(
  messageServiceKey.apikey,
  messageServiceKey.secretapikey
);

function sendGradeUpdateMsg(updatedSubject, phone) {
  messageService.send({
    from: "01056615102",
    to: phone,
    text: `${updatedSubject}의 성적이 업데이트되었습니다.`,
  });
}

module.exports = sendGradeUpdateMsg;
