import https from "node:https";
https.createServer((req, res) => {
  res.write("Hello world")
  res.end();
}).listen(8080)