import { Swordsman } from "./js/swordsman.js";
import { Cavalier } from "./js/cavalier.js";
import { Soigneur } from "./js/soigneur.js";
import { Berzerker } from "./js/berzerker.js";
import { Assassin } from "./js/assassin.js";
import { Lancier } from "./js/lancier.js";
import { Archer } from "./js/archer.js";
import { Game } from "./js/game.js";

const names = [
  "Lucas",
  "Jobee",
  "Soso",
  "Xav",
  "Sese",
  "Nono",
  "Toto",
  "Samasu",
  "Sarah",
  "Nyxy",
];

const classes = [
  Swordsman,
  Cavalier,
  Soigneur,
  Berzerker,
  Assassin,
  Lancier,
  Archer,
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createRandomCharacters(count, availableNames = names) {
  const selected = new Set();
  const characters = [];

  while (characters.length < count) {
    const name = pickRandom(availableNames);
    if (selected.has(name)) {
      continue;
    }
    selected.add(name);

    const ClassType = pickRandom(classes);
    characters.push(new ClassType(name));
  }

  return characters;
}

const app = document.getElementById("app");
app.textContent = "";

const setup = document.getElementById("setup");
const setupForm = document.getElementById("setup-form");
const nameInput = document.getElementById("player-name");
const classSelect = document.getElementById("player-class");
const turnBox = document.getElementById("player-turn");
const turnName = document.getElementById("player-turn-name");
const targetSelect = document.getElementById("target-select");
const normalButton = document.getElementById("btn-normal");
const specialButton = document.getElementById("btn-special");
const specialInfo = document.getElementById("special-info");
const replayButton = document.getElementById("replay");
const logSection = document.getElementById("log-section");
const difficultyInputs = document.querySelectorAll("input[name=\"difficulty\"]");

const classOptions = [
  { label: "Epeiste", value: "Swordsman", type: Swordsman },
  { label: "Cavalier", value: "Cavalier", type: Cavalier },
  { label: "Soigneur", value: "Soigneur", type: Soigneur },
  { label: "Berzerker", value: "Berzerker", type: Berzerker },
  { label: "Assassin", value: "Assassin", type: Assassin },
  { label: "Lancier", value: "Lancier", type: Lancier },
  { label: "Archer", value: "Archer", type: Archer },
];

classOptions.forEach((opt) => {
  const option = document.createElement("option");
  option.value = opt.value;
  option.textContent = opt.label;
  classSelect.appendChild(option);
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerName = nameInput.value.trim();
  if (!playerName) {
    return;
  }

  const selected = classOptions.find((opt) => opt.value === classSelect.value);
  if (!selected) {
    return;
  }

  const difficulty = Array.from(difficultyInputs).find((input) => input.checked)
    ?.value;

  const humanPlayer = new selected.type(playerName);
  const availableNames = names.filter((n) => n !== playerName);
  const bots = createRandomCharacters(4, availableNames);
  const characters = [humanPlayer, ...bots];

  setup.classList.add("hidden");
  logSection.hidden = false;
  logSection.classList.remove("hidden");

  const game = new Game(characters, humanPlayer, {
    turnBox,
    turnName,
    targetSelect,
    normalButton,
    specialButton,
    specialInfo,
    replayButton,
    difficulty,
  });

  game.startGame();
});

replayButton.addEventListener("click", () => {
  window.location.reload();
});
