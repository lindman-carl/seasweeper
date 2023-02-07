const http = require("http");

const config = require("./utils/config");
const { app, connectDB } = require("./app");

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(config.PORT, () => {
    console.log(`[server] running on port ${config.PORT}`);
  });
});
