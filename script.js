const dates = [
  {
    id: 1,
    number: "Chapter I",
    title: "Sunbeams & Whispers",
    date: "August 19, 2026",
    url: "date1.html"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // 1. Render date cards on landing page
  const container = document.getElementById("datesContainer");
  if (container) {
    dates.forEach(item => {
      const card = document.createElement("a");
      card.href = item.url;
      card.className = "date-card";
      card.innerHTML = `
        <span class="card-number">${item.number}</span>
        <h2 class="card-title">${item.title}</h2>
        <span class="card-date">${item.date}</span>
        <span class="heart-badge">💖</span>
      `;
      container.appendChild(card);
    });
  }

  // 2. Dynamic Floating Wisps and Hearts
  function createParticle() {
    const particleContainer = document.getElementById('particle-container');
    if (!particleContainer) return;
    
    const particle = document.createElement('div');
    const isHeart = Math.random() > 0.4;
    
    particle.className = isHeart ? 'floating-heart' : 'wisp';
    if (isHeart) particle.innerHTML = Math.random() > 0.5 ? '💖' : '🌸';
    
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
    particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
    
    particleContainer.appendChild(particle);
    setTimeout(() => { particle.remove(); }, 12000);
  }
  setInterval(createParticle, 500);

  // 3. Photo Gallery Toggle & Golden Threads
  const toggleBtn = document.getElementById("togglePhotosBtn");
  const gallerySection = document.getElementById("photoGallerySection");

  if (toggleBtn && gallerySection) {
    toggleBtn.addEventListener("click", () => {
      gallerySection.classList.toggle("hidden");
      if (!gallerySection.classList.contains("hidden")) {
        setTimeout(drawGoldenThreads, 50);
        toggleBtn.textContent = "Hide Gallery"
      }else{
        toggleBtn.textContent = "✨ View Memory Gallery ✨"
      }
    });

    window.addEventListener("resize", () => {
      if (!gallerySection.classList.contains("hidden")) {
        drawGoldenThreads();
      }
    });
  }

  // 4. Full-Size Image Lightbox Click Handler
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".close-lightbox");

  // Select both hero image and all circular photo nodes
  const expandableTargets = document.querySelectorAll(".hero-img, .photo-node");

  expandableTargets.forEach(target => {
    target.addEventListener("click", () => {
      // Find the image element whether clicked on node or image directly
      const img = target.tagName === "IMG" ? target : target.querySelector("img");
      if (modal && modalImg && img) {
        modal.style.display = "flex";
        modalImg.src = img.src;
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});

function drawGoldenThreads() {
  const svg = document.getElementById("goldenLinesSvg");
  const nodes = [
    document.getElementById("photo1"),
    document.getElementById("photo2"),
    document.getElementById("photo3"),
    document.getElementById("photo4")
  ];

  if (!svg || nodes.some(node => node === null)) return;

  svg.innerHTML = "";
  const containerRect = svg.getBoundingClientRect();

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd700" />
      <stop offset="50%" stop-color="#f4acb7" />
      <stop offset="100%" stop-color="#e2b4bd" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  for (let i = 0; i < nodes.length - 1; i++) {
    const rectA = nodes[i].getBoundingClientRect();
    const rectB = nodes[i + 1].getBoundingClientRect();

    const x1 = (rectA.left + rectA.width / 2) - containerRect.left;
    const y1 = (rectA.top + rectA.height / 2) - containerRect.top;
    const x2 = (rectB.left + rectB.width / 2) - containerRect.left;
    const y2 = (rectB.top + rectB.height / 2) - containerRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const controlX = (x1 + x2) / 2;
    const controlY = Math.min(y1, y2) - 25;

    path.setAttribute("d", `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`);
    path.setAttribute("stroke", "url(#goldGradient)");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "5 3");
    path.setAttribute("filter", "url(#glow)");

    svg.appendChild(path);
  }
}

// --- Music Toggle Control ---
const musicBtn = document.getElementById("musicToggleBtn");
const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.add("playing");
      musicIcon.textContent = "🎶";
    } else {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
      musicIcon.textContent = "🎵";
    }
  });
}


let galleryImages = [];
let currentImageIndex = -1;
let secretMap = {}; // Maps gallery index -> secret digit

// 5. Populate Side Gallery (20182 to 20206) & Assign 6 Secret Digits
const sideGalleryGrid = document.getElementById("sideGalleryGrid");
const openSideBtn = document.getElementById("openSideGalleryBtn");
const closeSideBtn = document.getElementById("closeSideGalleryBtn");
const sideGallery = document.getElementById("sideGallery");

if (sideGalleryGrid) {
  sideGalleryGrid.innerHTML = "";
  galleryImages = [];
  secretMap = {};

  const startNum = 20182;
  const endNum = 20206;
  const totalCount = endNum - startNum + 1;
  const secretCode = ["7", "2", "1", "2", "2", "4"];

  // Pick 6 random unique indices
  const secretIndices = [];
  while (secretIndices.length < secretCode.length) {
    const randomIndex = Math.floor(Math.random() * totalCount);
    if (!secretIndices.includes(randomIndex)) {
      secretIndices.push(randomIndex);
    }
  }

  // Assign digits in order to chosen random indices
  secretIndices.forEach((galleryIdx, secretIdx) => {
    secretMap[galleryIdx] = secretCode[secretIdx];
  });

  // Render side gallery grid images
  for (let i = 0; i < totalCount; i++) {
    const imgNumber = startNum + i;
    const imgSrc = `${imgNumber}.jpg`;
    galleryImages.push(imgSrc);

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = `Memory ${imgNumber}`;
    img.className = "side-gallery-item";
    img.dataset.index = i;
    
    sideGalleryGrid.appendChild(img);
  }
}

if (openSideBtn && sideGallery && closeSideBtn) {
  openSideBtn.addEventListener("click", () => sideGallery.classList.add("open"));
  closeSideBtn.addEventListener("click", () => sideGallery.classList.remove("open"));
}

// 6. Lightbox & Secret Watermark Logic
const modal = document.getElementById("lightboxModal");
const modalImg = document.getElementById("lightboxImg");
const secretBadge = document.getElementById("lightboxSecretBadge");
const closeLightbox = document.querySelector(".close-lightbox");

function setArrowsVisibility(visible) {
  const arrows = document.querySelectorAll(".lightbox-arrow");
  arrows.forEach(arrow => {
    arrow.style.display = visible ? "block" : "none";
  });
}

// Dynamic secret badge toggle
function updateSecretBadge(index) {
  if (secretBadge && index !== -1 && secretMap[index] !== undefined) {
    secretBadge.textContent = secretMap[index];
    secretBadge.style.display = "block";
  } else if (secretBadge) {
    secretBadge.style.display = "none";
  }
}

function openLightbox(index) {
  if (index >= 0 && index < galleryImages.length) {
    currentImageIndex = index;
    modalImg.src = galleryImages[currentImageIndex];
    modal.style.display = "flex";
    setArrowsVisibility(true);
    updateSecretBadge(currentImageIndex);
  }
}

function showNextImage() {
  if (currentImageIndex !== -1 && galleryImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    modalImg.src = galleryImages[currentImageIndex];
    updateSecretBadge(currentImageIndex);
  }
}

function showPrevImage() {
  if (currentImageIndex !== -1 && galleryImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImg.src = galleryImages[currentImageIndex];
    updateSecretBadge(currentImageIndex);
  }
}

// Global Image Click Listener
document.addEventListener("click", (e) => {
  const imgTarget = e.target.closest("img") || (e.target.closest(".photo-node") ? e.target.closest(".photo-node").querySelector("img") : null);

  if (imgTarget && modal && modalImg && !imgTarget.classList.contains("lightbox-content")) {
    const src = imgTarget.getAttribute("src");
    const isSidebarImage = imgTarget.closest("#sideGalleryGrid");
    const foundIndex = galleryImages.indexOf(src);

    if (isSidebarImage && foundIndex !== -1) {
      openLightbox(foundIndex);
    } else {
      // Non-sidebar image click
      currentImageIndex = -1;
      modalImg.src = src;
      modal.style.display = "flex";
      setArrowsVisibility(false);
      updateSecretBadge(-1);
    }
  }
});

// Keyboard Arrow Listener
document.addEventListener("keydown", (e) => {
  if (!modal || modal.style.display !== "flex" || currentImageIndex === -1) return;

  if (e.key === "ArrowRight") {
    showNextImage();
  } else if (e.key === "ArrowLeft") {
    showPrevImage();
  } else if (e.key === "Escape") {
    modal.style.display = "none";
  }
});

if (closeLightbox) {
  closeLightbox.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}