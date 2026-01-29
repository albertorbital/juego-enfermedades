import './style.css'
import { characters } from './characters.js'

// Helper to resolve paths for GitHub Pages (base URL)
const resolvePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.BASE_URL;
  if (path.startsWith(baseUrl)) return path; // Already resolved
  // Remove leading slash if present to avoid double slashes with BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

// Game State
let targetChar = null;
let activeCategory = 'agente'; // Default category
let gameMode = '1vs1'; // Default mode
const flippedStates = new Set(); // Global state for all categories
let cardSubIndices = {}; // Track sub-index for multi-item cards
let lastCycledId = null; // Track last cycled card for animation

let activeTriggerQuestion = null; // Track last clicked question for animations

// Instructions Carousel State
let currentInstSlide = 0;
const instSlides = [
  { img: 'images/tutorial/tut_1.gif', text: "1. En ¿Qué enfermedad eres? Haz cualquier pregunta de Sí o No de las cartas de enfermedad." },
  { img: 'images/tutorial/tut_2.gif', text: "2. Para ir Descartando las enfermedades que NO seas, Haz click en la carta! Aparecerán las Enfermedades que comparten alguna Carta/Característica con ella." },
  { img: 'images/tutorial/tut_3.gif', text: "3. ¡Cuidado! Algunas Enfermedades tienen varias cartas y preguntas, ten cuidado de no Girarlas y Descartarlas antes de tiempo!" },
  { img: 'images/tutorial/tut_4.gif', text: "4. Revisa cada Enfermedad en Enfermedades." },
  { img: 'images/tutorial/tut_5.gif', text: "5. Completa tu investigación para averiguar…¡Qué enfermedad eres!" }
];

function updateInstCarousel() {
  const contentEl = document.getElementById('inst-slide-content');
  const dotsEl = document.getElementById('inst-dots-container');
  if (!contentEl || !dotsEl) return;

  const slide = instSlides[currentInstSlide];
  contentEl.innerHTML = `
    <img src="${resolvePath(slide.img)}" class="inst-slide-img" alt="Tutorial Step ${currentInstSlide + 1}">
    <div class="inst-text">${slide.text}</div>
  `;

  dotsEl.innerHTML = instSlides.map((_, idx) => `
    <div class="inst-dot ${idx === currentInstSlide ? 'active' : ''}" 
         onclick="window.goToInstSlide(${idx}); event.stopPropagation()"></div>
  `).join('');

  // Show close hint only on last slide
  const closeHint = document.getElementById('inst-close-hint');
  if (closeHint) {
    if (currentInstSlide === instSlides.length - 1) {
      closeHint.classList.remove('hidden');
      closeHint.style.display = 'block';
      closeHint.style.visibility = 'visible';
    } else {
      closeHint.classList.add('hidden');
      closeHint.style.display = 'none';
    }
  }
}

window.goToInstSlide = (idx) => {
  currentInstSlide = idx;
  updateInstCarousel();
};

window.nextInstSlide = () => {
  if (currentInstSlide < instSlides.length - 1) {
    currentInstSlide++;
    updateInstCarousel();
  }
};

// Carousel State
let carouselItems = [];
let currentCarouselIndex = 0;

// Progress Goal Anim
let goalFrame = 0;
const goalFramesCount = 19;
let goalInterval = null;

function updateGoalIcon() {
  const goalImg = document.getElementById('goal-icon');
  if (goalImg) {
    goalImg.src = resolvePath(`images/switch/char${goalFrame}.png`);
    goalFrame = (goalFrame + 1) % goalFramesCount;
  }
}

function startGoalAnimation() {
  if (goalInterval) clearInterval(goalInterval);
  goalInterval = setInterval(updateGoalIcon, 1000 / 12);
}

function stopGoalAnimation() {
  if (goalInterval) {
    clearInterval(goalInterval);
    goalInterval = null;
  }
}

// Character Background Animations
let cardAnimInterval = null;
const animConfigs = {
  virus: { count: 22, dir: 'images/character_virus' },
  bacteria: { count: 21, dir: 'images/character_bacteria' },
  fungus: { count: 20, dir: 'images/character_hongo' },
  parasite: { count: 24, dir: 'images/character_parasite' }
};

function updateCardAnimations() {
  const animations = document.querySelectorAll('.card-bg-anim:not(.fade-out)');
  if (animations.length === 0) return;
  // console.log(`Animating ${animations.length} cards`); // Silent for now but ready if needed

  const now = Date.now();
  animations.forEach(anim => {
    const type = anim.dataset.type;
    const config = animConfigs[type];
    if (!config) return;

    // Stagger using a unique seed (card ID)
    const id = parseInt(anim.dataset.id);
    const fps = 12;
    // Calculate frame: (CurrentTime / FrameDuration + Offset) % FrameCount
    // Increase stagger to make it more obvious
    const frameIndex = Math.floor((now / (1000 / fps) + id * 5) % config.count);
    const img = anim.querySelector('img');
    if (img) {
      const newSrc = resolvePath(`${config.dir}/char${frameIndex}.png`);
      if (img.getAttribute('src') !== newSrc) {
        img.src = newSrc;
      }
    }
  });
}

function startCardAnimations() {
  if (cardAnimInterval) clearInterval(cardAnimInterval);
  cardAnimInterval = setInterval(updateCardAnimations, 1000 / 12);
}

function updateCarouselList() {
  carouselItems = [
    { src: 'images/enfermedades/0_titulo.png', title: '' },
    { src: 'images/enfermedades/1_Protocolos_aislamiento.png', title: 'Protocolos de Aislamientos' },
    ...characters.map(c => ({ src: c.infoImage, title: c.name }))
  ];
}

const rounds = ['agente', 'transmision', 'prevencion_ciudadana', 'prevencion_hospitalaria', 'sistema_afectado'];

const roundConfig = {
  agente: { label: "Agente", question: "¿Qué tipo de agente eres?" },
  transmision: { label: "Transmisión", question: "¿Cómo te transmites?" },
  prevencion_ciudadana: { label: "Prev. Ciudadana", question: "¿Cómo prevenir en sociedad?" },
  prevencion_hospitalaria: { label: "Prev. Hospitalaria", question: "¿Qué aislamiento precisas?" },
  sistema_afectado: { label: "Sist. Afectado", question: "¿Qué órgano afectas?" }
};

// Preloader
async function preloadAllImages() {
  const imageUrls = new Set();
  imageUrls.add('/images/card_back.png');
  characters.forEach(char => {
    rounds.forEach(r => {
      const cat = char.categories[r];
      if (cat) {
        if (cat.images) cat.images.forEach(img => imageUrls.add(resolvePath(img)));
        else if (cat.image) imageUrls.add(resolvePath(cat.image));
      }
    });
    if (char.infoImage) imageUrls.add(resolvePath(char.infoImage));
  });

  const promises = Array.from(imageUrls).map(url => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        resolve();
      };
    });
  });

  await Promise.all(promises);
}

// Global Overlay Helper
window.closeOverlay = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    el.style.display = 'none';

    // Game Flow Logic: After closing instructions on start
    if (id === 'instructions-overlay' && window.isGameSetup) {
      window.isGameSetup = false;
      // Only show target overlay in 1vs1 mode
      if (gameMode === '1vs1') {
        const startOverlay = document.getElementById('start-overlay');
        const targetNameDisplay = document.getElementById('target-name-display');
        const targetImageDisplay = document.getElementById('target-image-display');

        if (startOverlay && targetNameDisplay && targetChar) {
          targetNameDisplay.textContent = targetChar.name;
          if (targetImageDisplay) targetImageDisplay.src = resolvePath(targetChar.infoImage) || '';

          startOverlay.classList.remove('hidden');
          startOverlay.style.display = '';
        }
      }
    }
  }
};

window.openImage = (src, title) => {
  const overlay = document.getElementById('image-overlay');
  const img = document.getElementById('overlay-active-image');
  const titleEl = document.getElementById('overlay-active-title');
  const btnPrev = document.getElementById('btn-prev-image');
  const btnNext = document.getElementById('btn-next-image');

  if (overlay && img && titleEl) {
    const targetSrc = resolvePath(src);
    // Determine Index
    currentCarouselIndex = carouselItems.findIndex(item => resolvePath(item.src) === targetSrc);

    img.src = targetSrc;
    titleEl.textContent = title;

    // Toggle Arrows
    if (currentCarouselIndex === -1) {
      if (btnPrev) btnPrev.style.display = 'none';
      if (btnNext) btnNext.style.display = 'none';
    } else {
      if (btnPrev) btnPrev.style.display = 'flex';
      if (btnNext) btnNext.style.display = 'flex';
    }

    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }
};

window.nextImage = (e) => {
  if (currentCarouselIndex === -1 || carouselItems.length === 0) return;
  currentCarouselIndex = (currentCarouselIndex + 1) % carouselItems.length;
  const item = carouselItems[currentCarouselIndex];
  window.openImage(item.src, item.title); // Recursively acts as update
  if (e) e.stopPropagation();
};

window.prevImage = (e) => {
  if (currentCarouselIndex === -1 || carouselItems.length === 0) return;
  currentCarouselIndex = (currentCarouselIndex - 1 + carouselItems.length) % carouselItems.length;
  const item = carouselItems[currentCarouselIndex];
  window.openImage(item.src, item.title);
  if (e) e.stopPropagation();
};

window.openCarousel = (index = 0) => {
  if (carouselItems.length === 0) updateCarouselList(); // Ensure loaded
  if (index < 0) index = 0;
  if (index >= carouselItems.length) index = 0;

  const item = carouselItems[index];
  window.openImage(item.src, item.title);
};

window.showQuestion = (text, e) => {
  const overlay = document.getElementById('question-overlay');
  const textEl = document.getElementById('question-text');
  if (overlay && textEl) {
    textEl.textContent = text;
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }
  if (e && e.stopPropagation) e.stopPropagation();
};

// Helper: Generate Dynamic Segmented Icon
function generatePieIcon(count) {
  if (count <= 1) return 'none';
  const deg = 360 / count;
  const gap = 8;
  let parts = [];
  for (let i = 0; i < count; i++) {
    let start = i * deg;
    let end = (i + 1) * deg - gap;
    parts.push(`#00bcd4 ${start}deg ${end}deg`);
    parts.push(`transparent ${end}deg ${(i + 1) * deg}deg`);
  }
  return `conic-gradient(${parts.join(', ')})`;
}

// Helper: Get Front Content
function getCardFrontContent(char, category, index) {
  const categoryData = char.categories[category];
  const images = categoryData.images || (categoryData.image ? [categoryData.image] : ['/images/card_back.png']);
  const imageSrc = resolvePath(images[index] || images[0]);
  const infoSrc = resolvePath(char.infoImage || imageSrc);
  const categoryText = getCategoryText(char, category, index);

  const rawText = getRawCategoryText(char, category);
  const textCount = Array.isArray(rawText) ? rawText.length : 1;
  const total = Math.max(images.length, textCount);
  const isStacked = total > 1;
  const stackIcon = total >= 3
    ? '<span class="stack-visual stack-3"></span>'
    : (total === 2 ? '<span class="stack-visual stack-2"></span>' : '');

  const cycleBtn = isStacked
    ? `<div class="cycle-btn" onclick="cycleCardItem('${char.id}'); event.stopPropagation()">${stackIcon}+${total - 1} ↻</div>`
    : '';
  return `
    ${cycleBtn}
    <div class="character-name" onclick="openImage('${infoSrc}', '${char.name}'); event.stopPropagation()">${char.name}</div>
    <div class="card-category-text">${categoryText}</div>
    <img src="${imageSrc}" alt="${char.name}" onclick="openImage('${infoSrc}', '${char.name}'); event.stopPropagation()" style="cursor: pointer;">
  `;
}

window.cycleCardItem = (id) => {
  const char = characters.find(c => c.id === parseInt(id));
  if (!char) return;
  const catData = char.categories[activeCategory];
  const images = catData.images || (catData.image ? [catData.image] : []);

  const rawText = getRawCategoryText(char, activeCategory);
  const textCount = Array.isArray(rawText) ? rawText.length : 1;
  const total = Math.max(images.length, textCount);

  if (total <= 1) return;

  const currentIndex = cardSubIndices[char.id] || 0;
  const nextIndex = (currentIndex + 1) % total;

  // Update trigger question when cycling if it was the active trigger
  const oldQuestion = getQuestionText(char, activeCategory, currentIndex);
  const newQuestion = getQuestionText(char, activeCategory, nextIndex);
  if (activeTriggerQuestion === oldQuestion) {
    activeTriggerQuestion = newQuestion;
    updateBackgroundAnimationsTrigger();
  }

  const cardEl = document.querySelector(`.card[data-id="${char.id}"]`);
  if (cardEl) {
    const faces = cardEl.querySelectorAll('.card-face.card-front');
    const oldFace = faces.length > 0 ? faces[faces.length - 1] : null;

    if (oldFace) {
      oldFace.style.zIndex = '5';
    }

    const newFace = document.createElement('div');
    newFace.className = 'card-face card-front stack-enter';
    newFace.style.position = 'absolute';
    newFace.style.top = '0';
    newFace.style.left = '0';

    newFace.innerHTML = getCardFrontContent(char, activeCategory, nextIndex);

    // PREPEND: Start physically behind in DOM
    if (oldFace) {
      cardEl.insertBefore(newFace, oldFace);
    } else {
      cardEl.appendChild(newFace);
    }

    // Fit text for the new face
    const nameEl = newFace.querySelector('.character-name');
    if (nameEl) fitText(nameEl);

    // Fit category text too maybe?
    const catTextEl = newFace.querySelector('.card-category-text');
    if (catTextEl) fitText(catTextEl, 3.6, 1.0); // Custom helper usage if needed, or just leave css

    const onAnimationEnd = () => {
      cardSubIndices[char.id] = nextIndex;

      if (oldFace) oldFace.remove();

      // Clean transition
      newFace.classList.remove('stack-enter');
      newFace.style.zIndex = '';

      newFace.removeEventListener('animationend', onAnimationEnd);
    };

    newFace.addEventListener('animationend', onAnimationEnd);
  }

  event.stopPropagation();
};

function getFeedbackText(char, category) {
  let value = char.categories[category].text;
  if (Array.isArray(value)) value = value.join(', ');

  // Return the specific text directly as requested
  return value;
}

function getRawCategoryText(char, category) {
  if (!char) return null;
  switch (category) {
    case 'agente': return char.agentText;
    case 'transmision': return char.transmissionText;
    case 'prevencion_ciudadana': return char.prevencion_ciudadanaText;
    case 'prevencion_hospitalaria': return char.prevencion_hospitalariaText;
    case 'sistema_afectado': return char.sistema_afectadoText;
  }
  return null;
}

function getCategoryText(char, category, index = 0) {
  const text = getRawCategoryText(char, category);

  if (Array.isArray(text)) {
    return text[index] || text[0] || '';
  }
  return text || '';
}

function getQuestionText(char, category, index = 0) {
  let value = char.categories[category].text;
  if (Array.isArray(value)) value = value[index] || value[0];

  switch (category) {
    case 'agente': return `¿Soy un ${value}?`;
    case 'transmision': return `¿Me transmito por ${value}?`;
    case 'prevencion_ciudadana': return `¿Me prevengo con ${value}?`;
    case 'prevencion_hospitalaria': return `¿Necesito ${value}?`;
    case 'sistema_afectado': return `¿Afecto al sistema ${value}?`;
    default: return "¿?";
  }
}

// Helper: Check if a character has a specific question available in a category
function hasQuestionInCategory(char, category, targetQuestion) {
  const raw = getRawCategoryText(char, category);
  if (!raw) return false;
  const list = Array.isArray(raw) ? raw : [raw];
  return list.includes(targetQuestion);
}

// Helper: Fit Text to Container with Vertical Center logic
function fitText(el, initialSize = 3.6, minSize = 0.8) {
  if (!el) return;
  // Reset for calculation
  el.style.fontSize = `${initialSize}vmin`;
  el.style.whiteSpace = 'normal'; // Allow wrapping as requested
  el.style.alignItems = 'center'; // Ensure vertically centered flex
  el.style.display = 'flex';

  let size = initialSize;

  // Check if overflowing VERTICALLY primarily, or horizontally if single word
  // We use scrollHeight > clientHeight as the main constraint for multi-line text
  while (
    (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) &&
    size > minSize
  ) {
    size -= 0.1;
    el.style.fontSize = `${size}vmin`;
  }
}

// Helper: Get Character Type
function getCharacterType(char) {
  if (char.agentText.includes('virus')) return 'virus';
  if (char.agentText.includes('bacteria')) return 'bacteria';
  if (char.agentText.includes('hongo')) return 'fungus';
  if (char.agentText.includes('parásito')) return 'parasite';
  return 'unknown';
}

function renderGrid() {
  const container = document.querySelector('#grid');
  container.innerHTML = characters.map(char => {
    const subIndex = cardSubIndices[char.id] || 0;
    const categoryData = char.categories[activeCategory];
    const images = categoryData.images || [];

    const rawText = getRawCategoryText(char, activeCategory);
    const textCount = Array.isArray(rawText) ? rawText.length : 1;
    const isStacked = Math.max(images.length, textCount) > 1;
    const stackedClass = isStacked ? 'stacked' : '';
    const type = getCharacterType(char);

    // Back Face Content
    const feedbackText = getFeedbackText(char, activeCategory);
    // Info src uses the current subIndex image
    const rawImg = (categoryData.images && categoryData.images[subIndex]) || categoryData.image || '/images/card_back.png';
    const currentImg = resolvePath(rawImg);
    const infoSrc = resolvePath(char.infoImage || rawImg);
    const questionText = getQuestionText(char, activeCategory, subIndex);

    const currentQuestion = getQuestionText(char, activeCategory, subIndex);
    const isAnimated = activeTriggerQuestion && !flippedStates.has(char.id) && currentQuestion === activeTriggerQuestion;
    const animTag = isAnimated && animConfigs[type]
      ? `<div class="card-bg-anim" data-id="${char.id}" data-type="${type}"><img src="${resolvePath(animConfigs[type].dir + '/char0.png')}" alt="anim"></div>`
      : '';

    // Front Content is generated by helper
    const frontContent = getCardFrontContent(char, activeCategory, subIndex);

    return `
      <div class="card-container ${isAnimated ? 'is-candidate' : ''}">
        ${animTag}
        <div class="card ${stackedClass}" data-id="${char.id}" data-type="${type}">
          <div class="card-face card-front">
            ${frontContent}
          </div>
          <div class="card-face card-back">
            <div class="character-name-back" onclick="openImage('${infoSrc}', '${char.name}'); event.stopPropagation()">No eres ${char.name}</div>
            <div class="feedback-text">${feedbackText}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-attach card listeners
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
  });

  const currentFlipped = flippedStates;
  if (currentFlipped.size > 0) {
    let delay = 0;
    cards.forEach(card => {
      const id = parseInt(card.dataset.id);
      if (currentFlipped.has(id)) {
        setTimeout(() => {
          card.classList.add('is-flipped');
        }, delay);
        delay += 50;
      }
    });
  }

  // Adjust font sizes
  document.querySelectorAll('.character-name, .character-name-back').forEach(el => fitText(el, 2.5, 0.8));
  document.querySelectorAll('.card-category-text').forEach(el => fitText(el, 3.6, 1.0));
}

// Game State Extras
let winTimeout = null;
let hasShownEndGameForCurrentState = false;

function updateBackgroundAnimationsTrigger() {
  const allContainers = document.querySelectorAll('.card-container');
  allContainers.forEach(container => {
    const card = container.querySelector('.card');
    const id = parseInt(card.dataset.id);
    const char = characters.find(c => c.id === id);
    const type = getCharacterType(char);

    // Check if THIS card has the activeTriggerQuestion anywhere in the current category
    const isAnimated = activeTriggerQuestion && !flippedStates.has(id) && hasQuestionInCategory(char, activeCategory, activeTriggerQuestion);
    const currentAnim = container.querySelector('.card-bg-anim');

    if (isAnimated) {
      // console.log(`Card ${id} matches trigger: ${activeTriggerQuestion}`);
      if (!currentAnim || currentAnim.classList.contains('fade-out')) {
        if (currentAnim) currentAnim.remove();
        const animTag = `<div class="card-bg-anim" data-id="${id}" data-type="${type}"><img src="${resolvePath(animConfigs[type].dir + '/char0.png')}" alt="anim"></div>`;
        container.insertAdjacentHTML('afterbegin', animTag);
        container.classList.add('is-candidate');
      }
    } else {
      if (currentAnim && !currentAnim.classList.contains('fade-out')) {
        currentAnim.classList.add('fade-out');
        container.classList.remove('is-candidate');
        setTimeout(() => {
          if (currentAnim.parentNode === container) currentAnim.remove();
        }, 500);
      }
    }
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;
  const id = parseInt(card.dataset.id);
  const char = characters.find(c => c.id === id);
  const subIndex = cardSubIndices[id] || 0;

  // Interaction logic for indicators
  if (!card.classList.contains('is-flipped')) {
    // Clicking a face-up card: Activate its group indicators
    const rawQuestions = getRawCategoryText(char, activeCategory);
    const triggerQuestion = Array.isArray(rawQuestions) ? rawQuestions[subIndex] : rawQuestions;
    if (triggerQuestion && triggerQuestion !== activeTriggerQuestion) {
      activeTriggerQuestion = triggerQuestion;
    }
  } else {
    // Clicking a face-down card: Clear all active indicators
    activeTriggerQuestion = null;
  }

  if (card.classList.contains('is-flipped')) {
    card.classList.remove('is-flipped');
    flippedStates.delete(id);
  } else {
    card.classList.add('is-flipped');
    flippedStates.add(id);

    // Fade out background animation specifically for this card
    const container = card.parentElement;
    const anim = container.querySelector('.card-bg-anim');
    if (anim) {
      anim.classList.add('fade-out');
      setTimeout(() => anim.remove(), 550);
    }
  }

  // Surgical update for all animations
  updateBackgroundAnimationsTrigger();

  // Progress Logic
  updateProgress();
  checkWinCondition();
}

function updateProgress() {
  const total = characters.length;
  const flipped = flippedStates.size;
  const up = total - flipped;
  const percentage = (flipped / total) * 100;

  const bar = document.querySelector('.progress-fill');
  if (bar) {
    bar.style.width = `${percentage}%`;
    bar.className = 'progress-fill'; // Reset classes

    if (up <= 3 && up > 1) bar.classList.add('blink-slow');
    if (up <= 2 && up > 1) bar.classList.add('blink-fast'); // If 2, effectively blink fast override
  }
}

function checkWinCondition() {
  const total = characters.length;
  const flipped = flippedStates.size;
  const up = total - flipped;

  // If we went back up to > 1 card, reset the latch
  if (up > 1) {
    hasShownEndGameForCurrentState = false;
    if (winTimeout) clearTimeout(winTimeout);
  }

  // If exactly 1 card left and we haven't shown it yet
  if (up === 1 && !hasShownEndGameForCurrentState) {
    if (winTimeout) clearTimeout(winTimeout);
    winTimeout = setTimeout(() => {
      // Double check state hasn't changed
      const currentUp = characters.length - flippedStates.size;
      if (currentUp === 1) {
        hasShownEndGameForCurrentState = true;
        document.getElementById('endgame-overlay').classList.remove('hidden');
        document.getElementById('endgame-overlay').style.display = 'flex';
      }
    }, 2000);
  }
}

// Simple Confetti Implementation
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

  for (let i = 0; i < 200; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      speed: Math.random() * 5 + 2,
      angle: Math.random() * 6.28
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += Math.sin(p.angle);
      p.angle += 0.1;
      if (p.y > canvas.height) p.y = -20;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// SVG Icons
const icons = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
  agente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M6 6l12 12M6 18L18 6"/></svg>', // Virus-like
  transmision: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>', // Exchange arrows
  prevencion_ciudadana: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', // Shield
  prevencion_hospitalaria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 4"/></svg>', // Cross/Hospital
  sistema_afectado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' // Heart/Organ
};

function renderGameUI() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="container fade-in">
      <!-- Nav Layout -->
      <div class="nav-bar">
        <!-- Landscape Nav: Text Buttons -->
        <div class="nav-landscape">
          <div class="nav-group left">
            <button class="nav-btn nav-btn-light" id="btn-group">Grupo</button>
            <button class="nav-btn nav-btn-light" id="btn-instructions">Instrucciones</button>
          </div>
          <div class="nav-group right">
             <button class="nav-btn nav-btn-light" id="btn-enfermedades">Enfermedades</button>
             ${gameMode === '1vs1' ? '<button class="nav-btn nav-btn-red" id="btn-oponente">Enfermedad Oponente</button>' : ''}
          </div>
        </div>

        <!-- Portrait Nav: Hamburger + Text Tabs -->
        <div class="nav-portrait">
          <button class="icon-btn-menu" id="btn-hamburger">${icons.menu}</button>
          <div class="portrait-categories">
            ${rounds.map(r => `
              <button class="cat-text-btn ${activeCategory === r ? 'active' : ''}" data-category="${r}">
                ${roundConfig[r].label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Landscape Category Tabs (Original) -->
      <div class="tabs-container landscape-only">
        ${rounds.map(r => `
          <div class="tab ${activeCategory === r ? 'active' : ''}" data-category="${r}">
            ${roundConfig[r].label}
          </div>
        `).join('')}
      </div>

      <!-- Mobile/Portrait Menu Overlay (triggered by Hamburger) -->
      <div id="mobile-menu-overlay" class="hidden">
        <div class="mobile-menu-panel">
          <button class="nav-btn nav-btn-light full-width" id="mob-btn-group">Grupo</button>
          <button class="nav-btn nav-btn-light full-width" id="mob-btn-instructions">Instrucciones</button>
          <button class="nav-btn nav-btn-red full-width" id="mob-btn-oponente">Enfermedad Oponente</button>
          <button class="nav-btn nav-btn-close full-width" id="mob-btn-close">Cerrar</button>
        </div>
      </div>
      
      <!-- Ending Overlay -->
      <!-- Ending Overlay -->
      <div id="endgame-overlay" class="hidden overlay-dark-bg">
         <h1 class="overlay-title">¿Has adivinado qué enfermedad eres?</h1>
         <div class="overlay-actions">
           <button class="action-btn yes-btn" id="btn-end-yes">¡SÍ!</button>
           <button class="action-btn no-btn" id="btn-end-no">NO</button>
         </div>
      </div>
      
      <!-- Celebrations Overlay -->
      <div id="celebration-overlay" class="hidden">
         <h1 class="overlay-title">¡ENHORABUENA!</h1>
         <canvas id="confetti-canvas"></canvas>
         <button class="action-btn restart-btn" id="btn-restart">Empezar de nuevo</button>
      </div>

      <!-- Progress Bar Container -->
      <div class="progress-container">
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
        <div class="progress-goal">
          <img id="goal-icon" src="${resolvePath('images/switch/char0.png')}" alt="goal">
        </div>
      </div>
      
      <div class="card-grid" id="grid"></div>
    </div>
  `;

  renderGrid();
  updateProgress();

  // --- Event Listeners ---

  const handleCategory = (cat) => {
    if (cat !== activeCategory) {
      activeCategory = cat;
      cardSubIndices = {};
      activeTriggerQuestion = null; // Reset animations on category change
      renderGameUI();
    }
  };

  // Landscape Tabs
  document.querySelectorAll('.tab').forEach(el =>
    el.addEventListener('click', (e) => handleCategory(e.target.dataset.category)));

  // Portrait Text Tabs
  document.querySelectorAll('.cat-text-btn').forEach(el =>
    el.addEventListener('click', (e) => handleCategory(e.currentTarget.dataset.category)));

  // Mobile Menu Logic
  const mobMenu = document.getElementById('mobile-menu-overlay');

  // Open Menu
  document.getElementById('btn-hamburger')?.addEventListener('click', () => {
    mobMenu.classList.remove('hidden');
  });

  // Close Menu
  document.getElementById('mob-btn-close')?.addEventListener('click', () => {
    mobMenu.classList.add('hidden');
  });

  // Mobile Menu Actions
  const openOverlay = (id) => {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).style.display = '';
    mobMenu.classList.add('hidden'); // Close menu after selection
  };

  // Re-attach listeners for both Desktop and Mobile buttons (using helper to avoid duplication?)
  // Desktop
  document.getElementById('btn-group')?.addEventListener('click', () => openOverlay('group-overlay'));
  document.getElementById('btn-instructions')?.addEventListener('click', () => openOverlay('instructions-overlay'));

  // Mobile
  document.getElementById('mob-btn-group')?.addEventListener('click', () => openOverlay('group-overlay'));
  document.getElementById('mob-btn-instructions')?.addEventListener('click', () => openOverlay('instructions-overlay'));

  // Opponent Logic (Shared)
  const showOpponent = () => {
    const overlay = document.getElementById('start-overlay');
    const targetNameDisplay = document.getElementById('target-name-display');
    const targetImageDisplay = document.getElementById('target-image-display');

    if (targetNameDisplay && targetChar) {
      targetNameDisplay.textContent = targetChar.name;
      if (targetImageDisplay) targetImageDisplay.src = resolvePath(targetChar.infoImage) || '';
    }
    overlay.classList.remove('hidden');
    overlay.style.display = '';
    mobMenu.classList.add('hidden');
  };

  document.getElementById('btn-oponente')?.addEventListener('click', showOpponent);
  document.getElementById('mob-btn-oponente')?.addEventListener('click', showOpponent);

  // Carousel Button
  document.getElementById('btn-enfermedades')?.addEventListener('click', () => {
    window.openCarousel(0); // Start from Intro 0
  });

  // End Game Buttons
  document.getElementById('btn-end-yes')?.addEventListener('click', () => {
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('endgame-overlay').classList.add('hidden');
    document.getElementById('endgame-overlay').style.display = 'none';
    document.getElementById('celebration-overlay').classList.remove('hidden');
    document.getElementById('celebration-overlay').style.display = 'flex';
    startConfetti();
  });

  document.getElementById('btn-end-no')?.addEventListener('click', () => {
    document.getElementById('endgame-overlay').classList.add('hidden');
    document.getElementById('endgame-overlay').style.display = 'none';
    // Resume play
  });

  document.getElementById('btn-restart')?.addEventListener('click', () => {
    window.location.reload();
  });
}

// Initialize Game
// Home Screen Animation Control
let homeAnimInterval = null;

function startHomeAnimation() {
  const img = document.getElementById('home-anim-img');
  if (!img) return;

  // Preload frames logic could go here but let's trust browser cache for simple loop
  let frame = 1;
  const totalFrames = 21; // Updated to 21 chars
  const fps = 12;

  const updateFrame = () => {
    // Filename format: char1.png to char21.png
    const path = `images/group/char${frame}.png`;
    img.src = resolvePath(path);
    frame = (frame % totalFrames) + 1;
  };

  updateFrame(); // First immediately
  homeAnimInterval = setInterval(updateFrame, 1000 / fps);
}

function stopHomeAnimation() {
  if (homeAnimInterval) {
    clearInterval(homeAnimInterval);
    homeAnimInterval = null;
  }
}

// Initialize Game
async function initGame() {
  console.log('Game Initializing...');
  startHomeAnimation();

  characters.sort(() => Math.random() - 0.5);
  targetChar = characters[Math.floor(Math.random() * characters.length)];
  activeCategory = 'agente';

  try {
    updateCarouselList(); // Init Carousel Images
    startGoalAnimation();
    startCardAnimations();
  } catch (e) {
    console.error('Animation initialization failed:', e);
  }

  // Setup DOM elements
  const modeOverlay = document.getElementById('mode-selection-overlay');
  const startOverlay = document.getElementById('start-overlay');
  const targetNameDisplay = document.getElementById('target-name-display');
  const btn1vs1 = document.getElementById('btn-mode-1vs1');
  const btnTeacher = document.getElementById('btn-mode-teacher');

  // Start Logic
  const startTheGame = () => {
    try {
      stopHomeAnimation();
      if (modeOverlay) {
        modeOverlay.classList.add('hidden');
        modeOverlay.style.display = 'none';
      }
      renderGameUI();

      window.isGameSetup = true;
      const instructionsOverlay = document.getElementById('instructions-overlay');
      if (instructionsOverlay) {
        updateInstCarousel(); // Initialize carousel content
        instructionsOverlay.classList.remove('hidden');
        instructionsOverlay.style.display = 'flex';
      }
    } catch (e) {
      console.error('Failed to start game:', e);
    }
  };

  // Attach Listeners Immediately
  if (btn1vs1) {
    btn1vs1.addEventListener('click', () => {
      gameMode = '1vs1';
      startTheGame();
    });
  }

  if (btnTeacher) {
    btnTeacher.addEventListener('click', () => {
      gameMode = 'teacher';
      startTheGame();
    });
  }

  // Preload images in background (non-blocking) to improve experience once playing starts
  preloadAllImages().catch(e => console.warn('Image preload warning:', e));
}

// Start
initGame();
