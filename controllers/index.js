const express = require("express");
const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/homeRoutes");
const withAuth = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
    session({
        secret: "MySuperDooperSecretKey",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// Routes
app.use("/auth", authRoutes);
app.use("/", homeRoutes);
app.use("/dashboard", withAuth, dashboardRoutes);

// Database connection and sync
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
        return sequelize.sync({ force: false }); // Sync database
    })
    .then(() => {
        console.log("Database synced");
        // Start the server after database sync
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });
