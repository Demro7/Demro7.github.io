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
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href").slice(1) === current) {
        item.classList.add("active");
      }
    });
  });

  // 3. Scroll Reveal Animation via IntersectionObserver
  const revealElements = document.querySelectorAll(".fade-in");
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

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 4. Project Cards Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Toggle active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (filterValue === "all" || cardCategory === filterValue) {
          card.classList.remove("hidden");
          // Re-trigger animation
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => {
            card.classList.add("hidden");
          }, 300);
        }
      });
    });
  });

  // 5. Project Detailed Modals Data (Updated image paths to point directly to local root folder)
  const projectsData = {
    "influencer-classifier": {
      title: "Influencer Video Classifier (Try GC)",
      category: "Computer Vision & Speech",
      image: "influencer-video-classifier.png",
      impact: "Automated manual classification workflows across a massive database of 60,000+ creator profiles, fully replacing manual tagging efforts.",
      desc: "Engineered a scalable production pipeline combining computer vision with speech models to classify creators based on content type, speaking style, and demographics. Integrates Whisper speech recognition with TalkNet active speaker validation and face identification algorithms.",
      features: [
        "Multimodal classification using visual face-matching and Whisper speech-to-text",
        "TalkNet integration for precise speaker diarization and audio filtering",
        "Automated bulk classification of 60,000+ creator database items",
        "Production-grade Python pipelines decoupled for modular integration"
      ],
      tech: ["Python", "OpenCV", "TalkNet", "Whisper", "FastAPI", "MongoDB"],
      link: "https://github.com/Demro7/influencer-video-classifier"
    },
    "meeting-assistant": {
      title: "AI Meeting Assistant (Try GC)",
      category: "LLM & Automation",
      image: "meeting assistant.png",
      impact: "Bypassed typical browser service worker constraints, allowing secure high-fidelity system-wide meeting recordings and Arabic transcripts.",
      desc: "Engineered a Manifest V3 Chrome Extension utilizing offscreen documents for system audio capture and real-time mixing. Pairs with a stateless FastAPI backend using strict Pydantic inputs to execute transcriptions via Whisper-large-v3 and structure Arabic marketing insights using Llama-3.3 on Groq in strict JSON mode.",
      features: [
        "Manifest V3 Extension incorporating offscreen document audio recording",
        "Dual-channel system/mic sound mixer running smoothly in background script",
        "Stateless FastAPI chunk-uploader with custom typing validation",
        "High-fidelity Arabic transcriptions and structured JSON marketing insights"
      ],
      tech: ["FastAPI", "Chrome MV3 Extension", "Groq API", "Whisper", "Pydantic"],
      link: "https://github.com/Demro7/ai-meeting-assistant"
    },
    "voltiq": {
      title: "VoltIQ — Smart Electricity Platform",
      category: "Computer Vision / RAG",
      image: "VoltIQ.png",
      impact: "Integrated OCR scanning, depletion predictions, and vector Q&A into a unified microservice framework.",
      desc: "Designed and built an AI-driven electricity diagnostics system. Implemented an OpenCV/PaddleOCR pipeline to scan LCD 7-segment utility displays. Trained XGBoost models to predict electrical load anomaly behaviors and forecast remaining balance. Built a vector RAG database assistant utilizing PGVector, Qdrant, and Gemini/OpenAI.",
      features: [
        "Dynamic OCR utility reading LCD 7-segment digital screens",
        "XGBoost regression forecasting credit depletion timelines",
        "Robust PGVector/Qdrant vector similarity context RAG utility",
        "FastAPI microservices deployed in Docker Compose containers"
      ],
      tech: ["FastAPI", "Flask", "YOLOv8", "PaddleOCR", "XGBoost", "PGVector", "Qdrant", "Docker"],
      link: "https://github.com/Demro7/VoltIQ-"
    },
    "yaqiz": {
      title: "YAQIZ — AI Safety & Fatigue Monitoring",
      category: "Computer Vision",
      image: "Yaqiz.png",
      impact: "Combined object classification and landmarks tracking to monitor workplace PPE and worker alertness at 20+ FPS.",
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
      image: "Digtal.png",
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
      image: "ErgoAI.png",
      impact: "Won 3rd Place in Mansoura University Computer Vision Course & 3rd Place at regional Ibtikar 8 Innovation Competition.",
      desc: "Developed an AI-powered desktop application utilizing OpenCV to monitor computer users. Calculates eye blink rates to prevent computer vision syndrome, detects yawns, and analyzes posture using spatial alignment checks, warning users of ergonomic strains.",
      features: [
        "Real-time blink counter based on Eye Aspect Ratio (EAR) thresholds",
        "Postural deviation detection based on nose/shoulder alignment coordinates",
        "Lightweight Tkinter/OpenCV desktop UI rendering at 20+ FPS",
        "Interactive desktop break reminders and statistics dashboard"
      ],
      tech: ["Python", "OpenCV", "Computer Vision", "Tkinter"],
      link: "https://github.com/magedyasse/ErgoAi"
    },
    "ecommerce": {
      title: "E-commerce Spending Prediction",
      category: "Machine Learning",
      image: "project-ecommerce.jpg",
      impact: "Provided customer value forecasts using linear regression models with detailed accuracy visualizers.",
      desc: "Designed an interactive Streamlit analysis system. Processes historical purchase statistics, executes correlation analysis, and trains a regression model to estimate annual consumer values.",
      features: [
        "Interactive Streamlit parameters to test customer profiles",
        "Exploratory analytics showcasing feature correlations",
        "Residual diagnostic plots evaluating predictions"
      ],
      tech: ["Python", "Streamlit", "Scikit-learn", "Pandas", "Matplotlib"],
      link: "https://github.com/Demro7/ecommerce-customer-analysis"
    },
    "image-segmentation": {
      title: "GMM Image Segmentation",
      category: "Machine Learning",
      image: "project-gmm.jpg",
      impact: "Improved cluster boundary matching by pre-clustering pixel space configurations with K-Means.",
      desc: "An unsupervised computer vision script utilizing Gaussian Mixture Models initialized with K-Means centroids to segment pixels of loaded images, showing advanced clustering logic.",
      features: [
        "Pre-clustering K-Means initialization module",
        "Multivariate normal distributions tracking color channels",
        "Custom segment visualizer separating background details"
      ],
      tech: ["Python", "Scikit-learn", "NumPy", "Matplotlib", "OpenCV"],
      link: "https://github.com/Demro7/image-segmentation-gmm"
    },
    "adult-income": {
      title: "USA Adult Income (UCI) EDA",
      category: "Data Analysis",
      image: "project-eda.jpg",
      impact: "Isolved educational and occupation markers representing the strongest predictors of wage brackets.",
      desc: "A thorough exploratory data science study evaluating demographics data. Combines missing-value cleaning, feature transformations, and Seaborn profiles to understand salary trends.",
      features: [
        "Comprehensive outlier treatments and demographic feature engineering",
        "Seaborn/Matplotlib correlation heatmap and categorical density plots",
        "Income bracket distributions split by age, education, and hours worked"
      ],
      tech: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
      link: "https://github.com/Demro7/USA-Adult-Data-Analysis"
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

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalImpactDesc.textContent = data.impact;
    modalDesc.textContent = data.desc;
    modalGithubLink.href = data.link;

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
    document.body.style.overflow = "hidden"; // Disable scroll background
  };

  const closeModal = () => {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Enable scroll background
  };

  // Add click events to project cards
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const projectId = card.getAttribute("data-id");
      if (projectId) {
        openModal(projectId);
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

  // Handle ESC key for modal close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });


});
