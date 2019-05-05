/*
This file saves the information on letter pieces of the Scrabble game. (total: 100 tiles)
Attributes description:
    Letter: the letter that is looked at
    points: how many points does this letter give
    frequency: how many times does this letter appear in the game
*/

const joker = {
    'letter': ' ',
    'points': 0,
    'frequency': 2
};
const a = {
    'letter': 'A',
    'points': 1,
    'frequency': 9
};
const b = {
    'letter': 'B',
    'points': 3,
    'frequency': 2
};
const c = {
    'letter': 'C',
    'points': 3,
    'frequency': 2
};
const d = {
    'letter': 'D',
    'points': 4,
    'frequency': 4
};
const e = {
    'letter': 'E',
    'points': 1,
    'frequency': 12
};
const f = {
    'letter': 'F',
    'points': 4,
    'frequency': 2
};
const g = {
    'letter': 'G',
    'points': 2,
    'frequency': 3
};
const h = {
    'letter': 'H',
    'points': 3,
    'frequency': 2
};
const i = {
    'letter': 'I',
    'points': 1,
    'frequency': 9
};
const j = {
    'letter': 'J',
    'points': 8,
    'frequency': 1
};
const k = {
    'letter': 'K',
    'points': 5,
    'frequency': 1
};
const l = {
    'letter': 'L',
    'points': 1,
    'frequency': 4
};
const m = {
    'letter': 'M',
    'points': 3,
    'frequency': 2
};
const n = {
    'letter': 'N',
    'points': 1,
    'frequency': 6
};
const o = {
    'letter': 'O',
    'points': 1,
    'frequency': 8
};
const p = {
    'letter': 'P',
    'points': 3,
    'frequency': 2
};
const q = {
    'letter': 'Q',
    'points': 10,
    'frequency': 1
};
const r = {
    'letter': 'R',
    'points': 1,
    'frequency': 6
};
const s = {
    'letter': 'S',
    'points': 1,
    'frequency': 4
};
const t = {
    'letter': 'T',
    'points': 1,
    'frequency': 6
};
const u = {
    'letter': 'U',
    'points': 1,
    'frequency': 4
};
const v = {
    'letter': 'V',
    'points': 4,
    'frequency': 2
};
const w = {
    'letter': 'W',
    'points': 4,
    'frequency': 2
};
const x = {
    'letter': 'X',
    'points': 8,
    'frequency': 1
};
const y = {
    'letter': 'Y',
    'points': 4,
    'frequency': 2
};
const z = {
    'letter': 'Z',
    'points': 10,
    'frequency': 1
};

module.exports = {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z,
    joker
};