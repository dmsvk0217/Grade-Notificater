const serverURL =
  process.env.NODE_ENV === "production"
    ? "http://ec2-43-200-184-150.ap-northeast-2.compute.amazonaws.com:4000/"
    : "http://localhost:4000/";

module.exports = serverURL;
