// HouseHero App JavaScript

// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  // Redirect to login if not authenticated
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isLoginPage = window.location.pathname.endsWith("login.html");
  if (!isLoggedIn && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  const toggleBtn = document.getElementById("toggle-dark");

  if (toggleBtn) {
    const html = document.documentElement;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      html.classList.add("dark");
      toggleBtn.textContent = "🌙";
    } else {
      html.classList.remove("dark");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      html.classList.toggle("dark");
      const isDark = html.classList.contains("dark");
      toggleBtn.textContent = isDark ? "🌙" : "☀️";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // Sidebar menu logic
  const menuToggle = document.getElementById("menu-toggle");
  const sidebarMenu = document.getElementById("sidebar-menu");
  const closeMenu = document.getElementById("close-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  function openSidebar() {
    sidebarMenu.classList.add("open");
    sidebarOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    sidebarMenu.style.transform = "translateX(0)";
  }

  window.closeSidebar = function () {
    sidebarMenu.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    document.body.style.overflow = "auto";
    sidebarMenu.style.transform = "translateX(100%)";
  };

  if (menuToggle && sidebarMenu && closeMenu && sidebarOverlay) {
    const touchEvent = "ontouchstart" in window ? "touchstart" : "click";

    menuToggle.addEventListener(touchEvent, (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSidebar();
    });

    closeMenu.addEventListener(touchEvent, (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });

    sidebarOverlay.addEventListener(touchEvent, (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });

    // Add keyboard support for accessibility
    menuToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openSidebar();
      }
    });

    closeMenu.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeSidebar();
      }
    });
  }

  // Sidebar menu options functionality
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const linkText = link.textContent.toLowerCase().trim();
      console.log("Link clicked:", linkText);

      switch (linkText) {
        case "🏠 home":
          window.location.href = "index.html";
          break;
        case "profile":
          window.location.href = "profile.html";
          break;
        case "settings":
          window.location.href = "settings.html";
          break;
        case "complaints":
          window.location.href = "complaints.html";
          break;
        case "get in touch":
          window.location.href = "contact.html";
          break;
        case "f.a.q":
          window.location.href = "faq.html";
          break;
        case "⎋ logout":
          console.log("Logout clicked!");
          handleLogout();
          break;
        default:
          console.log("Unknown menu option:", linkText);
      }
    });
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // (Add your validation here if needed)
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "index.html";
    });
  }
});

// Logout functionality
function handleLogout() {
  console.log("handleLogout function called");
  if (confirm("Are you sure you want to logout?")) {
    // Clear all stored user data and settings
    localStorage.clear();
    sessionStorage.clear();

    // Show logout message
    showToast("Logged out successfully", "success");

    // Close sidebar if it exists
    if (typeof closeSidebar === "function") {
      closeSidebar();
    }

    // Redirect to login page immediately
    window.location.href = "login.html";
  }
}

// Utility functions
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add better styling for toast
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.zIndex = "10000";
  toast.style.padding = "16px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "white";
  toast.style.fontWeight = "500";
  toast.style.transform = "translateX(100%)";
  toast.style.transition = "transform 0.3s ease";

  if (type === "success") {
    toast.style.backgroundColor = "#22c55e";
  } else if (type === "error") {
    toast.style.backgroundColor = "#ef4444";
  } else {
    toast.style.backgroundColor = "#3b82f6";
  }

  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  // Hide and remove toast
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("border-red-500");
      isValid = false;
    } else {
      input.classList.remove("border-red-500");
    }
  });

  return isValid;
}

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{1,3})/, "$1-$2");
  }
  input.value = value;
}

// Add event listeners for phone formatting
document.addEventListener("DOMContentLoaded", () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("input", () => formatPhoneNumber(input));
  });
});

// Set minimum date to today for booking forms
document.addEventListener("DOMContentLoaded", () => {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  dateInputs.forEach((input) => {
    input.setAttribute("min", today);
  });
});

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

// Loading state for forms
function setLoading(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="loading">⟳</span> Processing...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || "Submit";
  }
}

// Local storage helpers
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

function getFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

// Auto-save form data (for longer forms)
function autoSaveForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea, select");
  const savedData = getFromLocalStorage(`form_${formId}`);

  // Load saved data
  if (savedData) {
    inputs.forEach((input) => {
      if (savedData[input.name]) {
        input.value = savedData[input.name];
      }
    });
  }

  // Save data on input
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const formData = {};
      inputs.forEach((inp) => {
        formData[inp.name] = inp.value;
      });
      saveToLocalStorage(`form_${formId}`, formData);
    });
  });
}

// Clear form auto-save data
function clearAutoSave(formId) {
  localStorage.removeItem(`form_${formId}`);
}

// Initialize auto-save for booking forms
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("booking-form")) {
    autoSaveForm("booking-form");
  }
});

// Service worker registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => {
    //     console.log('SW registered: ', registration);
    //   })
    //   .catch(registrationError => {
    //     console.log('SW registration failed: ', registrationError);
    //   });
  });
}
