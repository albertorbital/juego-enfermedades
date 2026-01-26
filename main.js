import './style.css'
import { characters } from './characters.js'

// Helper to resolve paths for GitHub Pages (base URL)
const resolvePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Remove leading slash if present to avoid double slashes with BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

// Game State
let targetChar = null;
let activeCategory = 'agente'; // Default category
let gameMode = '1vs1'; // Default mode
const flippedStates = new Set(); // Global state for all categories
let cardSubIndices = {}; // Track sub-index for multi-item cards
let lastCycledId = null; // Track last cycled card for animation

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

  if (overlay && img && titleEl) {
    img.src = src;
    titleEl.textContent = title;
    overlay.classList.remove('hidden');
    overlay.style.display = '';
  }
  event.stopPropagation();
};

window.showQuestion = (text) => {
  const overlay = document.getElementById('question-overlay');
  const textEl = document.getElementById('question-text');
  if (overlay && textEl) {
    textEl.textContent = text;
    overlay.classList.remove('hidden');
    overlay.style.display = '';
  }
  event.stopPropagation();
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
  const questionText = getQuestionText(char, category, index);

  const total = images.length;
  const isStacked = total > 1;
  const cycleBtn = isStacked
    ? `<div class="cycle-btn" onclick="cycleCardItem('${char.id}'); event.stopPropagation()">+${total - 1} ↻</div>`
    : '';

  return `
    ${cycleBtn}
    <div class="character-name" onclick="openImage('${infoSrc}', '${char.name}'); event.stopPropagation()">${char.name}</div>
    <img src="${imageSrc}" alt="${char.name}">
  `;
}

window.cycleCardItem = (id) => {
  const char = characters.find(c => c.id === parseInt(id));
  if (!char) return;
  const catData = char.categories[activeCategory];
  const images = catData.images || (catData.image ? [catData.image] : []);

  if (images.length <= 1) return;

  const currentIndex = cardSubIndices[char.id] || 0;
  const nextIndex = (currentIndex + 1) % images.length;

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

// Helper: Fit Text to Container
function fitText(el) {
  if (!el) return;
  // Reset to default first
  el.style.fontSize = '';
  el.style.whiteSpace = 'nowrap';

  let size = 2.5; // Default vmin
  const minSize = 0.8; // Minimum readable size

  // Check if overflowing
  while (el.scrollWidth > el.clientWidth && size > minSize) {
    size -= 0.1;
    el.style.fontSize = `${size}vmin`;
  }
}

function renderGrid() {
  const container = document.querySelector('#grid');
  container.innerHTML = characters.map(char => {
    const subIndex = cardSubIndices[char.id] || 0;
    const categoryData = char.categories[activeCategory];
    const images = categoryData.images || [];
    const isStacked = images.length > 1;
    const stackedClass = isStacked ? 'stacked' : '';

    // Back Face Content
    const feedbackText = getFeedbackText(char, activeCategory);
    // Info src uses the current subIndex image
    const rawImg = (categoryData.images && categoryData.images[subIndex]) || categoryData.image || '/images/card_back.png';
    const currentImg = resolvePath(rawImg);
    const infoSrc = resolvePath(char.infoImage || rawImg);
    const questionText = getQuestionText(char, activeCategory, subIndex);

    // Front Content is generated by helper
    const frontContent = getCardFrontContent(char, activeCategory, subIndex);

    return `
      <div class="card-container">
        <div class="card ${stackedClass}" data-id="${char.id}">
          <div class="card-face card-front">
            ${frontContent}
          </div>
          <div class="card-face card-back">
            <div class="character-name-back" onclick="openImage('${infoSrc}', '${char.name}'); event.stopPropagation()">${char.name}</div>
            <div class="eliminated-mark">X</div>
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
  document.querySelectorAll('.character-name, .character-name-back').forEach(fitText);
}

function handleCardClick(e) {
  const card = e.currentTarget;
  const id = parseInt(card.dataset.id);

  if (card.classList.contains('is-flipped')) {
    card.classList.remove('is-flipped');
    flippedStates.delete(id);
  } else {
    card.classList.add('is-flipped');
    flippedStates.add(id);
  }
}

function renderGameUI() {
  const config = roundConfig[activeCategory];

  document.querySelector('#app').innerHTML = `
    <div class="container">
      <div class="nav-bar">
        <div class="nav-group left">
          <div class="tab nav-btn" id="btn-group">Grupo</div>
          <div class="tab nav-btn" id="btn-oponente" style="${gameMode === '1vs1' ? '' : 'display:none'}">Oponente</div>
        </div>

        <div class="tabs-container">
          ${rounds.map(r => {
    const isActive = r === activeCategory ? 'active' : '';
    return `<div class="tab ${isActive}" data-category="${r}">${roundConfig[r].label}</div>`;
  }).join('')}
        </div>

        <div class="nav-group right">
          <div class="tab nav-btn" id="btn-instructions">Instrucciones</div>
        </div>
      </div>
      
      <h1 class="title">${config.question}</h1>
      
      <div class="card-grid" id="grid"></div>
    </div>
  `;

  renderGrid();

  document.querySelectorAll('.tab:not(.nav-btn)').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const newCategory = e.target.dataset.category;
      if (newCategory !== activeCategory) {
        activeCategory = newCategory;
        cardSubIndices = {};
        renderGameUI();
      }
    });
  });

  const groupBtn = document.getElementById('btn-group');
  if (groupBtn) {
    groupBtn.addEventListener('click', () => {
      const overlay = document.getElementById('group-overlay');
      overlay.classList.remove('hidden');
      overlay.style.display = '';
    });
  }

  const instructionsBtn = document.getElementById('btn-instructions');
  if (instructionsBtn) {
    instructionsBtn.addEventListener('click', () => {
      const overlay = document.getElementById('instructions-overlay');
      overlay.classList.remove('hidden');
      overlay.style.display = '';
    });
  }

  const oponenteBtn = document.getElementById('btn-oponente');
  if (oponenteBtn) {
    oponenteBtn.addEventListener('click', () => {
      const overlay = document.getElementById('start-overlay');
      // Ensure we re-set the target name just in case
      const targetNameDisplay = document.getElementById('target-name-display');
      const targetImageDisplay = document.getElementById('target-image-display');

      if (targetNameDisplay && targetChar) {
        targetNameDisplay.textContent = targetChar.name;
        if (targetImageDisplay) targetImageDisplay.src = resolvePath(targetChar.infoImage) || '';
      }
      overlay.classList.remove('hidden');
      overlay.style.display = '';
    });
  }
}

// Initialize Game
// Initialize Game
async function initGame() {
  // Initialize game state immediately
  characters.sort(() => Math.random() - 0.5);
  targetChar = characters[Math.floor(Math.random() * characters.length)];
  activeCategory = 'agente';

  // Setup DOM elements
  const modeOverlay = document.getElementById('mode-selection-overlay');
  const startOverlay = document.getElementById('start-overlay');
  const targetNameDisplay = document.getElementById('target-name-display');
  const btn1vs1 = document.getElementById('btn-mode-1vs1');
  const btnTeacher = document.getElementById('btn-mode-teacher');

  // Start Logic
  const startTheGame = () => {
    if (modeOverlay) {
      modeOverlay.classList.add('hidden');
      modeOverlay.style.display = 'none';
    }
    // Render the initial game state
    // Render the initial game state
    renderGameUI();

    // Game Start Flow: Instructions First
    window.isGameSetup = true;
    const instructionsOverlay = document.getElementById('instructions-overlay');
    if (instructionsOverlay) {
      instructionsOverlay.classList.remove('hidden');
      instructionsOverlay.style.display = '';
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
