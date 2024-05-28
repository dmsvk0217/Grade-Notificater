const credentials = {
  id: "dmsvk01",
  pw: "111111",
  phone: "01056615102",
};

const urls = {
  login: "https://hisnet.handong.edu/login/login.php",
  loginFail: "https://hisnet.handong.edu/login/_login.php",
  home: "https://hisnet.handong.edu/haksa/record/HREC130M.php",
};

const messages = {
  accountInvalid: "Incorrect Account",
  accountValid: "Correct Account",
  phoneValid: "Valid Phone",
  phoneInvalid: "Invalid Phone",
  idValid: "Valid Id",
  idInvalid: "Invalid Id",
  submitFail: "Submit Fail",
  submitSuccess: "Submit Success",
  serverError: "Internal Server Error",
};

const xpaths = {
  id: "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > input[type=text]",
  password:
    "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=password]",
  login:
    "#loginBoxBg > table:nth-child(2) > tbody > tr > td:nth-child(5) > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > input[type=image]",
};

module.exports = {
  credentials,
  urls,
  messages,
  xpaths,
};
