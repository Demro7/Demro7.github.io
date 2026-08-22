document.addEventListener("DOMContentLoaded", () => {
  // 1. Interactive Mouse Spotlight Effect
  const spotlightContainer = document.querySelector(".spotlight-container");
  if (spotlightContainer) {
    window.addEventListener("mousemove", (e) => {
      const rect = spotlightContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightContainer.style.setProperty("--mouse-x", `${x}px`);
      spotlightContainer.style.setProperty("--mouse-y", `${y}px`);
    });
  }

  // 2. Mobile Nav Menu Toggle (uses inline SVG manipulation instead of Lucide API)
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", String(navLinks.classList.contains("active")));
      const svgEl = navToggle.querySelector("svg");
      if (svgEl) {
        if (navLinks.classList.contains("active")) {
          // Change to "X" close icon SVG path
          svgEl.innerHTML = `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`;
        } else {
          // Change back to "Menu" hamburger icon SVG path
          svgEl.innerHTML = `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`;
        }
      }
    });

    // Close menu when clicking nav link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        const svgEl = navToggle.querySelector("svg");
        if (svgEl) {
          svgEl.innerHTML = `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`;
        }
      });
    });
  }

  // Active navigation tracking on scroll
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
      if (item.getAttribute("href").slice(1) === current) {
        item.classList.add("active");
        item.setAttribute("aria-current", "page");
      }
    });
  });

  // 3. Scroll Reveal Animation via IntersectionObserver
  const revealElements = document.querySelectorAll(".fade-in");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.documentElement.classList.add("reveal-enabled");
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // 4. Project Cards Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const filterTransitionTimers = new WeakMap();

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Toggle active filter button
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const pendingTimer = filterTransitionTimers.get(card);
        if (pendingTimer !== undefined) {
          clearTimeout(pendingTimer);
          filterTransitionTimers.delete(card);
        }

        const cardCategory = card.getAttribute("data-category");
        if (filterValue === "all" || cardCategory === filterValue) {
          card.classList.remove("hidden");
          card.setAttribute("aria-hidden", "false");
          card.setAttribute("tabindex", "0");
          // Re-trigger animation
          const showTimer = setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
            filterTransitionTimers.delete(card);
          }, 50);
          filterTransitionTimers.set(card, showTimer);
        } else {
          card.setAttribute("aria-hidden", "true");
          card.setAttribute("tabindex", "-1");
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          const hideTimer = setTimeout(() => {
            card.classList.add("hidden");
            filterTransitionTimers.delete(card);
          }, 300);
          filterTransitionTimers.set(card, hideTimer);
        }
      });
    });
  });

  // 5. Project Detailed Modals Data (Updated image paths to point directly to local root folder)
  const projectsData = {
    "howeya-seo-ai": {
      title: "Howeya SEO-AI (Howeyah)",
      category: "AI & Automation",
      image: "howeya-seo-ai.webp",
      impact: "Validated platform reliability with 21/21 PostgreSQL tests and 394/394 regression tests passing.",
      desc: "Contributed to an AI-powered SEO platform analyzing, optimizing, and improving WordPress websites through automated AI-driven recommendations and validation workflows. Built multi-stage validation pipelines including live validation, SEO rules, and freshness checks with an evidence management system ensuring recommendations were accurate, auditable, and safe to apply.",
      features: [
        "Built multi-stage validation pipelines (live validation, SEO rules, freshness checks) and evidence management system",
        "Ensured AI-generated recommendations were accurate, auditable, and safe to apply",
        "Improved crawl engine reliability and WordPress media/Alt Text automation",
        "Achieved 21/21 passing PostgreSQL tests and 394/394 passing regression tests"
      ],
      tech: ["Python", "FastAPI", "PostgreSQL", "WordPress REST API", "Pytest", "Docker"],
      link: null
    },
    "influencer-classifier": {
      title: "Influencer Video Classifier (Try GC)",
      category: "Computer Vision & Speech",
      image: "influencer-video-classifier.webp",
      impact: "Automated multimodal classification across a database of 60,000+ creator profiles.",
      desc: "Engineered a scalable pipeline combining computer vision and speech models to classify creators by content type and speaking style. Integrated Whisper speech recognition with TalkNet active-speaker validation and face analysis.",
      features: [
        "Multimodal classification using visual face-matching and Whisper speech-to-text",
        "TalkNet integration for precise speaker diarization and audio filtering",
        "Automated bulk classification of 60,000+ creator database items",
        "Modular Python pipelines designed for integration with internal workflows"
      ],
      tech: ["Python", "OpenCV", "TalkNet", "Whisper", "FastAPI", "MongoDB"],
      link: "https://github.com/Demro7/influencer-video-classifier"
    },
    "meeting-assistant": {
      title: "AI Meeting Assistant (Try GC)",
      category: "LLM & Automation",
      image: "meeting-assistant.webp",
      impact: "Used Manifest V3 offscreen documents to support system and microphone audio capture with Arabic transcription.",
      desc: "Engineered a Manifest V3 Chrome Extension utilizing offscreen documents for system audio capture and real-time mixing. Pairs with a stateless FastAPI backend using strict Pydantic inputs to execute transcriptions via Whisper-large-v3 and structure Arabic marketing insights using Llama-3.3 on Groq in strict JSON mode.",
      features: [
        "Manifest V3 Extension incorporating offscreen document audio recording",
        "Dual-channel system/mic sound mixer running smoothly in background script",
        "Stateless FastAPI chunk-uploader with custom typing validation",
        "Arabic transcriptions and structured JSON marketing insights"
      ],
      tech: ["FastAPI", "Chrome MV3 Extension", "Groq API", "Whisper", "Pydantic"],
      link: "https://github.com/Demro7/ai-meeting-assistant"
    },
    "voltiq": {
      title: "VoltIQ — Smart Electricity Platform",
      category: "Computer Vision / RAG",
      image: "voltiq.webp",
      impact: "Integrated OCR scanning, depletion predictions, and vector Q&A into a unified microservice framework.",
      desc: "Designed and built an AI-driven electricity diagnostics system. Implemented an OpenCV/PaddleOCR pipeline to scan LCD 7-segment utility displays. Trained XGBoost models to predict electrical load anomaly behaviors and forecast remaining balance. Built a vector RAG database assistant utilizing PGVector, Qdrant, and Gemini/OpenAI.",
      features: [
        "Dynamic OCR utility reading LCD 7-segment digital screens",
        "XGBoost regression forecasting credit depletion timelines",
        "PGVector/Qdrant similarity search for grounded RAG responses",
        "FastAPI microservices deployed in Docker Compose containers"
      ],
      tech: ["FastAPI", "Flask", "YOLOv8", "PaddleOCR", "XGBoost", "PGVector", "Qdrant", "Docker"],
      link: "https://github.com/Demro7/VoltIQ-"
    },
    "yaqiz": {
      title: "YAQIZ — AI Safety & Fatigue Monitoring",
      category: "Computer Vision",
      image: "yaqiz.webp",
      impact: "Combined PPE detection, worker tracking, and facial landmarks to monitor workplace safety and fatigue.",
      desc: "Created a full-stack smart monitoring dashboard. Employs YOLOv8 to detect personal protective equipment (PPE) like helmets and vests, linked with ByteTrack for worker ID persistence. Leverages MediaPipe face landmarks to track blinking rates, eye aspect ratios, and yawn patterns to trigger fatigue alerts.",
      features: [
        "YOLOv8 real-time PPE compliance check (Hard hats, vests, goggles)",
        "ByteTrack frame-to-frame worker path tracking and identity mapping",
        "MediaPipe face mesh landmarks calculating fatigue indicators",
        "WebSockets audio/video streaming connection into a React dashboard"
      ],
      tech: ["FastAPI", "React", "YOLOv8", "MediaPipe", "Docker", "WebSockets"],
      link: "https://github.com/Demro7/YAQIZ"
    },
    "digital-employee": {
      title: "Digital Employee – AI Sales Assistant",
      category: "LLM & Automation",
      image: "digital-employee.webp",
      impact: "Automated structural order outputs and inventory checks directly from informal client messaging streams.",
      desc: "Designed a bilingual LLM chat assistant designed for small/medium business sector clients. Integrates conversational interfaces with structured JSON output configurations to convert chats into processed sales checkout orders. Includes JWT secure routes, low-stock alerts, and sector-customizable workflows.",
      features: [
        "Bilingual English/Arabic natural language order parsing",
        "Strict JSON schema generation converting messages to orders",
        "Low-stock alert thresholds and automated invoice generators",
        "Adaptable templates supporting 10+ distinct retail niches"
      ],
      tech: ["Python", "Flask", "OpenAI API", "MongoDB", "JWT", "HTML/JS"],
      link: "https://github.com/Demro7/Digital-Employee"
    },
    "ergoai": {
      title: "ErgoAI – Health & Productivity Assistant",
      category: "Computer Vision",
      image: "ergoai.webp",
      impact: "Won 3rd Place in the Mansoura University Computer Vision Course and 3rd Place in the university-level Ibtikar 8 Innovation Competition.",
      desc: "Developed an AI-powered desktop application utilizing OpenCV to monitor computer users. Calculates eye blink rates to prevent computer vision syndrome, detects yawns, and analyzes posture using spatial alignment checks, warning users of ergonomic strains.",
      features: [
        "Real-time blink counter based on Eye Aspect Ratio (EAR) thresholds",
        "Postural deviation detection based on nose/shoulder alignment coordinates",
        "Lightweight Tkinter/OpenCV desktop application",
        "Real-time OpenCV desktop monitoring at approximately 20 FPS"
      ],
      tech: ["Python", "OpenCV", "Computer Vision", "Tkinter"],
      link: "https://github.com/magedyasse/ErgoAi"
    }
  };

  const modalOverlay = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalImg = document.getElementById("modal-img");
  const modalTags = document.getElementById("modal-tags");
  const modalTitle = document.getElementById("modal-title");
  const modalImpactDesc = document.getElementById("modal-impact-desc");
  const modalDesc = document.getElementById("modal-desc");
  const modalFeatures = document.getElementById("modal-features");
  const modalTechList = document.getElementById("modal-tech-list");
  const modalGithubLink = document.getElementById("modal-github-link");
  const modalPrivateNote = document.getElementById("modal-private-note");
  const modalBackgroundElements = [
    document.querySelector(".skip-link"),
    document.querySelector("header"),
    document.querySelector("main"),
    document.querySelector("footer")
  ].filter(Boolean);
  let lastFocusedElement = null;

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    lastFocusedElement = document.activeElement;
    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalImpactDesc.textContent = data.impact;
    modalDesc.textContent = data.desc;
    if (data.link) {
      modalGithubLink.href = data.link;
      modalGithubLink.style.display = "";
      modalPrivateNote.hidden = true;
    } else {
      modalGithubLink.style.display = "none";
      modalGithubLink.removeAttribute("href");
      modalPrivateNote.hidden = false;
    }

    // Clear and populate tags
    modalTags.innerHTML = "";
    const tagSpan = document.createElement("span");
    tagSpan.className = "modal-tag";
    tagSpan.textContent = data.category;
    modalTags.appendChild(tagSpan);

    // Clear and populate features
    modalFeatures.innerHTML = "";
    data.features.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      modalFeatures.appendChild(li);
    });

    // Clear and populate tech badges (uses local SVGs instead of Lucide attributes)
    modalTechList.innerHTML = "";
    data.tech.forEach((t) => {
      const badge = document.createElement("span");
      badge.className = "tech-badge";
      badge.textContent = t;
      modalTechList.appendChild(badge);
    });

    modalOverlay.classList.add("active");
    modalOverlay.removeAttribute("inert");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalBackgroundElements.forEach((element) => element.setAttribute("inert", ""));
    document.body.style.overflow = "hidden"; // Disable scroll background
    requestAnimationFrame(() => modalCloseBtn.focus());
  };

  const closeModal = () => {
    if (!modalOverlay.classList.contains("active")) return;
    document.body.style.overflow = ""; // Enable scroll background
    modalBackgroundElements.forEach((element) => element.removeAttribute("inert"));
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.setAttribute("inert", "");
    lastFocusedElement = null;
  };

  // Open project case studies by pointer or keyboard.
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const projectId = card.getAttribute("data-id");
      if (projectId) {
        openModal(projectId);
      }
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card.getAttribute("data-id"));
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Keep keyboard focus inside the open dialog and support Escape.
  document.addEventListener("keydown", (e) => {
    if (!modalOverlay.classList.contains("active")) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const focusable = [...modalOverlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((element) => !element.hidden && element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });


});
