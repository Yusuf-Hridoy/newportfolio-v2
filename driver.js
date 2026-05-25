// Page Loader
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader")
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loaded")
    }, 600)
  }
})

// DOM Elements
const menuBtn = document.getElementById("menu")
const header = document.querySelector("header")
const themeToggle = document.querySelector(".theme-toggle")
const scrollTopBtn = document.querySelector(".scroll-top")
const navLinks = document.querySelectorAll(".menu-links")
const sections = document.querySelectorAll("section")

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

// Scroll to top button & active nav tracking
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

// Intersection Observer for reveal animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
)

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el)
})

// Typing animation for home section
document.addEventListener("DOMContentLoaded", () => {
  const typingElement = document.querySelector(".typing")
  if (typingElement) {
    const text = typingElement.textContent
    typingElement.textContent = ""

    let i = 0
    function typeWriter() {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 80)
      }
    }

    typeWriter()
  }
})
