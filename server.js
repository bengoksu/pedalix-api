require("node:process").loadEnvFile();
const express = require("express");

const istasyonRouter = require("./routes/istasyonRouter");
const authRouter = require("./routes/authRouter");
const logger = require("./middleware/logger");
const hataYakalayici = require("./middleware/hataYakalayici");
const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);
app.use("/istasyonlar", istasyonRouter);
app.use("/auth", authRouter);
app.use(hataYakalayici);

app.listen(port, () => {
  console.log(`CyclePort sunucusu ${port} portunda çalışıyor.`);
});
