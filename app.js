// ========= ¿Ya es 14 de febrero (hora local)? =========
function isBeforeValentineToday(now = new Date()) {
  const y = now.getFullYear();
  const val = new Date(y, 1, 14, 0, 0, 0, 0); // 14 feb 00:00
  return now < val;
}


// ========= Utilidad: leer parámetros de la URL =========
function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    from: (p.get('from') || 'Gianfranco').trim(),
    to: (p.get('to') || 'Karolay').trim()
  };
}

// ========= Efecto máquina de escribir =========
function typewrite(el, text, speed = 26) {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text.charAt(i++);
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

// ========= Canvas de corazones flotantes =========
function startHeartsCanvasOn(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, hearts = [];
  const maxHearts = 60;

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.clientWidth = innerWidth;
    h = canvas.clientHeight = innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hearts = hearts || [];
    while (hearts.length < maxHearts) hearts.push(newHeart());
  }
  function newHeart() {
    const size = Math.random() * 2 + 1.2;
    return {
      x: Math.random() * w,
      y: h + Math.random() * h,
      size,
      speed: Math.random() * .6 + .2,
      drift: (Math.random() - .5) * .6,
      hue: 340 + Math.random() * 20,
      alpha: Math.random() * .6 + .2
    };
  }
  function drawHeart(x, y, s, color, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.fillRect(-s, 0, s * 2, s * 2);
    ctx.beginPath();
    ctx.arc(0, 0, s, Math.PI, 0);
    ctx.arc(0, s, s, Math.PI, 0);
    ctx.fill();
    ctx.restore();
  }
  function step() {
    ctx.clearRect(0, 0, w, h);
    hearts.forEach(hh => {
      hh.y -= hh.speed;
      hh.x += hh.drift;
      if (hh.y < -10) Object.assign(hh, newHeart(), { y: h + 10 });
      drawHeart(hh.x, hh.y, hh.size, `hsla(${hh.hue} 90% 60% / 0.8)`, hh.alpha);
    });
    requestAnimationFrame(step);
  }
  addEventListener('resize', resize, { passive: true });
  resize();
  step();
}


function startHeartsCanvas() {
  const canvas = document.getElementById('hearts-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, hearts;
  const maxHearts = 60;

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.clientWidth = innerWidth;
    h = canvas.clientHeight = innerHeight;

    // Escalado hi-dpi para evitar 1px gaps y aliasing
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    hearts = hearts || [];
    while (hearts.length < maxHearts) hearts.push(newHeart());
  }

  function newHeart() {
    const size = Math.random() * 2 + 1.2;
    return {
      x: Math.random() * w,
      y: h + Math.random() * h,
      size,
      speed: Math.random() * .6 + .2,
      drift: (Math.random() - .5) * .6,
      hue: 340 + Math.random() * 20,
      alpha: Math.random() * .6 + .2
    };
  }

  function drawHeart(x, y, s, color, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.fillRect(-s, 0, s * 2, s * 2);
    ctx.beginPath();
    ctx.arc(0, 0, s, Math.PI, 0);
    ctx.arc(0, s, s, Math.PI, 0);
    ctx.fill();
    ctx.restore();
  }

  function step() {
    // Limpieza completa con valores exactos
    ctx.clearRect(0, 0, w, h);
    hearts.forEach(hh => {
      hh.y -= hh.speed;
      hh.x += hh.drift;
      if (hh.y < -10) Object.assign(hh, newHeart(), { y: h + 10 });
      drawHeart(hh.x, hh.y, hh.size, `hsla(${hh.hue} 90% 60% / 0.8)`, hh.alpha);
    });
    requestAnimationFrame(step);
  }

  addEventListener('resize', resize, { passive: true });
  resize();
  step();
}

// ========= Confeti de corazones =========
function heartsConfetti(duration = 99999) {
  const end = Date.now() + duration;
  const make = () => {
    const h = document.createElement('div');
    h.className = 'heart-confetti';
    h.style.left = Math.random() * innerWidth + 'px';
    h.style.top = '-20px';
    h.style.background = `hsl(${340 + Math.random() * 20} 90% 60%)`;
    document.body.appendChild(h);

    const rotate = (Math.random() * 40 - 20);
    const xDrift = (Math.random() * 60 - 30);
    const time = 1000 + Math.random() * 1200;
    h.animate([
      { transform: `translate(0,0) rotate(45deg)`, opacity: 1 },
      { transform: `translate(${xDrift}px, ${innerHeight + 60}px) rotate(${45 + rotate}deg)`, opacity: .8 }
    ], { duration: time, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => h.remove(), time + 20);
  };

  const interval = setInterval(() => {
    for (let i = 0; i < 4; i++) make();
    if (Date.now() > end) clearInterval(interval);
  }, 80);
}

// ========= Toggle de tema =========
function setupThemeToggle() {
  const btn = document.getElementById('toggleThemeBtn');
  if (!btn) return;
  const root = document.documentElement;
  const stored = localStorage.getItem('val-theme');
  if (stored === 'light') root.classList.add('light');

  const updateIcon = () => {
    btn.textContent = root.classList.contains('light') ? '🌙' : '☀️';
    btn.setAttribute('aria-pressed', root.classList.contains('light') ? 'true' : 'false');
  };
  updateIcon();

  btn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('val-theme', root.classList.contains('light') ? 'light' : 'dark');
    updateIcon();
  });
}

// ========= Texto de introducción =========
function buildIntroText({ from, to }) {
  return (
    `Hola ${to} ❤️

Tenía ganas de regalarte un momento bonito.
No es algo enorme, pero está hecho con mucho amor.

Si estás lista, hacé clic en "Abrir mi mensaje".`
  );
}

// ========= Mover botón NO a posición aleatoria por TODA la pantalla =========
function moveNoButton(noBtn) {
  const btnWidth = noBtn.offsetWidth || 160;
  const btnHeight = noBtn.offsetHeight || 48;

  // Márgenes para que no se salga de la pantalla
  const margin = 20;
  const maxX = window.innerWidth - btnWidth - margin;
  const maxY = window.innerHeight - btnHeight - margin;

  // Posición aleatoria
  const newX = margin + Math.random() * (maxX - margin);
  const newY = margin + Math.random() * (maxY - margin);

  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
}

// ========= Utilidad: fecha objetivo 14 de febrero =========
function nextValentine(now = new Date()) {
  // Ajuste: usar zona horaria local del navegador (CR GMT-6 en tu caso)
  const year = now.getFullYear();
  const target = new Date(year, 1, 14, 0, 0, 0, 0); // Mes 1 = Febrero
  return (now > target) ? new Date(year + 1, 1, 14, 0, 0, 0, 0) : target;
}

// ========= Formato natural "Faltan X días, Y horas y Z minutos..." =========
function formatDHMS(ms) {
  ms = Math.max(0, ms);

  const totalSeconds = Math.floor(ms / 1000);
  let remaining = totalSeconds;

  const days = Math.floor(remaining / 86400); remaining %= 86400;
  const hours = Math.floor(remaining / 3600); remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  // Arma las partes, omitiendo las que son 0
  const parts = [];
  if (days) parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  if (seconds || parts.length === 0) // siempre mostrar segundos al final
    parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);

  // Unión con comas y "y" final: "A, B y C"
  const human =
    parts.length > 1
      ? parts.slice(0, -1).join(', ') + ' y ' + parts.slice(-1)
      : parts[0];

  // Nota: en 0 decimos "¡Hoy celebramos...!" (lo manejamos en el tick)
  return `Faltan ${human} para celebrar el Día de San Valentín`;
}

// ========= Inicia y mantiene el contador =========
function startValentineCountdown() {
  const elOverlay = document.getElementById('val-countdown');
  const elMain = document.getElementById('val-countdown-main');
  if (!elOverlay && !elMain) return;

  let target = nextValentine(new Date());

  const tick = () => {
    const now = new Date();
    const diff = target - now;
    // Si ya llegó, fijamos 0 y renovamos para el próximo año
    if (diff <= 0) {
      const zero = formatDHMS(0);
      if (elOverlay) elOverlay.innerHTML = zero;
      if (elMain) elMain.innerHTML = zero;

      if (typeof heartsConfetti === 'function') {
        heartsConfetti(2400);
      }

      // Pasados unos segundos, reorienta a la próxima fecha (por si dejan abierta la página)
      setTimeout(() => { target = nextValentine(new Date()); }, 5000);
      return;
    }
    const text = formatDHMS(diff);
    if (elOverlay) elOverlay.innerHTML = text;
    if (elMain) elMain.innerHTML = text;
  };

  tick();
  // Actualiza cada segundo
  const interval = setInterval(tick, 1000);

  // Limpieza si quisieras detenerlo en algún momento:
  return () => clearInterval(interval);
}


// ========= Inicio =========
document.addEventListener('DOMContentLoaded', () => {
  startHeartsCanvas();              // el que ya tienes para el fondo general
  startHeartsCanvasOn('overlay-hearts'); // nuevo, solo para el overlay
  // Contador a San Valentín
  startValentineCountdown();

  const { from, to } = getParams();

  // Nombres dinámicos
  const toName = document.getElementById('toName');
  const fromName = document.getElementById('fromName');
  const fromSig = document.getElementById('fromSignature');
  if (toName) toName.textContent = to || 'Karolay';
  if (fromName) fromName.textContent = from || 'Gianfranco';
  if (fromSig) fromSig.textContent = from || 'Gianfranco';

  // Mensaje romántico, poético y emocional para mi esposa embarazada
  const messageBodyEl = document.getElementById('messageBody');
  if (messageBodyEl) {
    const texto = `
Amor mío ${to || 'Karolay'},

Desde que caminamos juntos, la vida tiene un tono distinto,
como si cada día llevara un brillo nuevo solo por tu presencia.

Hay cosas que uno no sabe explicar:
cómo una sonrisa tuya calma mis tormentas, cómo tu mirada ordena mis días,
cómo tu fuerza y tu ternura conviven sin romperse.

Te veo florecer con esta nueva vida que llevamos dentro,
como si cada latido tuyo marcara un rumbo que quiero seguir.
No es solo amor:
es admiración, es respeto, es ese sentimiento profundo que uno no dice en voz alta,
pero que sostiene el alma entera.

Gracias por tus días luminosos y por las noches donde tu abrazo es certeza.
Gracias por confiar en mí, por permitirme ser tu compañero en cada paso,
por mostrarme que el amor verdadero también es silencio, es paz,
es caminar juntos aunque el mundo esté en ruido.

No sé si el destino se escribe o se construye,pero si algo tengo claro
es que contigo siempre quiero elegir el camino.
Me inspiras, me completas, me das motivo para ser mejor que ayer.
Te amo con esa mezcla que es mía:
firme, profunda, constante y entregada por completo a vos.

Prometo caminar a tu lado en cada paso, ser abrigo cuando haga frío, 
risa cuando falte el aire y calma cuando el mundo se vuelva ruido.
Prometo escuchar tus miedos sin juzgar, celebrar tus sueños sin medida 
y recordar, cada día, que lo más sagrado que tengo es tu confianza.

Gracias por darme la maravilla de este nosotros que crece dentro de ti. 
Gracias por enseñarme a amar con paciencia, con presencia y con todo el corazón. 
Y gracias por elegirme para ser familia.

Te amo hoy, te amaré mañana y en cada latido nuevo que se sume a nuestra casa.

Siempre tuyo, ${from || 'Gianfranco'}
  `.trim();

    // Lo insertamos con saltos de línea convertidos a <br> para respetar la poesía
    messageBodyEl.innerHTML = texto.replace(/\n/g, '<br>');
  }

  // Corazones
  startHeartsCanvas();

  // Typewriter
  const tw = document.getElementById('typewriter');
  if (tw) {
    const intro = buildIntroText({ from, to });
    typewrite(tw, intro, 20);
  }

  // Botón abrir carta
  const openBtn = document.getElementById('openBtn');
  const letter = document.getElementById('hiddenMessage');

  const passModal = document.getElementById('passModal');
  const passCloseBtn = document.getElementById('passCloseBtn');
  const passCancelBtn = document.getElementById('passCancelBtn');
  const passSubmitBtn = document.getElementById('passSubmitBtn');
  const passInput = document.getElementById('passInput');
  const passToggle = document.getElementById('passToggle');

  let lastFocusedEl = null;

  // Abrir modal
  function openModal() {
    lastFocusedEl = document.activeElement;
    passModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // bloquea scroll de fondo
    passInput.value = '';
    setTimeout(() => passInput.focus(), 50);
  }

  // Cerrar modal
  function closeModal() {
    passModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  // Validar contraseña
  function submitPassword() {
    const val = (passInput.value || '').trim();
    // Si querés “case-insensitive”, usar: val.toLowerCase() === 'dilana'
    const ok = (val === '23525');
    if (!ok) {
      const dlg = passModal.querySelector('.modal__dialog');
      const hint = document.getElementById('passHint');
      if (hint) hint.textContent = 'Contraseña incorrecta. \nPista: Fecha Importante 💍.';
      dlg.classList.remove('shake'); // reinicia animación
      // Forzar reflow p/ volver a aplicar la animación
      void dlg.offsetWidth;
      dlg.classList.add('shake');
      passInput.select();
      return;
    }

    // Correcta → cerrar modal y abrir carta
    closeModal();
    heartsConfetti(20000, { intervalMs: 60, batch: 7 });
    letter.hidden = false;
    letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Toggle ver/ocultar
  if (passToggle && passInput) {
    passToggle.addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
    });
  }

  // Cierre y eventos del modal
  if (passCloseBtn) passCloseBtn.addEventListener('click', closeModal);
  if (passCancelBtn) passCancelBtn.addEventListener('click', closeModal);
  // Cerrar al hacer clic fuera del cuadro
  passModal?.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('modal__backdrop')) closeModal();
  });
  // Enter para enviar
  passInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitPassword();
  });
  passSubmitBtn?.addEventListener('click', submitPassword);

  // Interceptar el click de "Abrir mi mensaje"
  if (openBtn && letter) {
    openBtn.addEventListener('click', () => {
      if (isBeforeValentineToday(new Date())) {
        // Mostrar modal si aún no es 14/02
        openModal();
        return;
      }
      // Si ya es 14/02 o después, abrir directo
      heartsConfetti();
      letter.hidden = false;
      letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Accesibilidad: cerrar con Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !passModal.classList.contains('hidden')) {
      closeModal();
    }
  });


  // Tema
  setupThemeToggle();

  // ========= LÓGICA DEL BOTÓN NO (EVASIVO) =========
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const startScreen = document.getElementById("start-screen");
  const mainContent = document.getElementById("main-content");

  if (noBtn && startScreen) {
    // Posición inicial centrada cerca del botón SÍ
    const centerX = (window.innerWidth - (noBtn.offsetWidth || 160)) / 2 + 100;
    const centerY = (window.innerHeight - (noBtn.offsetHeight || 48)) / 2;
    noBtn.style.left = centerX + 'px';
    noBtn.style.top = centerY + 'px';

    // Función para mover el botón
    const escape = () => {
      moveNoButton(noBtn);
    };

    // El botón huye cuando el mouse pasa por encima
    noBtn.addEventListener("mouseenter", escape);
    noBtn.addEventListener("mouseover", escape);
    noBtn.addEventListener("mousemove", escape);

    // También huye cuando se intenta hacer click
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      escape();
    });

    // Huye cuando el mouse se acerca (proximidad de 150px)
    document.addEventListener("mousemove", (e) => {
      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // Si el mouse está a menos de 150px, el botón huye
      if (distance < 150) {
        escape();
      }
    });

    // Soporte para touch (móviles)
    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);

      if (distance < 150) {
        escape();
      }
    }, { passive: true });
  }

  // Botón SÍ - mostrar contenido principal
  if (yesBtn && startScreen && mainContent) {
    yesBtn.addEventListener("click", () => {
      startScreen.style.transition = "opacity 0.3s ease";
      startScreen.style.opacity = "0";
      setTimeout(() => {
        startScreen.classList.add("hidden");
        mainContent.classList.remove("hidden");
      }, 300);
    });
  }
});