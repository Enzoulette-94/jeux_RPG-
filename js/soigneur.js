import { Character } from "./characters.js";

export class Soigneur extends Character {
  constructor(name) {
    super(name, 8, 2, 200);
    this.specialName = "Bandage";
    this.specialCost = 25;
    this.specialDamage = 0;
  }

  specialAttack(_target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    this.hp += 8;
    return true;
  }
}
