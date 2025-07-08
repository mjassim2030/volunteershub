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

  if (result.enrolled) {
    button.innerText = 'Enrolled';
    button.classList.remove('enrol-now');
    button.classList.add('enrolled');
    enrolledElement.innerText = parseInt(enrolledElement.innerText) + 1;
  } else {
    button.innerText = 'Enrol Now';
    button.classList.remove('enrolled');
    button.classList.add('enrol-now');
    enrolledElement.innerText = parseInt(enrolledElement.innerText) - 1;
  }

} catch (error) {

}

}
