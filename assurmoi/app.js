const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");
const initRoutes = require("./routes");

const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000"];

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(apiLimiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

module.exports = app;