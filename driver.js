// DOM Elements
const root = document.documentElement
const siteHeader = document.querySelector(".site-header")
const navList = document.getElementById("nav-links")
const menuBtn = document.querySelector(".menu-toggle")
const themeBtn = document.querySelector(".theme-toggle")
const scrollTopBtn = document.querySelector(".scroll-top")
const navLinks = document.querySelectorAll(".nav-link")

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear()

// Theme toggle (initial theme is applied inline in <head> to avoid a flash)
function syncThemeIcon() {
  const isLight = root.getAttribute("data-theme") === "light"
  themeBtn.querySelector("i").className = `fas fa-${isLight ? "sun" : "moon"}`
}

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light"
  root.setAttribute("data-theme", next)
  try {
    localStorage.setItem("theme", next)
  } catch (e) {}
  syncThemeIcon()
})

syncThemeIcon()

// Mobile menu
function setMenu(open) {
  navList.classList.toggle("open", open)
  menuBtn.setAttribute("aria-expanded", String(open))
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu")
  // Swap the icon class rather than innerHTML so the clicked node stays attached
  // (otherwise the outside-click handler below sees a detached target and closes the menu)
  menuBtn.querySelector("i").className = `fas fa-${open ? "xmark" : "bars"}`
}

menuBtn.addEventListener("click", () => setMenu(!navList.classList.contains("open")))

document.addEventListener("click", (e) => {
  if (!siteHeader.contains(e.target)) setMenu(false)
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false)
})

navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)))

// Header background + scroll-to-top button
function onScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 10)
  scrollTopBtn.classList.toggle("active", window.scrollY > 600)
}

window.addEventListener("scroll", onScroll, { passive: true })
onScroll()

// Highlight the nav link for the section in view
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const id = entry.target.getAttribute("id")
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
      })
    })
  },
  { rootMargin: "-45% 0px -50% 0px" }
)

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section))

// Reveal-on-scroll animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
)

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el))

// Contact form: submit to Formspree without leaving the page
const form = document.querySelector(".contact-form")
const formStatus = form.querySelector(".form-status")
const submitBtn = form.querySelector('button[type="submit"]')

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  submitBtn.disabled = true
  formStatus.className = "form-status"
  formStatus.textContent = "Sending…"

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    form.reset()
    formStatus.classList.add("success")
    formStatus.textContent = "Thanks! Your message was sent — I'll get back to you soon."
  } catch (err) {
    formStatus.classList.add("error")
    formStatus.textContent = "Something went wrong. Please email me at yusufahmed.sdet@gmail.com instead."
  } finally {
    submitBtn.disabled = false
  }
})
