const router = require('express').Router()

const Activity = require('../models/activity');

// API's/ Routes/ Main Functionality

router.get('/', async (req, res) => {
  const activities = await Activity.find().populate('owner');
  res.render('activities/index.ejs', { activities});
});

router.get('/new', async (req, res) => {
  res.render('activities/new.ejs');
});

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id;
  await Activity.create(req.body);
  res.redirect('/activities');
});

router.get("/:activityId", async (req, res) => {
  const activity = await Activity.findById(req.params.activityId).populate('owner');

  const userEnrolled = activity.enrolled.some((user) =>
    user.equals(req.session.user._id)
  );

  res.render('activities/show.ejs', { activity, userEnrolled });
});

router.delete('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (activity.owner.equals(req.session.user._id)) {
      await activity.deleteOne();
      res.redirect('/activities');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

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

router.put('/:activityId', async (req, res) => {
  try {
    const currentActivity = await Activity.findById(req.params.activityId);
    if (currentActivity.owner.equals(req.session.user._id)) {
      await currentActivity.updateOne(req.body);
      res.redirect('/activities');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/:activityId/enrolledBy/:userId', async (req, res) => {
  await Activity.findByIdAndUpdate(req.params.activityId, {
    $push: { enrolled: req.params.userId }
  });
  res.redirect(`/activities/${req.params.activityId}`);
});

router.delete('/:activityId/enrolledBy/:userId', async (req, res) => {
  await Activity.findByIdAndUpdate(req.params.activityId, {
    $pull: { enrolled: req.params.userId }
  });
  res.redirect(`/activities/${req.params.activityId}`);
});

module.exports = router;