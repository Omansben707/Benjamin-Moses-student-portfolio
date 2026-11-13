// Client-side validation for the contact form.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const fields = ["name", "email", "phone", "message"];
  const setError = (id, message) => document.getElementById(id + "Error").textContent = message;
  form.addEventListener("submit", event => {
    event.preventDefault();
    fields.forEach(id => setError(id, ""));
    feedback.className = "form-feedback";
    const values = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value.trim()]));
    let valid = true;
    fields.forEach(id => {
      if (!values[id]) { setError(id, "This field is required."); valid = false; }
    });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (values.email && !emailPattern.test(values.email)) { setError("email", "Enter a valid email address."); valid = false; }
    if (values.phone && !/^\d+$/.test(values.phone)) { setError("phone", "Use digits only, without spaces or symbols."); valid = false; }
    if (!valid) {
      feedback.textContent = "Please correct the highlighted fields and try again.";
      feedback.classList.add("failure");
      return;
    }
    feedback.textContent = "Your details are valid. Opening your email application to prepare the message…";
    feedback.classList.add("success");
    const subject = encodeURIComponent("Portfolio enquiry from " + values.name);
    const body = encodeURIComponent(
      "Name: " + values.name + "\nEmail: " + values.email +
      "\nPhone: " + values.phone + "\n\nMessage:\n" + values.message
    );
    window.location.href = `mailto:b.moses2672@miva.edu.ng?subject=${subject}&body=${body}`;
  });
});