async function Enroll(button, activityId) {
  const enrolled = button.classList.contains('enrolled');
  const enrolledElement = document.getElementById(activityId);

  if (enrolled) {
    button.innerText = 'Enroll Now';
    button.classList.remove('enrolled');
    button.classList.add('enrol-now');
  } else {
    button.innerText = 'Enrolled';
    button.classList.remove('enrol-now');
    button.classList.add('enrolled');
  }

  try {
    const response = await fetch(`/activities/${activityId}/enroll`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Request failed');

    const result = await response.json();
    const currentEntrollments = parseInt(enrolledElement.innerText) ? parseInt(enrolledElement.innerText) : 0;
    if (result.enrolled) {
      button.innerText = 'Enrolled';
      button.classList.remove('enrol-now');
      button.classList.add('enrolled');
      enrolledElement.innerText = currentEntrollments + 1;
    } else {
      button.innerText = 'Enroll Now';
      button.classList.remove('enrolled');
      button.classList.add('enrol-now');
      enrolledElement.innerText = currentEntrollments - 1;
    }

  } catch (error) {

  }

}

// ----------------------------------------------
// For Enrollment Popup menu
document.querySelectorAll('.enrollment-info').forEach(item => {
  item.addEventListener('click', () => {
    const activityId = item.getAttribute('tag');
    document.getElementById(`popup-${activityId}`).classList.add('show');
  });
});

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const activityId = btn.getAttribute('data-activity-id');
    document.getElementById(`popup-${activityId}`).classList.remove('show');
  });
});
