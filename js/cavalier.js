import { Character } from "./characters.js";

export class Cavalier extends Character {
  constructor(name) {
    super(name, 16, 3, 160);
    this.specialName = "Retraite de canasson";
    this.specialCost = 40;
    this.specialDamage = 4;
  }

  specialAttack(target) {
    if (!this.spendMana(this.specialCost)) {
      return false;
    }
    target.takeDamage(4);
    this.hp += 5;
    return true;
  }
}
