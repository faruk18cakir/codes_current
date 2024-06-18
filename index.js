const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/user.js");
const advertRouter = require("./src/routes/advert");
const applicationRouter = require("./src/routes/application");
const reviewRouter = require("./src/routes/review");
const matchRouter = require("./src/routes/match");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

async function startServer() {
  try {
    const db = require("./startup/db.js"); //this order of initialization is necessary. db should be initialized before routes so mongoose plugins register successfully
    await db();
    // Sunucuyu dinlemeye başla
    const PORT = process.env.PORT || 5010;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
}

startServer();
const corsOptions = {
  origin: "http://localhost:3000", // İzin verilen kaynak
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
// Kullanıcı route'larını tanımlayın
app.use("/api/users", userRoutes);
app.use("/api/adverts", advertRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/matches", matchRouter);
