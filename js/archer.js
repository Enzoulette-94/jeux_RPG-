import { Character } from "./characters.js";

export class Archer extends Character {
  constructor(name) {
    super(name, 7, 3, 150);
    this.specialName = "Fleche de feu";
    this.specialCost = 50;
    this.specialDamage = 9;
  }

  specialAttack(target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    target.takeDamage(9);
    return true;
  }
}
