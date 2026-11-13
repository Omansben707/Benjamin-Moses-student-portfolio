// Shared interface behaviour for every page.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      toggle.textContent = isOpen ? "×" : "☰";
    });
    document.addEventListener("click", event => {
      if (window.innerWidth <= 760 && sidebar.classList.contains("open") &&
          !sidebar.contains(event.target) && !toggle.contains(event.target)) {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }
});