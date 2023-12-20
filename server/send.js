const { SolapiMessageService } = require("solapi");
const { messageServiceKey } = require("./config");

const messageService = new SolapiMessageService(
  messageServiceKey.apikey,
  messageServiceKey.secretapikey
);

function sendGradeUpdateMsg(updatedSubject, phone) {
  messageService.send({
    to: "01056615102",
    from: phone,
    text: `${updatedSubject}의 성적이 업데이트되었습니다.`,
  });
}

module.exports = sendGradeUpdateMsg;
