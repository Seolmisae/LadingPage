const display = document.querySelector('.timer-display');
const startButton = document.querySelector('.start-btn');
const resetButton = document.querySelector('.reset-btn');
const skipButton = document.querySelector('.skip-btn');
const modeButtons = [...document.querySelectorAll('.mode')];
const prompt = document.querySelector('.timer-prompt');
const soundButton = document.querySelector('.sound-toggle');

let selectedMinutes = 25;
let remaining = selectedMinutes * 60;
let timerId = null;

const prompts = {
  25: '지금 가장 중요한 한 가지에 집중해보세요.',
  5: '잠깐 숨을 고르고 몸을 가볍게 움직여보세요.',
  15: '충분히 쉬면서 다음 몰입을 준비하세요.'
};

function renderTime() {
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  display.textContent = `${minutes}:${seconds}`;
  document.title = timerId ? `${minutes}:${seconds} — Modo` : 'Modo — 나만의 집중 리듬';
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  startButton.innerHTML = '<span>▶</span> 시작하기';
}

function selectMode(button) {
  stopTimer();
  modeButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', active.toString());
  });
  selectedMinutes = Number(button.dataset.minutes);
  remaining = selectedMinutes * 60;
  prompt.textContent = prompts[selectedMinutes];
  renderTime();
}

modeButtons.forEach(button => button.addEventListener('click', () => selectMode(button)));

startButton.addEventListener('click', () => {
  if (timerId) {
    stopTimer();
    return;
  }
  if (remaining === 0) remaining = selectedMinutes * 60;
  startButton.innerHTML = '<span>Ⅱ</span> 일시정지';
  timerId = setInterval(() => {
    remaining -= 1;
    renderTime();
    if (remaining <= 0) {
      stopTimer();
      prompt.textContent = '잘했어요! 이제 잠시 쉬어갈 시간이에요.';
    }
  }, 1000);
});

resetButton.addEventListener('click', () => {
  stopTimer();
  remaining = selectedMinutes * 60;
  prompt.textContent = prompts[selectedMinutes];
  renderTime();
});

skipButton.addEventListener('click', () => {
  const currentIndex = modeButtons.findIndex(button => button.classList.contains('active'));
  selectMode(modeButtons[(currentIndex + 1) % modeButtons.length]);
});

soundButton.addEventListener('click', () => {
  const on = soundButton.classList.toggle('on');
  soundButton.setAttribute('aria-pressed', on.toString());
  soundButton.setAttribute('aria-label', on ? '소리 끄기' : '소리 켜기');
});

renderTime();
