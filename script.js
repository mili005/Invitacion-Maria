const envelope = document.getElementById('envelope');
const sealHotspot = document.getElementById('sealHotspot');
const closeHotspot = document.getElementById('closeHotspot');
const video = document.getElementById('invitationVideo');

let isAnimating = false;
let isOpen = false;
let audioUnlocked = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearStates() {
  envelope.classList.remove(
    'breaking',
    'seal-join',
    'step-1',
    'step-2',
    'step-3',
    'step-4',
    'open',
    'opening',
    'closing'
  );
}

async function unlockVideoAudio() {
  if (audioUnlocked) return;

  try {
    video.muted = false;
    video.volume = 1;
    await video.play();
    audioUnlocked = true;
  } catch (error) {
    console.log('El navegador bloqueó el audio hasta otra interacción.');
  }
}

async function openEnvelope() {
  if (isAnimating || isOpen) return;
  isAnimating = true;

  await unlockVideoAudio();

  clearStates();
  envelope.classList.remove('closed');
  envelope.classList.add('opening');

  // 1) El sobre “respira” / se eleva
  await sleep(180);

  // 2) Se rompe el sello
  envelope.classList.add('breaking');
  await sleep(260);

  // 3) Solapas una por una
  envelope.classList.add('step-1');
  await sleep(260);

  envelope.classList.add('step-2');
  await sleep(260);

  envelope.classList.add('step-3');
  await sleep(260);

  envelope.classList.add('step-4');
  await sleep(320);

  // 4) Estado final abierto
  envelope.classList.remove('opening');
  envelope.classList.add('open');

  isOpen = true;
  isAnimating = false;
}

async function closeEnvelope() {
  if (isAnimating || !isOpen) return;
  isAnimating = true;

  envelope.classList.add('closing');

  // Cierre inverso, una por una
  envelope.classList.remove('step-4');
  await sleep(260);

  envelope.classList.remove('step-3');
  await sleep(260);

  envelope.classList.remove('step-2');
  await sleep(260);

  envelope.classList.remove('step-1');
  await sleep(320);

  // Sello vuelve a unirse
  envelope.classList.add('seal-join');
  await sleep(300);

  // Pausar video al cerrar
  video.pause();

  // Volver al estado inicial
  envelope.classList.remove('open');
  envelope.classList.remove('closing');
  envelope.classList.remove('breaking');
  envelope.classList.remove('seal-join');
  envelope.classList.add('closed');

  isOpen = false;
  isAnimating = false;
}

sealHotspot.addEventListener('pointerup', (e) => {
  e.preventDefault();
  openEnvelope();
});

closeHotspot.addEventListener('pointerup', (e) => {
  e.preventDefault();
  closeEnvelope();
});
