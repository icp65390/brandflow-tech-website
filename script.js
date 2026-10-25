/* =========================================================
   BrandFlow Tech Pvt. Ltd. — Website script
   Plain JavaScript, no libraries, no backend required.
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURATION — edit these when you are ready
   --------------------------------------------------------- */

/*
 * Contact form sending service.
 * Leave EMPTY ("") until you connect a free form service.
 * Examples (see README.md for step-by-step setup):
 *   Formspree : "https://formspree.io/f/xxxxxxx"
 *   Web3Forms : "https://api.web3forms.com/submit"   (also set WEB3FORMS_ACCESS_KEY)
 * While empty, the form does NOT pretend to send. It tells the visitor that
 * online sending is not active yet, and offers email/phone instead.
 */
var FORM_ENDPOINT = "https://api.web3forms.com/submit";
var WEB3FORMS_ACCESS_KEY = "ce83321f-93a0-4cb5-b28c-ad2f1915ed07"; // only needed for Web3Forms

/* Where a visitor's message goes when they choose "send by email". */
var CONTACT_EMAIL = "brandflowpvtltd@gmail.com";
var CONTACT_PHONE = "9855065390";

/* Show KPI events in the browser console (F12) — handy while testing. */
var KPI_DEBUG = true;


/* ---------------------------------------------------------
   2. KPI TRACKING
   Every element with data-kpi="event" or data-kpi="event:detail" is tracked.
   Events are pushed to window.dataLayer (Google Tag Manager) and sent to
   gtag() (Google Analytics 4) if either is installed. Nothing is sent anywhere
   if neither is installed.

   KPI events used on this site:
     product_page_visit   (detail: mero_hisab | goldshop)   — clicks + section views
     manual_view          (detail: mero_hisab | goldshop)
     manual_download      (detail: mero_hisab | goldshop)
     demo_request         (detail: mero_hisab | goldshop)
     contact_inquiry      (detail: pricing | form_submit_* )
     phone_click
     email_click          (detail: support)
     product_interest     (detail: mero_hisab_app | form choice)
   --------------------------------------------------------- */
window.dataLayer = window.dataLayer || [];

function trackKpi(name, detail, extra) {
  var payload = { event: name, kpi_detail: detail || "", page_location: location.href };
  if (extra) { for (var k in extra) { payload[k] = extra[k]; } }
  window.dataLayer.push(payload);
  if (typeof window.gtag === "function") {
    window.gtag("event", name, { kpi_detail: payload.kpi_detail });
  }
  if (KPI_DEBUG && window.console) { console.log("[KPI]", name, detail || "", extra || ""); }
}

function parseKpi(value) {
  var parts = String(value || "").split(":");
  return { name: parts[0], detail: parts.slice(1).join(":") };
}

document.addEventListener("click", function (e) {
  var el = e.target.closest ? e.target.closest("[data-kpi]") : null;
  if (!el || el.tagName === "FORM") { return; }
  if (el.type === "submit") { return; } // the form handler tracks submits itself
  var k = parseKpi(el.getAttribute("data-kpi"));
  if (k.name) { trackKpi(k.name, k.detail); }
});


document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------
     3. MOBILE MENU
     ------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  function setMenu(open) {
    if (!header || !toggle) { return; }
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "मेनु बन्द गर्नुहोस्" : "मेनु खोल्नुहोस्");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!header.classList.contains("nav-open"));
    });
  }
  if (nav) {
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { setMenu(false); }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("nav-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (header && header.classList.contains("nav-open") && !header.contains(e.target)) { setMenu(false); }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1100) { setMenu(false); }
  });

  /* -------------------------------------------------------
     4. ACTIVE MENU ITEM WHILE SCROLLING
     ------------------------------------------------------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)')) : [];
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          byId[en.target.id].classList.add("is-active");
          byId[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) { spy.observe(s); }
    });
  }

  /* -------------------------------------------------------
     5. PRODUCT SECTION VIEWS (KPI: product_page_visit)
     Fires once per product section when a visitor actually stays on it
     for at least 1.5 seconds (scrolling past quickly does not count).
     ------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    var seen = {};
    var timers = {};
    var viewObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var key = en.target.getAttribute("data-track-view");
        if (seen[key]) { return; }
        if (en.isIntersecting) {
          timers[key] = setTimeout(function () {
            seen[key] = true;
            trackKpi("product_page_visit", key, { trigger: "section_view" });
            viewObs.unobserve(en.target);
          }, 1500);
        } else {
          clearTimeout(timers[key]);
        }
      });
    }, { threshold: 0, rootMargin: "-35% 0px -35% 0px" }); // section fills the middle of the screen
    document.querySelectorAll("[data-track-view]").forEach(function (s) { viewObs.observe(s); });
  }

  /* -------------------------------------------------------
     6. USER MANUAL BUTTONS (PDF links are placeholders)
     Put the final PDF address in each button's data-manual-url in index.html.
     ------------------------------------------------------- */
  document.querySelectorAll("[data-manual-url]").forEach(function (btn) {
    var url = (btn.getAttribute("data-manual-url") || "").trim();
    var card = btn.closest(".doc-card");
    if (url) {
      btn.setAttribute("href", url);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener");
      if (btn.getAttribute("data-manual-mode") === "download") { btn.setAttribute("download", ""); }
      var note = card && card.querySelector("[data-manual-note]");
      if (note) { note.hidden = true; }
    } else {
      btn.setAttribute("aria-describedby", card ? card.id + "-note" : "");
      var n = card && card.querySelector("[data-manual-note]");
      if (n) { n.id = card.id + "-note"; }
      btn.addEventListener("click", function () {
        if (n) {
          n.textContent = "Manual को PDF छिट्टै यहाँ उपलब्ध हुनेछ। अहिलेलाई " + CONTACT_PHONE + " मा फोन वा " + CONTACT_EMAIL + " मा इमेल गर्नुहोस्।";
          n.style.color = "#5B4300";
        }
      });
    }
  });

  /* -------------------------------------------------------
     6b. MERO HISAB VIDEO TUTORIAL
     KPI: video_play (first play), video_complete, video_chapter
     ------------------------------------------------------- */
  var video = document.getElementById("mh-video");
  if (video) {
    var played = false, done = false;
    var chapterBtns = Array.prototype.slice.call(document.querySelectorAll(".chapters [data-seek]"));
    video.addEventListener("play", function () {
      if (!played) { played = true; trackKpi("video_play", "mero_hisab"); }
    });
    video.addEventListener("ended", function () {
      if (!done) { done = true; trackKpi("video_complete", "mero_hisab"); }
    });
    video.addEventListener("timeupdate", function () {
      var t = video.currentTime, current = null;
      chapterBtns.forEach(function (b) { if (t >= parseFloat(b.getAttribute("data-seek"))) { current = b; } });
      chapterBtns.forEach(function (b) { b.classList.toggle("is-current", b === current); });
    });
    chapterBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var t = parseFloat(b.getAttribute("data-seek"));
        // preload="none": the video may not be loaded yet, so seek once it is ready
        if (video.readyState >= 1) {
          video.currentTime = t;
        } else {
          video.addEventListener("loadedmetadata", function once() {
            video.removeEventListener("loadedmetadata", once);
            video.currentTime = t;
          });
          video.load();
        }
        var p = video.play(); if (p && p.catch) { p.catch(function () {}); }
        trackKpi("video_chapter", "mero_hisab", { chapter: b.getAttribute("data-seek") + "s " + b.lastChild.textContent.trim() });
      });
    });
  }

  /* -------------------------------------------------------
     7. CONTACT FORM
     ------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (!form) { return; }
  var statusBox = document.getElementById("form-status");
  var hiddenInterest = form.querySelector('input[name="interested_product"]');
  var pills = Array.prototype.slice.call(form.querySelectorAll(".pill"));

  function selectInterest(value, fromUser) {
    pills.forEach(function (p) {
      var on = p.getAttribute("data-value") === value;
      p.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && hiddenInterest) { hiddenInterest.value = p.getAttribute("data-label"); }
    });
    if (fromUser) { trackKpi("product_interest", value, { trigger: "form_choice" }); }
  }
  pills.forEach(function (p) {
    p.addEventListener("click", function () { selectInterest(p.getAttribute("data-value"), true); });
  });
  // "डेमो अनुरोध" buttons inside a product section pre-select that product
  document.querySelectorAll('a[href="#contact"][data-interest]').forEach(function (a) {
    a.addEventListener("click", function () { selectInterest(a.getAttribute("data-interest"), false); });
  });

  function showStatus(kind, html) {
    statusBox.className = "form-status is-visible form-status--" + kind;
    statusBox.innerHTML = html;
  }

  function validate() {
    var ok = true;
    ["name", "email", "phone"].forEach(function (n) {
      var f = form.elements[n];
      var bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && ok) { f.focus(); }
      if (bad) { ok = false; }
    });
    return ok;
  }

  function mailtoLink() {
    var f = form.elements;
    var body =
      "नाम: " + f.name.value + "\n" +
      "व्यवसाय / संस्था: " + f.organization.value + "\n" +
      "इमेल: " + f.email.value + "\n" +
      "फोन: " + f.phone.value + "\n" +
      "रुचि भएको उत्पादन: " + (hiddenInterest ? hiddenInterest.value : "") + "\n\n" +
      f.message.value;
    return "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Website inquiry — " + (hiddenInterest ? hiddenInterest.value : "")) +
      "&body=" + encodeURIComponent(body);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      showStatus("error", "कृपया नाम, सही इमेल र फोन नम्बर भर्नुहोस्।");
      return;
    }
    if (form.elements._gotcha && form.elements._gotcha.value) { return; } // spam bot

    var picked = pills.filter(function (p) { return p.getAttribute("aria-pressed") === "true"; })[0];
    var interestKey = picked ? picked.getAttribute("data-value") : "";

    /* --- No sending service connected: be honest, offer email/phone --- */
    if (!FORM_ENDPOINT) {
      trackKpi("contact_inquiry", "form_submit_not_connected", { product: interestKey });
      showStatus("info",
        "<strong>अनलाइन फारम अहिले सक्रिय छैन — तपाईंको सन्देश पठाइएको छैन।</strong><br>" +
        "कृपया <a href=\"" + escapeHtml(mailtoLink()) + "\" data-kpi=\"email_click:form_fallback\">आफ्नो इमेल app बाट यही सन्देश पठाउनुहोस्</a> " +
        "वा <a href=\"tel:+977" + CONTACT_PHONE + "\" data-kpi=\"phone_click\">" + CONTACT_PHONE + "</a> मा फोन गर्नुहोस्।");
      return;
    }

    /* --- Real sending service --- */
    var submitBtn = form.querySelector('button[type="submit"]');
    var original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "पठाउँदै…";

    var data = new FormData(form);
    if (WEB3FORMS_ACCESS_KEY) {
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("subject", "BrandFlow website inquiry");
    }

    fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { "Accept": "application/json" } })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { return { ok: res.ok && j.success !== false, j: j }; }); })
      .then(function (r) {
        if (r.ok) {
          trackKpi("contact_inquiry", "form_submit_success", { product: interestKey });
          trackKpi("demo_request", interestKey, { trigger: "form" });
          showStatus("ok", "<strong>धन्यवाद! तपाईंको सन्देश प्राप्त भयो।</strong><br>हामी चाँडै तपाईंलाई सम्पर्क गर्नेछौं। तुरुन्त कुरा गर्न " + CONTACT_PHONE + " मा फोन गर्न सक्नुहुन्छ।");
          form.reset();
          selectInterest("mero_hisab", false);
        } else {
          throw new Error("send failed");
        }
      })
      .catch(function () {
        trackKpi("contact_inquiry", "form_submit_error", { product: interestKey });
        showStatus("error",
          "माफ गर्नुहोस्, सन्देश पठाउन सकिएन। कृपया <a href=\"" + escapeHtml(mailtoLink()) + "\">इमेलबाट पठाउनुहोस्</a> " +
          "वा <a href=\"tel:+977" + CONTACT_PHONE + "\">" + CONTACT_PHONE + "</a> मा फोन गर्नुहोस्।");
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
  });
});
