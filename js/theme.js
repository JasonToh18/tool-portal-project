// Light/dark theme. Light is the default. The choice is remembered when the browser allows it.
(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function saved() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var button = document.getElementById("theme-toggle");
    if (button) {
      var toDark = theme === "light";
      button.textContent = toDark ? "Dark theme" : "Light theme";
      button.setAttribute("aria-label", toDark ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  // Apply right away so the page doesn't flash the wrong theme.
  apply(saved());

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-theme") || "light");
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        // Storage unavailable: the theme still switches for this page view.
      }
    });
  });
})();
