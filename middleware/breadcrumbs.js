const mongoose = require('mongoose');
const Activity = require('../models/activity');

module.exports = async (req, res, next) => {
  const pathSegments = req.path.split('/').filter(Boolean);

  const breadcrumbs = [];

  /* Now to decode the path we need to: 
  Home > activities > activity Title
  so that pathSegments = ['Home', 'activities', 'activity title'];
  title here first will be activity Id then the title neeed to be fetched.
  */
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = decodeURIComponent(pathSegments[i]);  // Decode the URI
    const url = '/' + pathSegments.slice(0, i + 1).join('/'); // Construct the url (/activities/actitiyID')
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
