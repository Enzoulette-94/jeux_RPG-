import { Character } from "./characters.js";

export class Berzerker extends Character {
  constructor(name) {
    super(name, 15, 4, 4);
    this.specialName = "Rage";
    this.specialCost = 2;
    this.specialDamage = 0;
  }

  specialAttack(_target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    this.dmg += 3;
    this.takeDamage(2);
    return true;
  }
}
