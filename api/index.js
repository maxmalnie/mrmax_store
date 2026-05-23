// api/index.js — Vercel function entry
// Vercel kieruje wszystkie /api/* na ten plik (patrz vercel.json).
// Eksportuje Express app z backend/src/server.js.

module.exports = require('../backend/src/server.js');
