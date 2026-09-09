/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     COUNTER ANIMATION
  =============================== */
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    let current = 0;
    const target = +counter.dataset.count;
    const increment = Math.max(1, Math.ceil(target / 100));

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = current;
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });

  /* ===============================
     SOCIAL BUTTON ENTRANCE
  =============================== */
  const socialButtons = document.querySelectorAll(".social-btn");
  socialButtons.forEach((btn, index) => {
    setTimeout(() => {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0) scale(1)";
      btn.classList.add("active");
    }, index * 150);
  });

  /* ===============================
     FOOTER YEAR
  =============================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ===============================
     THEME TOGGLE (MOON ↔ X)
  =============================== */
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  if (toggleBtn) {
    const icon = toggleBtn.querySelector("i");

    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark");

      if (body.classList.contains("dark")) {
        icon.classList.replace("bi-moon-stars", "bi-x-lg");
      } else {
        icon.classList.replace("bi-x-lg", "bi-moon-stars");
      }
    });
  }

  /* ===============================
     BACK TO TOP BUTTON
  =============================== */
  const backTop = document.getElementById("backTop");

  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===============================
     PORTFOLIO FILTER
  =============================== */
  const filterBtns = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".portfolio-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach(card => {
        const col = card.closest(".col-md-6, .col-lg-4");
        if (!col) return;

        col.style.display =
          type === "all" || card.classList.contains(type)
            ? "block"
            : "none";
      });
    });
  });

  /* ===============================
     SMOOTH ACTIVE NAV LINK
  =============================== */
  const navLinks = document.querySelectorAll(".nav-link");

  const setActiveNav = () => {
    const fromTop = window.scrollY + 120;

    navLinks.forEach(link => {
      const section = document.querySelector(link.hash);
      if (!section) return;

      link.classList.toggle(
        "active",
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      );
    });
  };

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* ===============================
     SMOOTH ANCHOR SCROLL
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ===============================
     AOS INIT (ONCE)
  =============================== */
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 700,
      offset: 120
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    const end = +counter.dataset.count;
    const speed = Math.max(20, 1200 / end);
    let current = 1;

    const update = () => {
      counter.innerText = current;
      if (current < end) {
        current++;
        setTimeout(update, speed);
      } else {
        setTimeout(() => {
          current = 1;
          update();
        }, 1500); // pause before restart
      }
    };

    update();
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains("running")) {
          entry.target.classList.add("running");
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => observer.observe(counter));
});


// Form submission message alert

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: data,
    headers: {
      "Accept": "application/json"
    }
  })
    .then(response => {
      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Message Sent Successfully!",
          text: "Thank you for contacting ChuzyTech. We will get back to you shortly.",
          confirmButtonColor: "#0d6efd"
        });

        form.reset(); // clears the form

      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Please try again later."
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Check your internet connection."
      });
    });
});


/* =====================================================
   CHUZYTECH PREMIUM PORTFOLIO
===================================================== */

(() => {

  const title = document.getElementById("project-title");
  const subtitle = document.getElementById("project-subtitle");
  const container = document.getElementById("project-container");
  const toggleBtn = document.getElementById("projectToggleBtn");

  if (!title || !subtitle || !container || !toggleBtn) return;

  let projects = [];
  let expanded = false;

  // Load JSON
  fetch("data/project.json")
    .then(response => {

      if (!response.ok) {
        throw new Error("Unable to load project.json");
      }

      return response.json();

    })

    .then(data => {

      title.textContent = data.section.title;
      subtitle.textContent = data.section.subtitle;

      projects = data.projects;

      renderProjects();

    })

    .catch(error => {

      console.error(error);

      container.innerHTML = `
        <div class="col-12 text-center text-danger">
          Unable to load projects.
        </div>
      `;

    });


  // Render Projects
  function renderProjects() {

    let html = "";

    projects.forEach((project, index) => {

      const hidden =
        (!expanded && index >= 6)
          ? "project-hidden"
          : "";

      html += `

        <div class="col-md-6 col-lg-4 ${hidden}">

          <div class="portfolio-card">

            <div class="portfolio-image">

              <img
                src="${project.image}"
                alt="${project.name}"
                loading="lazy">

              <div class="portfolio-overlay">

                <span class="portfolio-tag">
                  ${project.category}
                </span>

              </div>

            </div>

            <div class="portfolio-body">

              <h5>${project.name}</h5>

              <p>${project.description}</p>

              <a href="${project.url}"
                 target="_blank"
                 class="btn btn-success portfolio-btn">

                <i class="fas fa-arrow-up-right-from-square me-2"></i>
                ${project.buttonText}

              </a>

            </div>

          </div>

        </div>

      `;

    });

    container.innerHTML = html;

    updateButton();

  }


  // Update Button
  function updateButton() {

    if (projects.length <= 6) {

      toggleBtn.style.display = "none";

      return;

    }

    toggleBtn.style.display = "inline-block";

    toggleBtn.innerHTML = expanded

      ? `<i class="fas fa-chevron-up me-2"></i> View Less`

      : `<i class="fas fa-briefcase me-2"></i> View All`;

  }


  // Toggle
  toggleBtn.addEventListener("click", () => {

    expanded = !expanded;

    renderProjects();

    if (!expanded) {

      document
        .getElementById("portfolio")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }

  });

})();


/* ==========================================================
   CHUZYTECH PREMIUM GALLERY
   WITH LIGHTBOX SLIDER
========================================================== */

(() => {

  const galleryContainer =
    document.getElementById("gallery-container");

  const galleryTitle =
    document.getElementById("gallery-title");

  const gallerySubtitle =
    document.getElementById("gallery-subtitle");

  const toggleBtn =
    document.getElementById("galleryToggleBtn");

  const lightbox =
    document.getElementById("galleryLightbox");

  const lightboxImg =
    document.getElementById("galleryLightboxImg");

  const caption =
    document.getElementById("galleryCaption");

  const counter =
    document.getElementById("galleryCounter");

  const closeBtn =
    document.querySelector(".gallery-close");

  const prevBtn =
    document.getElementById("galleryPrev");

  const nextBtn =
    document.getElementById("galleryNext");


  /* =====================================================
     CHECK REQUIRED ELEMENTS
  ===================================================== */

  if (
    !galleryContainer ||
    !galleryTitle ||
    !gallerySubtitle ||
    !toggleBtn ||
    !lightbox ||
    !lightboxImg ||
    !caption ||
    !closeBtn ||
    !prevBtn ||
    !nextBtn
  ) {

    return;

  }


  /* =====================================================
     VARIABLES
  ===================================================== */

  let galleryItems = [];

  let expanded = false;

  let currentIndex = 0;


  /* =====================================================
     LOAD GALLERY JSON
  ===================================================== */

  fetch("data/gallery.json")

    .then(response => {

      if (!response.ok) {

        throw new Error(
          "Unable to load gallery.json"
        );

      }

      return response.json();

    })

    .then(data => {

      galleryTitle.textContent =
        data.section.title;

      gallerySubtitle.textContent =
        data.section.subtitle;

      galleryItems =
        data.gallery;

      renderGallery();

    })

    .catch(error => {

      console.error(error);

      galleryContainer.innerHTML = `
        <div class="col-12 text-center text-danger">
          Failed to load gallery.
        </div>
      `;

    });


  /* =====================================================
     RENDER GALLERY
  ===================================================== */

  function renderGallery() {

    let html = "";


    galleryItems.forEach((item, index) => {

      const hidden =
        (!expanded && index >= 4)
          ? "gallery-hidden"
          : "";


      html += `

        <div class="col-sm-6 col-lg-3 ${hidden}">

          <div
            class="gallery-card"
            data-index="${index}"
            data-image="${item.image}"
            data-title="${item.title}"
          >

            <img
              src="${item.image}"
              alt="${item.alt}"
              loading="lazy"
            >

            <div class="gallery-overlay">

              <span class="gallery-badge">
                ${item.category}
              </span>

              <h5>
                ${item.title}
              </h5>

            </div>

          </div>

        </div>

      `;

    });


    galleryContainer.innerHTML = html;


    attachCardEvents();

    updateButton();

  }


  /* =====================================================
     VIEW ALL / VIEW LESS
  ===================================================== */

  function updateButton() {

    if (galleryItems.length <= 4) {

      toggleBtn.style.display = "none";

      return;

    }


    toggleBtn.innerHTML = expanded

      ? '<i class="fas fa-chevron-up me-2"></i> View Less'

      : '<i class="fas fa-images me-2"></i> View All';

  }


  toggleBtn.addEventListener(
    "click",
    () => {

      expanded = !expanded;

      renderGallery();


      if (!expanded) {

        document
          .getElementById("gallery")
          .scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

      }

    }
  );


  /* =====================================================
     ATTACH CARD EVENTS
  ===================================================== */

  function attachCardEvents() {

    document
      .querySelectorAll("#gallery .gallery-card")
      .forEach(card => {

        card.onclick = () => {

          const index =
            Number(card.dataset.index);

          openLightbox(index);

        };

      });

  }


  /* =====================================================
     OPEN LIGHTBOX
  ===================================================== */

  function openLightbox(index) {

    if (!galleryItems.length) return;


    currentIndex = index;


    showCurrentImage();


    lightbox.style.display = "flex";


    document.body.style.overflow =
      "hidden";

  }


  /* =====================================================
     SHOW CURRENT IMAGE
  ===================================================== */

  function showCurrentImage() {

    const item =
      galleryItems[currentIndex];


    if (!item) return;


    lightboxImg.src =
      item.image;


    lightboxImg.alt =
      item.alt || item.title;


    caption.textContent =
      item.title || "";


    counter.textContent =
      `${currentIndex + 1} / ${galleryItems.length}`;


    /* Restart animation */

    lightboxImg.style.animation =
      "none";

    void lightboxImg.offsetWidth;

    lightboxImg.style.animation =
      "galleryImageZoom .3s ease";

  }


  /* =====================================================
     NEXT IMAGE
  ===================================================== */

  function nextImage() {

    if (!galleryItems.length) return;


    currentIndex++;


    if (
      currentIndex >= galleryItems.length
    ) {

      currentIndex = 0;

    }


    showCurrentImage();

  }


  /* =====================================================
     PREVIOUS IMAGE
  ===================================================== */

  function previousImage() {

    if (!galleryItems.length) return;


    currentIndex--;


    if (currentIndex < 0) {

      currentIndex =
        galleryItems.length - 1;

    }


    showCurrentImage();

  }


  /* =====================================================
     NEXT BUTTON
  ===================================================== */

  nextBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      nextImage();

    }
  );


  /* =====================================================
     PREVIOUS BUTTON
  ===================================================== */

  prevBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      previousImage();

    }
  );


  /* =====================================================
     CLOSE BUTTON
  ===================================================== */

  closeBtn.addEventListener(
    "click",
    closeLightbox
  );


  /* =====================================================
     CLICK OUTSIDE IMAGE
  ===================================================== */

  lightbox.addEventListener(
    "click",
    event => {

      if (event.target === lightbox) {

        closeLightbox();

      }

    }
  );


  /* =====================================================
     KEYBOARD CONTROLS
  ===================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        lightbox.style.display !== "flex"
      ) {

        return;

      }


      /* RIGHT ARROW */

      if (event.key === "ArrowRight") {

        nextImage();

      }


      /* LEFT ARROW */

      if (event.key === "ArrowLeft") {

        previousImage();

      }


      /* ESC */

      if (event.key === "Escape") {

        closeLightbox();

      }

    }
  );


  /* =====================================================
     MOBILE SWIPE
  ===================================================== */

  let touchStartX = 0;

  let touchEndX = 0;


  lightbox.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  lightbox.addEventListener(
    "touchend",
    event => {

      touchEndX =
        event.changedTouches[0].screenX;


      const swipeDistance =
        touchEndX - touchStartX;


      /* SWIPE LEFT */

      if (swipeDistance < -50) {

        nextImage();

      }


      /* SWIPE RIGHT */

      if (swipeDistance > 50) {

        previousImage();

      }

    },
    { passive: true }
  );


  /* =====================================================
     CLOSE LIGHTBOX
  ===================================================== */

  function closeLightbox() {

    lightbox.style.display =
      "none";


    document.body.style.overflow =
      "";

  }

})();


// The important part for phones is this section:

lightbox.addEventListener(
  "touchstart",
  event => {
    touchStartX =
      event.changedTouches[0].screenX;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  event => {

    touchEndX =
      event.changedTouches[0].screenX;

    const swipeDistance =
      touchEndX - touchStartX;

    if (swipeDistance < -50) {
      nextImage();
    }

    if (swipeDistance > 50) {
      previousImage();
    }

  },
  { passive: true }
);

//

card.innerHTML = `

<div class="portfolio-card">

<div class="portfolio-image">

<img src="${project.image}" alt="${project.name}">

<div class="portfolio-overlay">

<span class="portfolio-tag">

${project.status}

</span>

</div>

</div>

<div class="portfolio-body">

<h5>${project.name}</h5>

<div class="portfolio-category">

${project.category}

</div>

<p class="portfolio-description">

${project.description}

</p>

<div class="portfolio-meta">

<span>

<i class="fas fa-user"></i>

${project.client}

</span>

<span>

<i class="fas fa-calendar"></i>

${project.year}

</span>

</div>

<div class="portfolio-tech">

${project.technologies.map(t => `<span>${t}</span>`).join("")}

</div>

<a href="${project.url}"

target="_blank"

class="btn btn-success portfolio-btn">

${project.buttonText}

</a>

</div>

</div>

`;

// 




