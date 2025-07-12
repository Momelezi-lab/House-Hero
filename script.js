// HouseHero App JavaScript

// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-dark");
  
  if (toggleBtn) {
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      html.classList.add('dark');
      toggleBtn.textContent = '🌙';
    } else {
      html.classList.remove('dark');
      toggleBtn.textContent = '☀️';
    }
    
    toggleBtn.addEventListener("click", () => {
      html.classList.toggle("dark");
      const isDark = html.classList.contains("dark");
      toggleBtn.textContent = isDark ? "🌙" : "☀️";
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});

// Utility functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('border-red-500');
      isValid = false;
    } else {
      input.classList.remove('border-red-500');
    }
  });
  
  return isValid;
}

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
  }
  input.value = value;
}

// Add event listeners for phone formatting
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', () => formatPhoneNumber(input));
  });
});

// Set minimum date to today for booking forms
document.addEventListener('DOMContentLoaded', () => {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
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
    button.innerHTML = button.dataset.originalText || 'Submit';
  }
}

// Local storage helpers
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function getFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Auto-save form data (for longer forms)
function autoSaveForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea, select');
  const savedData = getFromLocalStorage(`form_${formId}`);
  
  // Load saved data
  if (savedData) {
    inputs.forEach(input => {
      if (savedData[input.name]) {
        input.value = savedData[input.name];
      }
    });
  }
  
  // Save data on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const formData = {};
      inputs.forEach(inp => {
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
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('booking-form')) {
    autoSaveForm('booking-form');
  }
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => {
    //     console.log('SW registered: ', registration);
    //   })
    //   .catch(registrationError => {
    //     console.log('SW registration failed: ', registrationError);
    //   });
  });
}