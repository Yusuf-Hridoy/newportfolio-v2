/* ============================================================
   Md Yusuf Ahmed — portfolio behavior
   Theme toggle, site-health data, contact form, bug report.
   No frameworks. All dynamic text is set with textContent.
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Footer year ---------- */

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Theme toggle ---------- */

  var themeBtn = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncThemeMeta() {
    var isLight = currentTheme() === "light";
    if (themeBtn) themeBtn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    if (themeMeta) themeMeta.setAttribute("content", isLight ? "#F2F4F6" : "#011A27");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncThemeMeta();
      refreshBugEnv();
    });
  }

  syncThemeMeta();

  /* ---------- Contact form (async submit to Formspree) ---------- */

  var form = document.querySelector(".contact-form");
  if (form) {
    var formStatus = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      formStatus.className = "form-status";
      formStatus.textContent = "Sending…";

      try {
        var res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        formStatus.classList.add("success");
        formStatus.textContent = "Thanks! Your message was sent — I'll get back to you soon.";
      } catch (err) {
        formStatus.classList.add("error");
        formStatus.textContent = "Something went wrong. Please email me at yusufahmed.sdet@gmail.com instead.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Helpers for time and duration ---------- */

  var rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  function timeAgo(isoString) {
    var then = new Date(isoString).getTime();
    if (isNaN(then)) return "";
    var diffSec = Math.round((then - Date.now()) / 1000);
    var abs = Math.abs(diffSec);
    if (abs < 60) return "just now";
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
    return rtf.format(Math.round(diffSec / 86400), "day");
  }

  function formatDuration(seconds) {
    var s = Math.round(Number(seconds) || 0);
    if (s < 60) return s + "s";
    var m = Math.floor(s / 60);
    var rest = s % 60;
    return rest > 0 ? m + "m " + rest + "s" : m + "m";
  }

  function show(el) {
    if (el) el.hidden = false;
  }

  /* ---------- Site-health data ---------- */

  function applySiteHealth(data) {
    var isReal = data.status === "real";
    var isSampleDemo = data.status === "sample" && window.location.pathname.indexOf("/demo/") !== -1;
    if (!isReal && !isSampleDemo) return;

    var passed = data.tests && typeof data.tests.passed === "number" ? data.tests.passed : 0;
    var total = data.tests && typeof data.tests.total === "number" ? data.tests.total : 0;
    var ago = timeAgo(data.lastRun);
    var duration = formatDuration(data.durationSeconds);

    // Hero badge
    var heroBadgeText = document.getElementById("hero-badge-text");
    if (heroBadgeText) {
      heroBadgeText.textContent = "✓ This website passed its own " + passed + " tests · " + ago + " · ";
      show(document.getElementById("hero-badge"));
    }

    // Terminal box
    var terminalReport = document.getElementById("terminal-report");
    var setCommit = document.getElementById("terminal-commit");
    var setTotal = document.getElementById("terminal-total");
    var highlightsBox = document.getElementById("terminal-highlights");
    if (setCommit) setCommit.textContent = data.commit || "…";
    if (setTotal) setTotal.textContent = String(total);
    if (highlightsBox) {
      highlightsBox.textContent = "";
      (Array.isArray(data.highlights) ? data.highlights : []).forEach(function (line) {
        var p = document.createElement("p");
        var mark = document.createElement("span");
        mark.className = "terminal-ok-text";
        mark.textContent = "✓ ";
        p.appendChild(mark);
        p.appendChild(document.createTextNode(line));
        highlightsBox.appendChild(p);
      });
    }
    var setPassed = document.getElementById("terminal-passed");
    if (setPassed) setPassed.textContent = passed + " passed";
    var setDuration = document.getElementById("terminal-duration");
    if (setDuration) setDuration.textContent = "(" + duration + ")";
    if (terminalReport && data.reportUrl && data.reportUrl !== "#") {
      terminalReport.href = data.reportUrl;
    } else if (terminalReport) {
      terminalReport.hidden = true;
    }
    show(document.getElementById("terminal-box"));

    // Site check section
    var siteCheckTime = document.getElementById("site-check-time");
    if (siteCheckTime) siteCheckTime.textContent = ago;
    var siteCheckReport = document.getElementById("site-check-report");
    var siteCheckReportWrap = document.getElementById("site-check-report-wrap");
    if (siteCheckReport && data.reportUrl && data.reportUrl !== "#") {
      siteCheckReport.href = data.reportUrl;
    } else if (siteCheckReportWrap) {
      siteCheckReportWrap.hidden = true;
    }
    if (data.status === "sample") show(document.getElementById("sample-badge"));

    var checkPassed = document.getElementById("check-passed");
    if (checkPassed) checkPassed.textContent = passed + " of " + total;
    var checkA11y = document.getElementById("check-a11y");
    if (checkA11y) checkA11y.textContent = String(data.accessibilityProblems);
    var checkSpeed = document.getElementById("check-speed");
    if (checkSpeed) checkSpeed.textContent = String(data.speedScore) + " / 100";
    var checkLinks = document.getElementById("check-links");
    if (checkLinks) checkLinks.textContent = String(data.links && data.links.broken);
    var checkLinksNote = document.getElementById("check-links-note");
    if (checkLinksNote) checkLinksNote.textContent = "All " + (data.links && data.links.checked) + " links on this site";
    show(document.getElementById("site-check"));

    // Projects
    var projects = data.projects || {};
    var anyProjectShown = false;
    Object.keys(projects).forEach(function (key) {
      var p = projects[key];
      if (!p || (p.status !== "passing" && p.status !== "failing")) return;

      var badge = document.querySelector('.project-badge[data-project="' + key + '"]');
      if (badge) {
        badge.textContent = p.status === "passing" ? "✓ CI passing" : "✕ CI failing";
        badge.classList.toggle("badge-failing", p.status === "failing");
        show(badge);
      }

      var testsLine = document.querySelector('.project-tests[data-project="' + key + '"]');
      if (testsLine) {
        testsLine.textContent = p.tests + " tests · last run " + timeAgo(p.lastRun);
        show(testsLine);
      }

      var reportLink = document.querySelector('a[data-project-report="' + key + '"]');
      if (reportLink && p.reportUrl && p.reportUrl !== "#") {
        reportLink.href = p.reportUrl;
        show(reportLink);
      }

      anyProjectShown = true;
    });
    if (anyProjectShown) show(document.getElementById("projects-lead"));

    // Footer test line
    var footerLine = document.getElementById("footer-test-line");
    if (footerLine) footerLine.textContent = passed + "/" + total + " passed";
    var footerReport = document.getElementById("footer-test-report");
    var footerReportWrap = document.getElementById("footer-test-report-wrap");
    if (footerReport && data.reportUrl && data.reportUrl !== "#") {
      footerReport.href = data.reportUrl;
    } else if (footerReportWrap) {
      footerReportWrap.hidden = true;
    }
    show(document.getElementById("footer-test"));
  }

  fetch("data/site-health.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(applySiteHealth)
    .catch(function () {
      // Leave everything hidden. Visitors never see an error.
    });

  /* ---------- Bug report ---------- */

  function browserInfo() {
    try {
      if (navigator.userAgentData) {
        var brands = navigator.userAgentData.brands || [];
        for (var i = 0; i < brands.length; i++) {
          var brand = brands[i].brand;
          if (/^(Chrome|Edge|Firefox|Safari)$/.test(brand) || /Edg/.test(brand)) {
            return brand.replace(/^Microsoft /, "").replace(/^Edg$/, "Edge") + " " + brands[i].version;
          }
        }
      }
    } catch (e) {}
    var ua = navigator.userAgent;
    var match =
      ua.match(/Edg\/([\d.]+)/) ||
      ua.match(/Chrome\/([\d.]+)/) ||
      ua.match(/Firefox\/([\d.]+)/) ||
      (ua.match(/Version\/([\d.]+)/) && ua.indexOf("Safari") !== -1 ? ["Safari", ua.match(/Version\/([\d.]+)/)[1]] : null);
    if (match) {
      var name = match[0].indexOf("Edg") === 0 ? "Edge" : match[0].split("/")[0];
      if (name === "Version") name = "Safari";
      return name + " " + match[1].split(".")[0];
    }
    return "Unknown browser";
  }

  function pageName() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return file || "home page";
  }

  var bugEnv = document.getElementById("bug-env");
  var bugButton = document.getElementById("bug-button");

  function refreshBugEnv() {
    if (!bugEnv) return;
    var parts = [
      browserInfo(),
      window.innerWidth + "×" + window.innerHeight,
      currentTheme() + " mode",
      pageName(),
    ];
    bugEnv.textContent = parts.join(" · ");
  }

  if (bugEnv) {
    refreshBugEnv();
    window.addEventListener("resize", refreshBugEnv);
  }

  if (bugButton) {
    bugButton.addEventListener("click", function () {
      var page = pageName();
      var body =
        "What happened:\n\n\n" +
        "What did you expect:\n\n\n" +
        "---\n" +
        "Page: " + window.location.href + "\n" +
        "Browser: " + browserInfo() + "\n" +
        "Screen: " + window.innerWidth + "x" + window.innerHeight + "\n" +
        "Theme: " + currentTheme() + "\n" +
        "Time: " + new Date().toISOString();
      var href =
        "mailto:yusufahmed.sdet@gmail.com" +
        "?subject=" + encodeURIComponent("Bug on portfolio: " + page) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    });
  }
})();
