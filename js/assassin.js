import { Character } from "./characters.js";

export class Assassin extends Character {
  constructor(name) {
    super(name, 6, 6, 20);
    this.specialName = "Shadow hit";
    this.specialCost = 10;
    this.specialDamage = 9;
  }

  specialAttack(target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }

    target.takeDamage(7);

    if (target.isAlive()) {
      this.takeDamage(7);
    }

    return true;
  }
}
