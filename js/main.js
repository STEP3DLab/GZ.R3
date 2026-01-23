const scoreValue = document.getElementById('scoreValue');
const increaseButton = document.getElementById('increaseScore');
const decreaseButton = document.getElementById('decreaseScore');
const resetButton = document.getElementById('resetScore');

let score = 0;

const renderScore = () => {
  scoreValue.textContent = String(score);
};

increaseButton.addEventListener('click', () => {
  score += 1;
  renderScore();
});

decreaseButton.addEventListener('click', () => {
  score -= 1;
  renderScore();
});

resetButton.addEventListener('click', () => {
  score = 0;
  renderScore();
});

renderScore();
