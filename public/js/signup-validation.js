document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");

  const usernameError = document.getElementById("usernameError");
  const confirmError = document.getElementById("confirmError");

  let isUsernameValid = false;
  let isPasswordMatch = false;

  function validateForm() {
    submitBtn.disabled = !(isUsernameValid && isPasswordMatch);
  }

  // Username availability check
  usernameInput.addEventListener("blur", async () => {
    const username = usernameInput.value.trim();
    if (username.length === 0) {
      usernameError.textContent = "Username is required.";
      isUsernameValid = false;
    } else {
      const res = await fetch(`/auth/check-username?username=${username}`);
      const data = await res.json();
      if (data.taken) {
        usernameError.textContent = "Username is already taken.";
        isUsernameValid = false;
      } else {
        usernameError.textContent = "";
        isUsernameValid = true;
      }
    }
    validateForm();
  });

  // Password match check
  [passwordInput, confirmInput].forEach(input => {
    input.addEventListener("input", () => {
      if (passwordInput.value !== confirmInput.value) {
        confirmError.textContent = "Passwords do not match.";
        isPasswordMatch = false;
      } else {
        confirmError.textContent = "";
        isPasswordMatch = true;
      }
      validateForm();
    });
  });
});
