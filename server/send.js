const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService(
  "NCSYJDPXUWIOQQFE",
  "Y25FXFVIOIXPQNIGW85VHTSBVM9VHPWN"
);

messageService.send({
  to: "01056615102",
  from: "01056615102",
  text: "컴퓨터네트워크의 성적이 업데이트되었습니다.",
});
