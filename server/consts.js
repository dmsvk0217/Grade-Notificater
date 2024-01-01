const id = "dmsvk01";
const pw = "111111";
const phone = "01056615102";
const urlLogin = "https://hisnet.handong.edu/login/login.php";
const urlHome = "https://hisnet.handong.edu/haksa/record/HREC130M.php";
const msgAccountInvaild = "Incorrect Account";
const msgAccountVaild = "Correct Account";
const msgPhoneVaild = "Vaild Phone";
const msgPhoneInvaild = "Invaild Phone";
const msgIdVaild = "Vaild Id";
const msgIdInvaild = "Invaild Id";
const msgSubmitFail = "Submit Fail";
const msgSubmitSuccess = "Submit Success";
const msgServerError = "Internal Server Error";
const idXPath =
  "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > input[type=text]";
const passwordXPath =
  "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=password]";
const loginXPath =
  "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > input[type=image]";

module.exports = {
  id,
  pw,
  phone,
  urlLogin,
  urlHome,
  idXPath,
  passwordXPath,
  loginXPath,
  msgAccountInvaild,
  msgAccountVaild,
  msgPhoneVaild,
  msgPhoneInvaild,
  msgIdVaild,
  msgIdInvaild,
  msgServerError,
  msgSubmitFail,
  msgSubmitSuccess,
};
