document.addEventListener('DOMContentLoaded', () => {
  // Cinematic fade-up scroll observer
  const animatedElements = document.querySelectorAll('.fade-up');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));

  // Dynamic navbar styling on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Floating Cello Audio Player logic
  const celloPlayer = document.getElementById('cello-player');
  const audioEl = document.getElementById('audio-element');
  const playBtn = document.getElementById('play-pause-btn');
  
  let isPlaying = false;

  if (celloPlayer && audioEl) {
    celloPlayer.addEventListener('click', () => {
      if (!isPlaying) {
        audioEl.play().then(() => {
          isPlaying = true;
          playBtn.textContent = '❚❚';
          celloPlayer.classList.add('playing');
        }).catch(err => {
          console.warn("Autoplay / Audio error:", err);
          alert('Por favor, activa el sonido en tu navegador para escuchar a Nara 🎻.');
        });
      } else {
        audioEl.pause();
        isPlaying = false;
        playBtn.textContent = '▶';
        celloPlayer.classList.remove('playing');
      }
    });
  }

  // Internationalization (i18n) Logic
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  let currentLang = localStorage.getItem('nara-lang') || 'es';

  function updateLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        // If element contains layout styling spans or emphasis tags, use innerHTML
        if (el.querySelector('strong') || el.querySelector('i') || el.querySelector('span') || translations[lang][key].includes('<')) {
          el.innerHTML = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    // Update document title
    if (translations[lang]['meta-title']) {
      document.title = translations[lang]['meta-title'];
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations[lang]['meta-description']) {
      metaDesc.setAttribute('content', translations[lang]['meta-description']);
    }

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update title tags
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[lang][key]) {
        el.setAttribute('title', translations[lang][key]);
      }
    });

    // Update lang button
    if (langBtn) {
      langBtn.innerHTML = `${lang.toUpperCase()} <span class="arrow">▼</span>`;
    }

    // Save choice
    localStorage.setItem('nara-lang', lang);
    currentLang = lang;
  }

  if (langDropdown) {
    if (langBtn) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
      });
    }

    document.addEventListener('click', () => {
      langDropdown.classList.remove('show');
    });

    langDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = link.getAttribute('data-lang');
        updateLanguage(selectedLang);
        langDropdown.classList.remove('show');
      });
    });
  }

  // Initialize lang
  if (typeof translations !== 'undefined') {
    updateLanguage(currentLang);
  }

  // High Conversion Lead Form handling
  const leadForm = document.getElementById('lead-form');
  const formSuccess = document.getElementById('form-success');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const goalEl = document.getElementById('lead-goal');
      const goal = goalEl.options[goalEl.selectedIndex].text;
      const submitBtn = leadForm.querySelector('button[type="submit"]');

      const oldText = submitBtn.innerHTML;
      const connectingText = (typeof translations !== 'undefined' && translations[currentLang]['form-connecting']) 
        ? translations[currentLang]['form-connecting'] 
        : '⏳ Conectando...';

      submitBtn.innerHTML = connectingText;
      submitBtn.style.opacity = '0.8';
      submitBtn.disabled = true;

      setTimeout(() => {
        leadForm.style.display = 'none';
        formSuccess.style.display = 'block';

        const titleTemplate = (typeof translations !== 'undefined' && translations[currentLang]['form-success-title'])
          ? translations[currentLang]['form-success-title']
          : '🎶 ¡Excelente decisión, {name}!';
        
        const descTemplate = (typeof translations !== 'undefined' && translations[currentLang]['form-success-desc'])
          ? translations[currentLang]['form-success-desc']
          : 'Hemos registrado exitosamente tu solicitud.';

        formSuccess.innerHTML = `
          <p style="font-size: 1.3rem; font-family: 'Cormorant Garamond', serif; color: #FFF; margin-bottom: 0.5rem;">
            ${titleTemplate.replace('{name}', name)}
          </p>
          <p style="font-size: 1rem; color: #B3B0A9; line-height: 1.6;">
            ${descTemplate.replace('{goal}', goal)}
          </p>
        `;
      }, 1200);
    });
  }
});
