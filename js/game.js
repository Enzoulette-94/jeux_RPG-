export class Game {
  constructor(players, humanPlayer, ui) {
    this.players = players;
    this.humanPlayer = humanPlayer;
    this.ui = ui;
    this.turnLeft = 10;
    this.turnNumber = 1;
  }

  shufflePlayers(players) {
    const copy = [...players];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  alivePlayers() {
    return this.players.filter((p) => p.isAlive());
  }

  skipTurn() {
    this.turnLeft -= 1;
    this.turnNumber += 1;
  }

  watchStats() {
    this.logLine("--- Statistiques ---");
    this.players.forEach((p) => {
      this.logLineParts([
        p,
        ` | pv: ${p.hp} | degats: ${p.dmg} | mana: ${p.mana} | statut: ${p.status}`,
      ]);
    });
  }

  renderStatusPanel() {
    if (this.ui?.difficulty === "guerrier") {
      return;
    }
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }

    const card = document.createElement("div");
    card.className =
      "mt-3 rounded-lg border border-red-900/70 bg-red-900/30 p-3";
    const body = document.createElement("div");
    const title = document.createElement("div");
    title.className = "mb-2 text-sm font-semibold uppercase tracking-wider";
    title.textContent = "Etat des personnages";
    body.appendChild(title);

    this.alivePlayers().forEach((player) => {
      const row = document.createElement("div");
      row.className =
        "mb-2 flex items-center justify-between rounded border border-red-900/60 px-3 py-2";

      const left = document.createElement("div");
      left.innerHTML = `<span class=\"font-semibold\">${this.playerLabelText(
        player
      )}</span>`;

      const right = document.createElement("div");
      right.innerHTML = `
        <span class=\"mr-2 inline-flex items-center rounded-full bg-red-900/80 px-3 py-1 text-xs font-semibold text-white\">PV ${player.hp}</span>
        <span class=\"mr-2 inline-flex items-center rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-white\">Mana ${player.mana}</span>
        <span class=\"inline-flex items-center rounded-full bg-red-800/80 px-3 py-1 text-xs font-semibold text-white\">${player.status}</span>
      `;

      row.appendChild(left);
      row.appendChild(right);
      body.appendChild(row);
    });

    card.appendChild(body);
    logContainer.appendChild(card);
  }

  playerLabelText(player) {
    return `${player.name} (${this.getClassLabel(player)})`;
  }

  getClassLabel(player) {
    const map = {
      Swordsman: "Epeiste",
      Cavalier: "Cavalier",
      Soigneur: "Soigneur",
      Berzerker: "Berzerker",
      Assassin: "Assassin",
      Lancier: "Lancier",
      Archer: "Archer",
    };
    return map[player.constructor.name] || player.constructor.name;
  }

  playerLabel(player) {
    return `${player.name} (${this.getClassLabel(player)})`;
  }

  logLineParts(parts) {
    const plain = parts
      .map((part) => (typeof part === "string" ? part : this.playerLabelText(part)))
      .join("");
    console.log(plain);

    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }

    const line = document.createElement("div");
    parts.forEach((part) => {
      if (typeof part === "string") {
        line.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = "font-semibold";
      span.textContent = this.playerLabelText(part);
      line.appendChild(span);
    });
    logContainer.appendChild(line);
  }

  logLine(message) {
    console.log(message);
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.textContent = message;
    logContainer.appendChild(line);
  }

  logAttack(attacker, target, damage) {
    if (this.ui?.difficulty === "guerrier") {
      this.logLineParts([
        attacker,
        " attaque ",
        target,
        `. Il lui inflige ${damage} degats.`,
      ]);
      return;
    }
    this.logLineParts([
      attacker,
      " attaque ",
      target,
      `. Il lui inflige ${damage} degats. Il reste ${target.hp} points de vie a `,
      target,
      ".",
    ]);
  }

  async takeTurn(attacker) {
    if (!attacker.isAlive()) {
      return;
    }

    if (this.ui?.difficulty === "god") {
      await this.takeHumanTurn(attacker);
      return;
    }

    if (attacker === this.humanPlayer) {
      await this.takeHumanTurn(attacker);
      return;
    }

    this.takeAiTurn(attacker);
  }

  takeAiTurn(attacker) {
    const targets = this.alivePlayers().filter((p) => p !== attacker);
    if (targets.length === 0) {
      return;
    }

    const target = targets[Math.floor(Math.random() * targets.length)];
    const useSpecial =
      attacker.specialCost !== undefined &&
      attacker.mana >= attacker.specialCost &&
      Math.random() < 0.5;

    if (useSpecial && attacker.specialAttack(target)) {
      this.logSpecialAttack(attacker, target);
    } else {
      if (this.normalAttackFails(attacker)) {
        this.logNormalMiss(attacker);
        return;
      }
      attacker.dealDamage(target);
      this.logAttack(attacker, target, attacker.dmg);
    }

    if (!target.isAlive()) {
      this.logElimination(target);
      if (target === this.humanPlayer) {
        this.logHumanElimination();
      }
    }
  }

  takeHumanTurn(attacker) {
    const ui = this.ui;
    if (!ui) {
      return Promise.resolve();
    }

    const targets = this.alivePlayers().filter((p) => p !== attacker);
    if (targets.length === 0) {
      return Promise.resolve();
    }

    const logContainer = document.getElementById("log");
    if (logContainer) {
      logContainer.appendChild(ui.turnBox);
    }

    ui.turnBox.hidden = false;
    ui.turnBox.classList.remove("hidden");
    ui.turnName.textContent = this.playerLabelText(attacker);
    if (this.ui?.difficulty === "guerrier") {
      ui.specialInfo.textContent = "";
    } else {
      ui.specialInfo.textContent = `${attacker.specialName} (cout ${attacker.specialCost} mana)`;
    }

    ui.targetSelect.innerHTML = "";
    targets.forEach((target) => {
      const option = document.createElement("option");
      option.value = target.name;
      option.textContent = this.playerLabelText(target);
      ui.targetSelect.appendChild(option);
    });

    if (this.ui?.difficulty === "guerrier") {
      ui.normalButton.innerHTML = `
        <div class="text-left">
          <div>Attaque normale</div>
          <div class="text-xs text-zinc-200">${attacker.dmg} degats</div>
        </div>
      `;
      ui.specialButton.innerHTML = `
        <div class="text-left">
          <div>${attacker.specialName}</div>
          <div class="text-xs text-zinc-200">${attacker.specialDamage} degats</div>
        </div>
      `;
    } else {
      ui.normalButton.innerHTML = `
        <div class="text-left">
          <div>Attaque normale</div>
          <div class="text-xs text-zinc-200">${attacker.dmg} degats</div>
          <div class="text-xs text-zinc-300">0 mana</div>
        </div>
      `;
      ui.specialButton.innerHTML = `
        <div class="text-left">
          <div>${attacker.specialName}</div>
          <div class="text-xs text-zinc-200">${attacker.specialDamage} degats</div>
          <div class="text-xs text-zinc-300">${attacker.specialCost} mana</div>
        </div>
      `;
    }
    ui.specialButton.disabled = attacker.mana < attacker.specialCost;

    return new Promise((resolve) => {
      const cleanup = () => {
        ui.normalButton.removeEventListener("click", onNormal);
        ui.specialButton.removeEventListener("click", onSpecial);
        ui.turnBox.classList.add("hidden");
        ui.turnBox.hidden = true;
        resolve();
      };

      const getTarget = () =>
        targets.find((t) => t.name === ui.targetSelect.value);

      const onNormal = () => {
        const target = getTarget();
        if (!target) {
          return;
        }
        this.logPlayerChoice(
          attacker,
          "attaque normale",
          target,
          0
        );
        if (this.normalAttackFails(attacker)) {
          this.logNormalMiss(attacker);
          cleanup();
          return;
        }
        attacker.dealDamage(target);
        this.logAttack(attacker, target, attacker.dmg);
        if (!target.isAlive()) {
          this.logElimination(target);
          if (target === this.humanPlayer) {
            this.logHumanElimination();
          }
        }
        cleanup();
      };

      const onSpecial = () => {
        const target = getTarget();
        if (!target) {
          return;
        }
        if (!attacker.specialAttack(target)) {
          return;
        }
        this.logPlayerChoice(
          attacker,
          attacker.specialName,
          target,
          attacker.specialCost
        );
        this.logSpecialAttack(attacker, target);
        if (!target.isAlive()) {
          this.logElimination(target);
          if (target === this.humanPlayer) {
            this.logHumanElimination();
          }
        }
        cleanup();
      };

      ui.normalButton.addEventListener("click", onNormal);
      ui.specialButton.addEventListener("click", onSpecial);
    });
  }

  logPlayerChoice(attacker, attackName, target, manaCost) {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-2 w-fit rounded-lg border border-emerald-700/80 bg-emerald-900/40 px-4 py-2 text-base font-bold text-emerald-200";
    line.textContent = `CHOIX DU JOUEUR : ${this.playerLabelText(
      attacker
    )} -> ${attackName} sur ${this.playerLabelText(
      target
    )} (cout ${manaCost} mana)`;
    logContainer.appendChild(line);
  }

  logSpecialAttack(attacker, target) {
    if (attacker.specialDamage > 0 && target) {
      if (this.ui?.difficulty === "guerrier") {
        this.logLineParts([
          attacker,
          ` utilise ${attacker.specialName} sur `,
          target,
          `. Il lui inflige ${attacker.specialDamage} degats.`,
        ]);
        return;
      }
      this.logLineParts([
        attacker,
        ` utilise ${attacker.specialName} sur `,
        target,
        `. Il lui inflige ${attacker.specialDamage} degats. Il reste ${target.hp} points de vie a `,
        target,
        ".",
      ]);
      return;
    }

    this.logLineParts([attacker, ` utilise ${attacker.specialName}.`]);
  }

  normalAttackFails(attacker) {
    return Math.random() < 0.25;
  }

  logNormalMiss(attacker) {
    const messages = [
      `ce trou du cul de ${this.playerLabelText(
        attacker
      )} a glisse, l'attaque n'est pas lance.`,
      `${this.playerLabelText(
        attacker
      )} a loupe son coup, il doit etre un peu bourre.`,
      `${this.playerLabelText(
        attacker
      )} a fait tombe son arme, l'attaque echoue et il se raproche de la mort.`,
    ];
    this.logLine(messages[Math.floor(Math.random() * messages.length)]);
  }

  endGame(winner) {
    if (winner) {
      winner.status = "winner";
      this.logWinner(winner);
      if (winner === this.humanPlayer) {
        this.logHumanVictory();
      }
      if (this.ui?.replayButton) {
        this.ui.replayButton.hidden = false;
        this.ui.replayButton.classList.remove("hidden");
      }
      return;
    }

    const survivors = this.alivePlayers();
    if (survivors.length === 0) {
      this.logLine("Partie terminee. Aucun survivant.");
      if (this.ui?.replayButton) {
        this.ui.replayButton.hidden = false;
        this.ui.replayButton.classList.remove("hidden");
      }
      return;
    }

    const maxHp = Math.max(...survivors.map((p) => p.hp));
    const winners = survivors.filter((p) => p.hp === maxHp);
    winners.forEach((p) => {
      p.status = "winner";
    });

    if (winners.length === 1) {
      this.logWinner(winners[0]);
    } else {
      this.logTie(winners);
    }

    if (winners.includes(this.humanPlayer)) {
      this.logHumanVictory();
    }

    if (this.ui?.replayButton) {
      this.ui.replayButton.hidden = false;
      this.ui.replayButton.classList.remove("hidden");
    }
  }

  logWinner(winner) {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-4 w-fit rounded-lg border border-emerald-700/80 bg-emerald-800/20 px-5 py-2 text-3xl font-extrabold text-emerald-300";
    line.textContent = `VICTOIRE : ${this.playerLabelText(winner)}`;
    logContainer.appendChild(line);
  }

  logTie(winners) {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-4 w-fit rounded-lg border border-amber-700/80 bg-amber-900/30 px-5 py-2 text-xl font-bold text-amber-200";
    const names = winners.map((p) => this.playerLabelText(p)).join(", ");
    line.textContent = `Bravo au survivant : ${names}`;
    logContainer.appendChild(line);
  }

  logElimination(target) {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-2 w-fit rounded-lg border border-red-700/80 bg-red-900/40 px-4 py-1 text-xl font-bold text-red-200";
    line.textContent = `ELIMINE : ${this.playerLabelText(target)}`;
    logContainer.appendChild(line);
  }

  logHumanElimination() {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-3 w-fit rounded-lg border border-red-700/90 bg-red-800/60 px-5 py-2 text-2xl font-extrabold text-red-100";
    line.textContent = "TU ES ELIMINE";
    logContainer.appendChild(line);
  }

  logHumanVictory() {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto my-3 w-fit rounded-lg border border-emerald-700/90 bg-emerald-800/40 px-5 py-2 text-2xl font-extrabold text-emerald-100";
    line.textContent = "Tu es le plus fort a la bagarre";
    logContainer.appendChild(line);
  }

  async startTurn() {
    this.logHeading(`ROUND ${this.turnNumber}`);
    this.renderStatusPanel();

    const order = this.shufflePlayers(this.alivePlayers());
    for (const player of order) {
      if (!player.isAlive()) {
        continue;
      }
      if (this.ui?.difficulty === "god") {
        this.logLineParts(["C'est au tour de ", player, " de jouer."]);
      } else if (player === this.humanPlayer) {
        this.logLineParts(["C'est a ton tour de jouer."]);
      }
      await this.takeTurn(player);
    }

    this.logSeparator();

    this.skipTurn();
  }

  async startGame() {
    while (this.turnLeft > 0) {
      const alive = this.alivePlayers();
      if (alive.length <= 1) {
        this.endGame(alive[0]);
        return;
      }

      await this.startTurn();
    }

    this.endGame();
  }

  logSeparator() {
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("hr");
    line.className = "my-3 border-t-2 border-red-900/70";
    logContainer.appendChild(line);
  }

  logHeading(message) {
    console.log(message);
    const logContainer = document.getElementById("log");
    if (!logContainer) {
      return;
    }
    const line = document.createElement("div");
    line.className =
      "mx-auto mb-2 w-fit rounded-lg border border-red-900/70 bg-red-800/80 px-4 py-1 text-center text-lg font-bold tracking-widest text-white";
    const text = document.createElement("span");
    text.textContent = message;
    line.appendChild(text);
    logContainer.appendChild(line);
  }
}
