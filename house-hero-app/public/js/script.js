// HouseHero App JavaScript

// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  // Redirect to login if not authenticated, but skip admin pages
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isLoginPage = window.location.pathname.endsWith("login.html");
  const isAdminPage =
    window.location.pathname.endsWith("admin-dashboard.html") ||
    window.location.pathname.endsWith("admin-bookings.html");
  if (!isLoggedIn && !isLoginPage && !isAdminPage) {
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
          window.location.href = "/house-hero-app/public/index.html";
          break;
        case "profile":
          window.location.href = "/house-hero-app/pages/dashboard/profile.html";
          break;
        case "settings":
          window.location.href =
            "/house-hero-app/pages/dashboard/settings.html";
          break;
        case "complaints":
          window.location.href =
            "/house-hero-app/pages/services/complaints.html";
          break;
        case "get in touch":
          window.location.href = "/house-hero-app/pages/info/contact.html";
          break;
        case "f.a.q":
          window.location.href = "/house-hero-app/pages/info/faq.html";
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
      window.location.href = "/house-hero-app/public/index.html";
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // (Add your validation here if needed)
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/house-hero-app/public/index.html";
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
    window.location.href = "/house-hero-app/pages/auth/login.html";
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

// Admin Dashboard Analytics Chart
function renderAdminAnalytics() {
  // Destroy existing charts if they exist
  if (window._adminCharts) {
    window._adminCharts.forEach((c) => c && c.destroy && c.destroy());
  }
  window._adminCharts = [];
  let bookings = JSON.parse(localStorage.getItem("allBookings") || "[]");
  if (bookings.length === 0) {
    const last = localStorage.getItem("lastBooking");
    if (last) bookings = [JSON.parse(last)];
  }
  // Bookings per month
  if (document.getElementById("bookingsChart")) {
    const monthCounts = {};
    bookings.forEach((b) => {
      if (b.date) {
        const month = b.date.slice(0, 7); // 'YYYY-MM'
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    const months = Object.keys(monthCounts).sort();
    const counts = months.map((m) => monthCounts[m]);
    if (months.length === 0) {
      const now = new Date();
      const m =
        now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
      months.push(m);
      counts.push(0);
    }
    window._adminCharts[0] = new Chart(
      document.getElementById("bookingsChart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Bookings",
              data: counts,
              backgroundColor: "#22c55e",
              borderRadius: 8,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
          },
        },
      }
    );
  }
  // Booking Status Pie Chart
  if (document.getElementById("statusChart")) {
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter(
      (b) => b.status === "pending payment"
    ).length;
    window._adminCharts[1] = new Chart(
      document.getElementById("statusChart").getContext("2d"),
      {
        type: "doughnut",
        data: {
          labels: ["Confirmed", "Pending Payment"],
          datasets: [
            {
              data: [confirmed, pending],
              backgroundColor: ["#22c55e", "#fbbf24"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: "bottom" },
            title: { display: true, text: "Booking Status" },
          },
        },
      }
    );
  }
  // Expenses vs Earnings Bar Chart
  if (document.getElementById("financeChart")) {
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalExpenses = bookings.reduce(
      (sum, b) => sum + (b.expense || 0),
      0
    );
    window._adminCharts[2] = new Chart(
      document.getElementById("financeChart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: ["Earnings", "Expenses"],
          datasets: [
            {
              label: "ZAR",
              data: [totalEarnings, totalExpenses],
              backgroundColor: ["#22c55e", "#ef4444"],
              borderRadius: 8,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Earnings vs Expenses" },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      }
    );
  }
  // Bookings by Service Type Pie Chart
  if (document.getElementById("serviceTypeChart")) {
    const serviceCounts = {};
    bookings.forEach((b) => {
      const service = b.service || "Other";
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    const serviceLabels = Object.keys(serviceCounts);
    const serviceData = serviceLabels.map((s) => serviceCounts[s]);
    const serviceColors = [
      "#22c55e",
      "#3b82f6",
      "#fbbf24",
      "#ef4444",
      "#a78bfa",
      "#f472b6",
      "#10b981",
    ];
    window._adminCharts[3] = new Chart(
      document.getElementById("serviceTypeChart").getContext("2d"),
      {
        type: "pie",
        data: {
          labels: serviceLabels,
          datasets: [
            {
              data: serviceData,
              backgroundColor: serviceLabels.map(
                (_, i) => serviceColors[i % serviceColors.length]
              ),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: "bottom" },
            title: { display: true, text: "Bookings by Service Type" },
          },
        },
      }
    );
  }
  // User Growth Over Time Line Chart
  if (document.getElementById("userGrowthChart")) {
    let users = JSON.parse(localStorage.getItem("allUsers") || "[]");
    if (!Array.isArray(users) || users.length === 0) {
      const now = new Date();
      users = Array.from({ length: 10 }, (_, i) => {
        const d = new Date(
          now.getFullYear(),
          now.getMonth() - Math.floor(i / 2),
          1 + (i % 5)
        );
        return { registered: d.toISOString().slice(0, 10) };
      });
    }
    const monthCounts = {};
    users.forEach((u) => {
      if (u.registered) {
        const month = u.registered.slice(0, 7); // 'YYYY-MM'
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    const months = Object.keys(monthCounts).sort();
    let total = 0;
    const growth = months.map((m) => (total += monthCounts[m]));
    window._adminCharts[4] = new Chart(
      document.getElementById("userGrowthChart").getContext("2d"),
      {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Total Users",
              data: growth,
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.12)",
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "User Growth Over Time" },
          },
          scales: {
            y: { beginAtZero: true, precision: 0 },
          },
        },
      }
    );
  }
  // Revenue by Service Bar Chart
  if (document.getElementById("revenueServiceChart")) {
    const revenueByService = {};
    bookings.forEach((b) => {
      const service = b.service || "Other";
      revenueByService[service] =
        (revenueByService[service] || 0) + (b.amount || 0);
    });
    const serviceLabels = Object.keys(revenueByService);
    const revenueData = serviceLabels.map((s) => revenueByService[s]);
    const serviceColors = [
      "#22c55e",
      "#3b82f6",
      "#fbbf24",
      "#ef4444",
      "#a78bfa",
      "#f472b6",
      "#10b981",
    ];
    window._adminCharts[5] = new Chart(
      document.getElementById("revenueServiceChart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: serviceLabels,
          datasets: [
            {
              label: "Earnings (ZAR)",
              data: revenueData,
              backgroundColor: serviceLabels.map(
                (_, i) => serviceColors[i % serviceColors.length]
              ),
              borderRadius: 8,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Revenue by Service" },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      }
    );
  }
  // Complaints Statistics Bar Chart
  if (document.getElementById("complaintsStatsChart")) {
    let complaints = JSON.parse(localStorage.getItem("allComplaints") || "[]");
    const typeCounts = {};
    complaints.forEach((c) => {
      const type = c.type || "Other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const typeLabels = Object.keys(typeCounts);
    const typeData = typeLabels.map((t) => typeCounts[t]);
    const typeColors = [
      "#ef4444",
      "#fbbf24",
      "#3b82f6",
      "#22c55e",
      "#a78bfa",
      "#f472b6",
      "#10b981",
    ];
    window._adminCharts[6] = new Chart(
      document.getElementById("complaintsStatsChart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: typeLabels,
          datasets: [
            {
              label: "Complaints",
              data: typeData,
              backgroundColor: typeLabels.map(
                (_, i) => typeColors[i % typeColors.length]
              ),
              borderRadius: 8,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Complaints by Type" },
          },
          scales: {
            y: { beginAtZero: true, precision: 0 },
          },
        },
      }
    );
  }
}
// Call on page load
if (document.getElementById("bookingsChart")) {
  renderAdminAnalytics();
}

// Admin Dashboard: Add confirm booking logic and render status/action columns
function confirmBooking(idx) {
  let bookings = JSON.parse(localStorage.getItem("allBookings") || "[]");
  if (bookings[idx]) {
    bookings[idx].status = "confirmed";
    localStorage.setItem("allBookings", JSON.stringify(bookings));
    // Refresh dashboard and tables
    if (typeof loadDashboard === "function") loadDashboard();
    if (typeof loadAllBookings === "function") loadAllBookings();
    // Also refresh analytics charts
    if (typeof Chart === "function") window.location.reload();
  }
}

// Patch loadDashboard and loadAllBookings to show status and confirm button
if (typeof loadDashboard === "function") {
  const origLoadDashboard = loadDashboard;
  loadDashboard = function () {
    const bookings = JSON.parse(localStorage.getItem("allBookings") || "[]");
    document.getElementById("total-bookings").textContent = bookings.length;
    document.getElementById("total-users").textContent = "1"; // Demo only
    document.getElementById("total-earnings").textContent =
      "R" + bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const latest = bookings.slice(-5).reverse();
    const table = document.getElementById("latest-bookings-table");
    if (latest.length === 0) {
      table.innerHTML = '<tr><td colspan="8">No bookings found.</td></tr>';
    } else {
      table.innerHTML = latest
        .map((b, i) => {
          const idx = bookings.length - 1 - i;
          return `<tr>
            <td>${b.name}</td>
            <td>${b.address}</td>
            <td>${b.date}</td>
            <td>${b.time}</td>
            <td>${b.service}</td>
            <td>${b.details || "-"}</td>
            <td>${b.status || "pending payment"}</td>
            <td>${
              b.status === "pending payment"
                ? `<button onclick="confirmBooking(${idx})" style="color:#fff;background:#22c55e;border:none;padding:0.4rem 1rem;border-radius:6px;cursor:pointer;">Confirm</button>`
                : ""
            }</td>
          </tr>`;
        })
        .join("");
    }
  };
}
if (typeof loadAllBookings === "function") {
  const origLoadAllBookings = loadAllBookings;
  loadAllBookings = function () {
    let bookings = JSON.parse(localStorage.getItem("allBookings") || "[]");
    const table = document.getElementById("all-bookings-table");
    if (bookings.length === 0) {
      table.innerHTML = '<tr><td colspan="8">No bookings found.</td></tr>';
    } else {
      table.innerHTML = bookings
        .map(
          (b, i) => `<tr>
          <td>${b.name}</td>
          <td>${b.address}</td>
          <td>${b.date}</td>
          <td>${b.time}</td>
          <td>${b.service}</td>
          <td>${b.details || "-"}</td>
          <td>${b.status || "pending payment"}</td>
          <td>${
            b.status === "pending payment"
              ? `<button onclick="confirmBooking(${i})" style="color:#fff;background:#22c55e;border:none;padding:0.4rem 1rem;border-radius:6px;cursor:pointer;">Confirm</button>`
              : ""
          }
            <button onclick="deleteBooking(${i})" style="color:#fff;background:#ef4444;border:none;padding:0.4rem 1rem;border-radius:6px;cursor:pointer;">Delete</button>
          </td>
        </tr>`
        )
        .join("");
    }
  };
}

// User Growth Over Time Line Chart
if (document.getElementById("userGrowthChart")) {
  // Try to get users from localStorage, else use demo data
  let users = JSON.parse(localStorage.getItem("allUsers") || "[]");
  if (!Array.isArray(users) || users.length === 0) {
    // Demo: simulate 10 users registered over 6 months
    const now = new Date();
    users = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - Math.floor(i / 2),
        1 + (i % 5)
      );
      return { registered: d.toISOString().slice(0, 10) };
    });
  }
  // Group by month
  const monthCounts = {};
  users.forEach((u) => {
    if (u.registered) {
      const month = u.registered.slice(0, 7); // 'YYYY-MM'
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    }
  });
  // Cumulative sum for growth
  const months = Object.keys(monthCounts).sort();
  let total = 0;
  const growth = months.map((m) => (total += monthCounts[m]));
  new Chart(document.getElementById("userGrowthChart").getContext("2d"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Total Users",
          data: growth,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.12)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "User Growth Over Time" },
      },
      scales: {
        y: { beginAtZero: true, precision: 0 },
      },
    },
  });
}

// Revenue by Service Bar Chart
if (document.getElementById("revenueServiceChart")) {
  const revenueByService = {};
  bookings.forEach((b) => {
    const service = b.service || "Other";
    revenueByService[service] =
      (revenueByService[service] || 0) + (b.amount || 0);
  });
  const serviceLabels = Object.keys(revenueByService);
  const revenueData = serviceLabels.map((s) => revenueByService[s]);
  const serviceColors = [
    "#22c55e",
    "#3b82f6",
    "#fbbf24",
    "#ef4444",
    "#a78bfa",
    "#f472b6",
    "#10b981",
  ];
  new Chart(document.getElementById("revenueServiceChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: serviceLabels,
      datasets: [
        {
          label: "Earnings (ZAR)",
          data: revenueData,
          backgroundColor: serviceLabels.map(
            (_, i) => serviceColors[i % serviceColors.length]
          ),
          borderRadius: 8,
          maxBarThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Revenue by Service" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// Complaints Statistics Bar Chart
if (document.getElementById("complaintsStatsChart")) {
  let complaints = JSON.parse(localStorage.getItem("allComplaints") || "[]");
  // Group by complaint type
  const typeCounts = {};
  complaints.forEach((c) => {
    const type = c.type || "Other";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const typeLabels = Object.keys(typeCounts);
  const typeData = typeLabels.map((t) => typeCounts[t]);
  const typeColors = [
    "#ef4444",
    "#fbbf24",
    "#3b82f6",
    "#22c55e",
    "#a78bfa",
    "#f472b6",
    "#10b981",
  ];
  new Chart(document.getElementById("complaintsStatsChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: typeLabels,
      datasets: [
        {
          label: "Complaints",
          data: typeData,
          backgroundColor: typeLabels.map(
            (_, i) => typeColors[i % typeColors.length]
          ),
          borderRadius: 8,
          maxBarThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Complaints by Type" },
      },
      scales: {
        y: { beginAtZero: true, precision: 0 },
      },
    },
  });
}
