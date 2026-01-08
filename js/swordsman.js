import { Character } from "./characters.js";

export class Swordsman extends Character {
  constructor(name) {
    super(name, 12, 4, 40);
    this.specialName = "Coup Vertical Fulgurant";
    this.specialCost = 20;
    this.specialDamage = 5;
  }

  specialAttack(target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    target.takeDamage(5);
    this.defenseBuff = 2;
    return true;
  }
}
