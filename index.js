import { Swordsman } from "./js/swordsman.js";
import { Cavalier } from "./js/cavalier.js";
import { Soigneur } from "./js/soigneur.js";
import { Berzerker } from "./js/berzerker.js";
import { Assassin } from "./js/assassin.js";
import { Lancier } from "./js/lancier.js";
import { Archer } from "./js/archer.js";
import { Game } from "./js/game.js";

const app = document.getElementById("app");
app.textContent = "";

const setup = document.getElementById("setup");
const setupForm = document.getElementById("setup-form");
const partyList = document.getElementById("party-list");
const addCharacterButton = document.getElementById("add-character");
const autoCharacterButton = document.getElementById("auto-character");
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

const maxCharacters = 5;
const autoNames = [
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

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildClassSelect() {
  const select = document.createElement("select");
  select.className =
    "mt-1 rounded-md border border-red-900/60 bg-zinc-900/80 px-3 py-2 text-white";
  classOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });
  return select;
}

function addCharacterRow(isPlayer = false, defaults = {}) {
  if (partyList.children.length >= maxCharacters) {
    return;
  }

  const row = document.createElement("div");
  row.className =
    "flex flex-col gap-3 rounded-lg border border-red-900/60 bg-zinc-900/40 p-3 md:flex-row md:items-end";

  const nameLabel = document.createElement("label");
  nameLabel.className = "flex flex-1 flex-col text-sm";
  nameLabel.textContent = isPlayer ? "Ton nom" : "Nom du personnage";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.required = true;
  nameInput.className =
    "mt-1 rounded-md border border-red-900/60 bg-zinc-900/80 px-3 py-2 text-white";
  nameInput.placeholder = isPlayer ? "Ton nom" : "Nom";
  if (defaults.name) {
    nameInput.value = defaults.name;
  }
  nameLabel.appendChild(nameInput);

  const classLabel = document.createElement("label");
  classLabel.className = "flex flex-1 flex-col text-sm";
  classLabel.textContent = "Classe";
  const classSelect = buildClassSelect();
  if (defaults.classValue) {
    classSelect.value = defaults.classValue;
  }
  classLabel.appendChild(classSelect);

  row.appendChild(nameLabel);
  row.appendChild(classLabel);

  if (!isPlayer) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className =
      "rounded-md border border-red-900/60 bg-red-900/60 px-4 py-2 text-sm font-semibold text-white";
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => {
      row.remove();
    });
    row.appendChild(removeButton);
  }

  partyList.appendChild(row);
}

addCharacterRow(true);

addCharacterButton.addEventListener("click", () => {
  addCharacterRow(false);
});

autoCharacterButton.addEventListener("click", () => {
  const usedNames = Array.from(partyList.querySelectorAll("input"))
    .map((input) => input.value.trim())
    .filter(Boolean);
  const availableNames = autoNames.filter((name) => !usedNames.includes(name));
  const name = availableNames.length > 0 ? pickRandom(availableNames) : pickRandom(autoNames);
  const classValue = pickRandom(classOptions).value;
  addCharacterRow(false, { name, classValue });
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const rows = Array.from(partyList.children);
  if (rows.length < 2) {
    window.alert("Ajoute au moins 2 personnages pour lancer la partie.");
    return;
  }

  const characters = rows.map((row) => {
    const inputs = row.querySelectorAll("input, select");
    const name = inputs[0].value.trim();
    const classValue = inputs[1].value;
    if (!name) {
      return null;
    }
    const selected = classOptions.find((opt) => opt.value === classValue);
    if (!selected) {
      return null;
    }
    return new selected.type(name);
  });

  if (characters.includes(null)) {
    window.alert("Remplis tous les noms et classes avant de lancer.");
    return;
  }

  const difficulty = Array.from(difficultyInputs).find((input) => input.checked)
    ?.value;

  const humanPlayer = characters[0];

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
