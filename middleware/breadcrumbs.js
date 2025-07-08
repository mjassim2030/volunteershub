const mongoose = require('mongoose');
const Activity = require('../models/activity');

module.exports = async (req, res, next) => {
  const pathSegments = req.path.split('/').filter(Boolean);

  const breadcrumbs = [];

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = decodeURIComponent(pathSegments[i]);
    const url = '/' + pathSegments.slice(0, i + 1).join('/');
    const isLast = i === pathSegments.length - 1;

    let name = segment;

    if (isLast && mongoose.Types.ObjectId.isValid(segment)) {
      try {
        const previousSegment = pathSegments[i - 1];

        if (previousSegment === 'activities') {
          const activity = await Activity.findById(segment);
          if (activity) name = activity.title;
        } 
      } catch (err) {
        // If lookup fails, keep name as segment
      }
    }

    breadcrumbs.push({
      name,
      url,
      isLast
    });
  }

  res.locals.breadcrumbs = breadcrumbs;
  next();
};
