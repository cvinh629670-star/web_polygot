import { createArena } from './arena.js';
import { createDeck } from './deck.js';

window.polyglotGraphics = { createArena, createDeck };
window.dispatchEvent(new Event('polyglot:graphics-ready'));
