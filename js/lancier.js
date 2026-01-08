import { Character } from "./characters.js";

export class Lancier extends Character {
  constructor(name) {
    super(name, 10, 2, 200);
    this.specialName = "Lance du tigre";
    this.specialCost = 25;
    this.specialDamage = 7;
  }

  specialAttack(target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    target.takeDamage(7);
    return true;
  }
}
