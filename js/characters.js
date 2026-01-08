export class Character {
  constructor(name, hp, dmg, mana) {
    this.name = name;
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.status = "playing";
    this.defenseBuff = 0; // damage reduction for next hit
    this.isShielded = false; // avoids damage for next hit
  }

  isAlive() {
    return this.hp > 0 && this.status === "playing";
  }

  takeDamage(amount) {
    if (this.isShielded) {
      this.isShielded = false;
      return;
    }

    const reduced = Math.max(0, amount - this.defenseBuff);
    this.defenseBuff = 0;
    this.hp = Math.max(0, this.hp - reduced);

    if (this.hp === 0) {
      this.status = "loser";
    }
  }

  spendMana(cost) {
    if (this.mana < cost) {
      return false;
    }
    this.mana -= cost;
    return true;
  }

  basicAttack(target) {
    if (!this.isAlive() || !target.isAlive()) {
      return;
    }
    target.takeDamage(this.dmg);
  }

  dealDamage(victim) {
    if (!this.isAlive() || !victim.isAlive()) {
      return;
    }
    victim.takeDamage(this.dmg);
    if (!victim.isAlive()) {
      this.mana += 20;
    }
  }

  specialAttack(_target) {
    return false;
  }
}
