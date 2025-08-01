const navbarToggle = document.querySelector('.navbar__toggle');
const navbarMenu = document.querySelector('.navbar__menu');

// Toggle menu
navbarToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navbarToggle.classList.toggle('active');
  navbarMenu.classList.toggle('active');
});

// Ferme le menu si on clique hors du menu ou sur un lien
document.addEventListener('click', (e) => {
  if (
    navbarMenu.classList.contains('active') &&
    !navbarMenu.contains(e.target) &&
    !navbarToggle.contains(e.target)
  ) {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
  }
});

// Ferme le menu quand on clique sur un lien du menu
navbarMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
  });
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const srElements = document.querySelectorAll('.sr-hidden');
const srObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('sr-show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

srElements.forEach(el => srObserver.observe(el));

//dynamic text typing effect
// Select the element where the dynamic text will be displayed
const dynamicText = document.querySelector(".home__header h1 span");
const words = ["idea", "solution", "passion"];
// Variables to track the position and deletion status of the word
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");
    if (!isDeleting && charIndex < currentWord.length) {
        // If condition is true, type the next character
        charIndex++;
        setTimeout(typeEffect, 200);
    } else if (isDeleting && charIndex > 0) {
        // If condition is true, remove the previous character
        charIndex--;
        setTimeout(typeEffect, 100);
    } else {
        // If word is deleted then switch to the next word
        isDeleting = !isDeleting;
        dynamicText.classList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
}

typeEffect();
// ========== PROJECT CARDS INTERACTION ==========
 // 1. SWITCH view (mobile / desktop)
  const toggleBtn = document.querySelector('.toggle-view-btn');
  const desktopMockup = document.querySelector('.mockup.desktop');
  const mobileMockup = document.querySelector('.mockup.mobile');

  toggleBtn.addEventListener('click', () => {
    const isDesktopVisible = desktopMockup.classList.contains('visible');

    if (isDesktopVisible) {
      desktopMockup.classList.remove('visible');
      mobileMockup.classList.add('visible');
      toggleBtn.textContent = ' Click for PC view';
    } else {
      mobileMockup.classList.remove('visible');
      desktopMockup.classList.add('visible');
      toggleBtn.textContent = 'Click for mobile view';
    }
  });
 // 2. INTERSECTION OBSERVER : change static to gif on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const visibleMockup = card.querySelector('.mockup.visible');

      if (entry.isIntersecting) {
        // Afficher la version gif
        visibleMockup.src = visibleMockup.dataset.gif;
      } else {
        // Revenir à la version statique
        visibleMockup.src = visibleMockup.dataset.static;
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
  });

// ========== CONTACT FORM VALIDATION & EMAILJS ==========

(function () {
  emailjs.init("GZKGrN92oLqyXj_Qw"); 
})();
const form = document.getElementById("contact__form");
const statusMessage = document.getElementById("contact-message");
const sendButton = document.querySelector(".contact__button");

function showMessage(message, type = "error") {
  statusMessage.textContent = message;
  statusMessage.style.color = type === "error" ? "salmon" : "lightgreen";
  statusMessage.style.opacity = "1";
  setTimeout(() => {
    statusMessage.style.opacity = "0";
  }, 3500);
}

function showFieldError(field, message) {
  let errorElement = field.parentElement.querySelector(".error-text");
  if (!errorElement) {
    errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.style.color = "salmon";
    errorElement.style.fontSize = "0.85rem";
    errorElement.style.display = "block";
    errorElement.style.marginTop = "4px";
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
  field.classList.add("error");
}

function clearFieldError(field) {
  let errorElement = field.parentElement.querySelector(".error-text");
  if (errorElement) errorElement.textContent = "";
  field.classList.remove("error");
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function setButtonState(state) {
  if (state === "loading") {
    sendButton.disabled = true;
    sendButton.innerHTML = `<span class="spinner"></span> Sending...`;
  } else if (state === "success") {
    sendButton.disabled = false;
    sendButton.textContent = "✅ Sent";
    setTimeout(() => {
      sendButton.textContent = "Send message";
    }, 2000);
  } else if (state === "error") {
    sendButton.disabled = false;
    sendButton.textContent = "❌ Error";
    setTimeout(() => {
      sendButton.textContent = "Send message";
    }, 2000);
  } else {
    sendButton.disabled = false;
    sendButton.textContent = "Send message";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameField = form.querySelector('input[name="user_name"]');
  const emailField = form.querySelector('input[name="user_email"]');
  const messageField = form.querySelector('textarea[name="message"]');
  const honeypot = document.getElementById("website");

  let isValid = true;

  [nameField, emailField, messageField].forEach(field => {
    clearFieldError(field);
  });

  if (nameField.value.trim() === "") {
    showFieldError(nameField, "Please enter your name.");
    isValid = false;
  }
  if (!validateEmail(emailField.value)) {
    showFieldError(emailField, "Please enter a valid email.");
    isValid = false;
  }
  if (messageField.value.trim() === "") {
    showFieldError(messageField, "Please enter your message.");
    isValid = false;
  }
  if (honeypot && honeypot.value !== "") {
    showMessage("Spam detected.", "error");
    setButtonState("error");
    return;
  }
  if (!isValid) {
    showMessage("Please fix the errors above.", "error");
    setButtonState("error");
    return;
  }

  setButtonState("loading");

  emailjs.sendForm("service_4a59tpg", "template_qjsz6ha", form)
    .then(() => {
      showMessage("Message sent successfully ✅", "success");
      setButtonState("success");
      form.reset();
    })
    .catch(() => {
      showMessage("Failed to send message ❌", "error");
      setButtonState("error");
    });
});