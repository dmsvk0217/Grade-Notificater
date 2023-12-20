const { SolapiMessageService } = require("solapi");
const { messageServiceKey } = require("./config");

const messageService = new SolapiMessageService(
  messageServiceKey.apikey,
  messageServiceKey.secretapikey
);

messageService.send({
  to: "01056615102",
  from: "01056615102",
  text: "컴퓨터네트워크의 성적이 업데이트되었습니다.",
});
