const dotenv = require("dotenv")
dotenv.config();
const express = require("express")
const app = express()


// Middleware
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');
const path = require("path")
const breadcrumbMiddleware = require('./middleware/breadcrumbs');
const User = require('./models/user');

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(breadcrumbMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

const Activity = require('./models/activity');

app.get("/", async (req, res) => {
  const activities = await Activity.find().populate('owner');

  const userPoints = {};

  // Loop through activities and add points of each enrolled user
  activities.forEach(activity => {
    activity.enrolled.forEach(userId => {
      const id = userId.toString();
      if (!userPoints[id]) {
        userPoints[id] = 0;
      }
      userPoints[id] += activity.points;
    });
  });

  const sortedUserIds = Object.entries(userPoints)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); 


  const topVolunteers = await Promise.all(
    sortedUserIds.map(async ([userId, points]) => {
      const user = await User.findById(userId);
      return { username: user.username, totalPoints: points };
    })
  );

  res.render("index.ejs", { activities, topVolunteers});
});

// Require Controller
const authController = require("./controllers/auth");
const activityController = require("./controllers/activities");


app.use("/auth", authController);
app.use("/activities", isSignedIn, activityController);


app.listen(port, () => {
  console.log(`The express app is ready on port http://localhost:${port}`);
});