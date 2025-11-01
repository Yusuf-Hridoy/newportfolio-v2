// DOM Elements
const menuBtn = document.getElementById("menu")
const header = document.querySelector("header")
const themeToggle = document.querySelector(".theme-toggle")
const scrollTopBtn = document.querySelector(".scroll-top")
const navLinks = document.querySelectorAll(".menu-links")
const sections = document.querySelectorAll("section")
const contactForm = document.getElementById("contactForm")

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear()

// Toggle menu
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("fa-times")
  header.classList.toggle("active")
})

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!header.contains(e.target) && e.target !== menuBtn) {
    header.classList.remove("active")
    menuBtn.classList.remove("fa-times")
  }
})

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light")

  if (document.body.classList.contains("light")) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    localStorage.setItem("theme", "light")
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    localStorage.setItem("theme", "dark")
  }
})

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  document.body.classList.add("light")
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
}

// Scroll to top button
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("active")
  } else {
    scrollTopBtn.classList.remove("active")
  }

  // Active menu based on scroll position
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active-link")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active-link")
    }
  })
})

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      })

      // Close mobile menu after clicking
      header.classList.remove("active")
      menuBtn.classList.remove("fa-times")
    }
  })
})

// Form validation
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const nameInput = document.getElementById("name")
    const emailInput = document.getElementById("email")
    const subjectInput = document.getElementById("subject")
    const messageInput = document.getElementById("message")

    let isValid = true

    // Validate name
    if (nameInput.value.trim() === "") {
      setErrorFor(nameInput)
      isValid = false
    } else {
      setSuccessFor(nameInput)
    }

    // Validate email
    if (emailInput.value.trim() === "" || !isValidEmail(emailInput.value)) {
      setErrorFor(emailInput)
      isValid = false
    } else {
      setSuccessFor(emailInput)
    }

    // Validate subject
    if (subjectInput.value.trim() === "") {
      setErrorFor(subjectInput)
      isValid = false
    } else {
      setSuccessFor(subjectInput)
    }

    // Validate message
    if (messageInput.value.trim() === "") {
      setErrorFor(messageInput)
      isValid = false
    } else {
      setSuccessFor(messageInput)
    }

    if (isValid) {
      // Form is valid, you can submit it or show success message
      alert("Message sent successfully!")
      contactForm.reset()

      // Remove all success classes
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("success")
      })
    }
  })
}

// Helper functions for form validation
function setErrorFor(input) {
  const formGroup = input.parentElement
  formGroup.classList.remove("success")
  formGroup.classList.add("error")
}

function setSuccessFor(input) {
  const formGroup = input.parentElement
  formGroup.classList.remove("error")
  formGroup.classList.add("success")
}

function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Calculate experience duration
function calculateExperienceDuration(startDate) {
  const start = new Date(startDate)
  const today = new Date()

  const monthsDiff = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth())

  const years = Math.floor(monthsDiff / 12)
  const months = monthsDiff % 12

  let durationString = ""

  if (years > 0) {
    durationString += years === 1 ? "1 yr " : `${years} yrs `
  }

  if (months > 0) {
    durationString += months === 1 ? "1 mo" : `${months} mos`
  }

  return durationString.trim()
}

// Update experience duration on page load
document.addEventListener("DOMContentLoaded", () => {
  const experienceDurations = document.querySelectorAll(".experience-duration")

  if (experienceDurations.length > 0) {
    experienceDurations.forEach((element) => {
      const startDate = element.getAttribute("data-start-date")
      if (startDate) {
        element.textContent = calculateExperienceDuration(startDate)
      }
    })
  }

  // Typing animation for home section
  const typingElement = document.querySelector(".typing")
  if (typingElement) {
    const text = typingElement.textContent
    typingElement.textContent = ""

    let i = 0
    function typeWriter() {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    typeWriter()
  }
})

// Add animation on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".timeline-item, .project-card, .certification-card, .skill-item")

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top
    const screenPosition = window.innerHeight / 1.2

    if (elementPosition < screenPosition) {
      element.classList.add("animate")
    }
  })
}

window.addEventListener("scroll", animateOnScroll)
window.addEventListener("load", animateOnScroll)

