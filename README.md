# Battle en Royal des Srabs

A small browser-based RPG battle game where 2 to 5 characters fight in a gladiator-style arena. You can build the whole party and play either a single character or all of them, depending on the mode.

## Features
- 7 playable classes with unique stats and special attacks.
- Party builder: add/remove characters before the game.
- 10-round battles or until only one survivor remains.
- Normal attacks can fail (1 chance out of 4).
- Special attacks consume mana.
- Three game modes: discovery (easy), warrior (hard), and god (full control).

## Game Modes
- **Discovery (easy):** shows the status panel each round.
- **Warrior (hard):** hides the status panel and removes remaining HP and mana info from logs.
- **God:** you control every character turn by turn.

## Win Condition
- If only one survivor remains, they win immediately.
- Otherwise, after 10 rounds, the character with the highest HP wins (ties are possible).

## How to Play
1. Open `index.html` in your browser.
2. Build your party (2 to 5 characters).
3. Select your mode (Discovery, Warrior, or God).
4. Start the game and choose actions on each turn.

## Classes (stats and specials)
- **Swordsman**: HP 12 | Mana 40 | Damage 4
  - Special: Coup Vertical Fulgurant (5 damage, 20 mana, reduces next incoming damage by 2)
- **Cavalier**: HP 16 | Mana 160 | Damage 3
  - Special: Retraite de canasson (4 damage, 40 mana)
- **Healer**: HP 8 | Mana 200 | Damage 2
  - Special: Bandage (+8 HP, 25 mana)
- **Berzerker**: HP 8 | Mana 0 | Damage 4
  - Special: Rage (+3 damage, -2 HP, 2 mana)
- **Assassin**: HP 6 | Mana 20 | Damage 6
  - Special: Shadow hit (7 damage, 20 mana, -7 HP if the target survives)
- **Lancier**: HP 10 | Mana 200 | Damage 2
  - Special: Lance du tigre (7 damage, 25 mana)
- **Archer**: HP 7 | Mana 300 | Damage 3
  - Special: Fleche de feu (9 damage, 50 mana)

## Project Structure
```
jeux_RPG/
  index.html
  index.js
  README.md
  js/
    game.js
    characters.js
    swordsman.js
    cavalier.js
    soigneur.js
    berzerker.js
    assassin.js
    lancier.js
    archer.js
```

## Notes
- This is a vanilla JavaScript project.
- The UI is built with Tailwind via CDN.
