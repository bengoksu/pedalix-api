require("node:process").loadEnvFile();
const express = require("express");
const istasyonRouter = require("./routes/istasyonRouter");
const authRouter = require("./routes/authRouter");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/istasyonlar", istasyonRouter);
app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(`CyclePort sunucusu ${port} portunda çalışıyor.`);
});
