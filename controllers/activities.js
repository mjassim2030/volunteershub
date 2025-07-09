const router = require('express').Router()

const Activity = require('../models/activity');

// GET the activities index page
router.get('/', async (req, res) => {
  const activities = await Activity.find().populate('owner');
  res.render('activities/index.ejs', { activities });
});

router.get('/my_activities', async (req, res) => {
  const userId = req.session.user._id;

  const activities = await Activity.find({
    $or: [
      { enrolled: userId },
      { owner: userId }
    ]
  })
    .populate('owner')
    .populate('enrolled');

  res.render('activities/index.ejs', { activities });
});


// CRUD's Routes

// GET Create New Activity page
router.get('/new', async (req, res) => {
  res.render('activities/new.ejs');
});

// 'C' POST Create New Activity 
router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id;
  await Activity.create(req.body);
  res.redirect('/activities');
});

// 'R' GET Specific Activity
router.get("/:activityId", async (req, res) => {
  // Populate both enrolled users and owner
  const activity = await Activity.findById(req.params.activityId).populate('enrolled').populate('owner');

  // Check if current user enrolled (by mean its id listed in the enrolled list)
  const userEnrolled = activity.enrolled.some((user) =>
    user.equals(req.session.user._id)
  );

  res.render('activities/show.ejs', { activity, userEnrolled });
});

// GET Uppdate Activity page
router.get('/:activityId/edit', async (req, res) => {
  try {
    const currentActivity = await Activity.findById(req.params.activityId);
    res.render('activities/edit.ejs', {
      activity: currentActivity,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 'U' Update Activity
router.put('/:activityId', async (req, res) => {
  try {
    const currentActivity = await Activity.findById(req.params.activityId);
    if (currentActivity.owner.equals(req.session.user._id)) {
      await currentActivity.updateOne(req.body);
      res.render('messages/message.ejs', { title: "Edit Activity", message: `${currentActivity.title} has been Updated!`, url: `/activities/${req.params.activityId}` });
    } else {
      res.render('messages/message.ejs', { title: "Edit Activity", message: `You don't have permission to do that.`, url: `/activities/${req.params.activityId}` });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 'D' DELETE Activity
router.delete('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (activity.owner.equals(req.session.user._id)) {
      await activity.deleteOne();
      res.render('messages/message.ejs', { title: "Delete Activity", message: `${activity.title} has been deleted!`, url: `/activities` });
    } else {
      res.render('messages/message.ejs', { title: "Delete Activity", message: `You don't have permission to do that.`, url: `/activities/${req.params.activityId}` });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/:activityId/enroll', async (req, res) => {
  const activity = await Activity.findById(req.params.activityId);
  const userId = req.session.user._id;
  const index = activity.enrolled.findIndex(id => id.toString() === userId.toString());

  let enrolled;

  if (index === -1) {
    activity.enrolled.push(userId);
    enrolled = true;
  } else {
    activity.enrolled.splice(index, 1);
    enrolled = false;
  }

  await activity.save();
  res.status(200).json({ success: true, enrolled });
});

module.exports = router;