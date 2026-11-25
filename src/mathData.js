/* =========================================================================
   MATH DATA, LESSON CONTENT & PROCEDURAL QUESTION GENERATOR
   Topic : Number Line Representation — Grade 8
   Covers: integers & opposites, fractions, decimals, ordering, absolute value,
           distance & midpoint, irrational numbers (√), inequalities.
   Every on-screen paragraph has a matching `speech` line (symbols spoken in
   words) which narration.js uses for the ElevenLabs audio.
   ========================================================================= */
import { fmt, fmtFixed, fracStr, MINUS } from './utils/format.js';

export const WESTERN_NAMES = [
  'Leo', 'Emma', 'Alex', 'Oliver', 'Sophia', 'Jack', 'Maya', 'Lucas',
  'Ethan', 'Chloe', 'Noah', 'Liam', 'Harper', 'Ava', 'Mason', 'Ella'
];

/* -------------------------------------------------------------------------
   WONDER
   ------------------------------------------------------------------------- */
export const WONDER = {
  title: 'How Many Numbers Fit Between 0 and 1?',
  stat: 'Infinitely Many!',
  highlight: 'more numbers',
  bodyBefore: 'Leo and Emma zoomed in on the number line. Every time they zoomed in, they found ',
  bodyAfter: ': fractions, decimals, and even strange ones like √2 that never end!',
  question: 'How can one straight line hold every number there is, and how do we find exactly where each one lives?',
  speech:
    'Leo and Emma zoomed in on the number line. Every time they zoomed in, they found more numbers: fractions, decimals, and even strange ones like the square root of 2 that never end!'
};

/* -------------------------------------------------------------------------
   STORY (8 slides)
   ------------------------------------------------------------------------- */
export const STORY_SLIDES = [
  {
    id: 1,
    title: 'The Line That Holds Every Number',
    image: '/assets/images/slide1.jpg',
    body: 'Every real number has its own special spot on a straight line called the number line. Zero sits in the middle, positive numbers march to the right, and negative numbers stretch to the left.',
    speech: 'Every real number has its own special spot on a straight line called the number line. Zero sits in the middle, positive numbers march to the right, and negative numbers stretch to the left.',
    quote: 'Right means greater. Left means smaller.',
    bubble: "Let's explore where every number lives!",
    style: 'statement'
  },
  {
    id: 2,
    title: 'Integers & Opposites: Mirror Images',
    image: '/assets/images/slide2.jpg',
    body: 'Integers are the whole numbers: positive, negative, and zero. Every number has an opposite the same distance from zero on the other side, like 4 and −4.',
    speech: 'Integers are the whole numbers: positive, negative, and zero. Every number has an opposite the same distance from zero on the other side, like 4 and negative 4.',
    quote: 'The opposite of n is −n, a mirror image across 0.',
    bubble: 'Zero is its own opposite. It sits right on the mirror!',
    style: 'emphasis'
  },
  {
    id: 3,
    title: 'Fractions & Decimals Hide In Between',
    image: '/assets/images/slide3.jpg',
    body: 'Between any two integers sit fractions and decimals. To place 3/4, split the gap from 0 to 1 into 4 equal parts, then count 3 parts from 0.',
    speech: 'Between any two integers sit fractions and decimals. To place three quarters, split the gap from 0 to 1 into 4 equal parts, then count 3 parts from 0.',
    quote: 'Equal parts first. Then count!',
    bubble: '3/4 and 0.75 land on exactly the same spot!',
    style: 'statement'
  },
  {
    id: 4,
    title: 'Comparing & Ordering Numbers',
    image: '/assets/images/slide4.jpg',
    body: 'The farther right a number sits, the greater it is. So −1/2 is greater than −3/4, even though 3/4 is bigger than 1/2. Be extra careful when comparing negatives!',
    speech: 'The farther right a number sits, the greater it is. So negative one half is greater than negative three quarters, even though three quarters is bigger than one half. Be extra careful when comparing negatives!',
    quote: 'On the number line, left is less and right is greater.',
    bubble: 'Think of a thermometer: −8°C is colder than −2°C!',
    style: 'emphasis'
  },
  {
    id: 5,
    title: 'Absolute Value & Distance',
    image: '/assets/images/slide5.jpg',
    body: 'Absolute value is the distance from zero, so |−5| = 5. The distance between two points a and b is |a − b|, and distance is never negative.',
    speech: 'Absolute value is the distance from zero, so the absolute value of negative 5 is 5. The distance between two points a and b is the absolute value of a minus b, and distance is never negative.',
    quote: 'Distance between a and b = |a − b|',
    bubble: 'From −3 up to 4 is 7 steps. Count them if you like!',
    style: 'statement'
  },
  {
    id: 6,
    title: 'Irrational Numbers Have Spots Too!',
    image: '/assets/images/slide6.jpg',
    body: 'Numbers like √2 and π are irrational: their decimals never end and never repeat. They still have exact spots! A unit square has a diagonal of √2, so swing that diagonal down onto the line with a compass to mark √2 ≈ 1.414.',
    speech: 'Numbers like the square root of 2 and pi are irrational: their decimals never end and never repeat. They still have exact spots! A unit square has a diagonal of the square root of 2, so swing that diagonal down onto the line with a compass to mark the square root of 2, which is about 1 point 4 1 4.',
    quote: '√2 ≈ 1.414 lives between 1 and 2.',
    bubble: 'No number is too strange for the number line!',
    style: 'celebration'
  },
  {
    id: 7,
    title: 'Inequalities on the Number Line',
    image: '/assets/images/slide7.jpg',
    body: 'To show x > 2, draw an open circle at 2 and shade to the right. For x ≤ 2, use a closed circle because 2 is included, and shade to the left.',
    speech: 'To show x greater than 2, draw an open circle at 2 and shade to the right. For x less than or equal to 2, use a closed circle because 2 is included, and shade to the left.',
    quote: 'Open circle: not included. Closed circle: included.',
    bubble: 'Ride rule: at least 120 cm tall. That is x ≥ 120!',
    style: 'encouragement'
  },
  {
    id: 8,
    title: 'Step Into the Simulation Lab!',
    image: '/assets/images/slide8.jpg',
    body: "Awesome job! You've learned how integers, fractions, decimals, and irrational numbers all live on one number line. Now step into the lab to zoom, place, and solve number line mysteries!",
    speech: "Awesome job! You've learned how integers, fractions, decimals, and irrational numbers all live on one number line. Now step into the lab to zoom, place, and solve number line mysteries!",
    quote: 'Ready to test your number line skills?',
    bubble: 'Click below to enter the interactive lab!',
    style: 'celebration'
  }
];

/* -------------------------------------------------------------------------
   SIMULATION STATIONS (3 stations x 3 activities)
   Station 1 = discover / understand   Station 2 = try it yourself
   Station 3 = reverse-engineer challenge
   ------------------------------------------------------------------------- */
export const SIM_STATIONS = [
  {
    id: 1,
    title: 'Station 1: Discovery & Measurement Lab',
    subtitle: 'Real-world scales, depths & slices',
    icon: '🔬',
    activities: [
      {
        id: 1,
        icon: '🔬',
        title: 'Activity 1: Laser Micrometer',
        desc: 'Measure aerospace microchip wires between 0 mm and 1 mm. Zoom in three times to see that numbers never run out, just like Leo and Emma discovered!',
        speech: 'Measure aerospace microchip wires between 0 and 1 millimeter. Zoom in three times to see that numbers never run out, just like Leo and Emma discovered!',
        tipSpeech: 'Just like you can keep zooming a camera into a computer chip forever, you can always split any gap on a number line into 10 smaller tenths, then hundredths, then thousandths. Between 0 and 1 live infinitely many numbers!'
      },
      {
        id: 2,
        icon: '🤿',
        title: 'Activity 2: Deep Sea Sub & Sky Drone',
        desc: 'Submarine Nautilus dives below sea level (0 m) while a research drone flies above. Discover why opposites share the exact same distance from zero!',
        speech: 'Submarine Nautilus dives below sea level at zero meters while a research drone flies above. Discover why opposites share the exact same distance from zero!',
        tipSpeech: 'Absolute value is physical distance! A submarine diving 7 meters underwater, negative 7 meters, and a drone flying 7 meters in the air, positive 7 meters, are both exactly 7 meters away from the water surface at 0. Distance is never negative: the absolute value of negative 7 equals 7, and the absolute value of positive 7 equals 7!'
      },
      {
        id: 3,
        icon: '🍫',
        title: 'Activity 3: Artisan Bakery Slicer',
        desc: 'Slice a 1-meter artisan chocolate bar into equal portions. Find three equivalent cuts that match exactly half of the bar!',
        speech: 'Slice a 1-meter artisan chocolate bar into equal portions. Find three equivalent cuts that match exactly half of the bar!',
        tipSpeech: 'If you cut a 1-meter chocolate bar into 4 pieces and take 2, that is two quarters, the exact same amount of chocolate as cutting it into 8 pieces and taking 4, or four eighths. Both give exactly half the bar: 0.5 meters, or 500 grams!'
      }
    ]
  },
  {
    id: 2,
    title: 'Station 2: Polar Weather & Ride Safety',
    subtitle: 'Hands-on temperature & safety gates',
    icon: '🌡️',
    activities: [
      {
        id: 1,
        icon: '❄️',
        title: 'Activity 1: Polar Station Drop Zone',
        desc: 'Drop sensor readings onto the polar thermometer from negative freezing blizzards to warm greenhouses. Place all five cards and press Check!',
        speech: 'Drop sensor readings onto the polar thermometer from negative freezing blizzards to warm greenhouses. Place all five cards and press Check!',
        tipSpeech: 'Remember the thermometer rule: negative 2.5 degrees Celsius is colder than negative 1.5 degrees Celsius, so negative 2.5 must sit farther to the left from zero. The bigger a negative number looks, the colder and smaller it really is!'
      },
      {
        id: 2,
        icon: '🏔️',
        title: 'Activity 2: Arctic Mountain Order Up',
        desc: 'Rank expedition sensor readings from coldest on the left to warmest on the right, including negatives, decimals, and square roots!',
        speech: 'Rank expedition sensor readings from coldest on the left to warmest on the right, including negatives, decimals, and square roots!',
        tipSpeech: 'Remember: the square root of 2 is approximately 1.414, between 1 and 2, and pi is approximately 3.141, between 3 and 4. When comparing negatives, negative three halves equals negative 1.5, which is smaller and colder than negative 1.0 because it sits farther to the left!'
      },
      {
        id: 3,
        icon: '🎢',
        title: 'Activity 3: Roller Coaster Safety Gate',
        desc: 'Build the inequality graph for coaster height, wind speed, and coolant limits. Set the boundary, pick open or closed circle, and shade!',
        speech: 'Build the inequality graph for coaster height, wind speed, and coolant limits. Set the boundary, pick open or closed circle, and shade!',
        tipSpeech: 'Use a closed circle when the boundary number is allowed, which has the equals bar: less than or equal to, or greater than or equal to. Use an open circle when the value must strictly stay beyond the boundary, for less than or greater than!'
      }
    ]
  },
  {
    id: 3,
    title: 'Station 3: Railway & Rescue Detective Lab',
    subtitle: 'Reverse-engineer distance & roots',
    icon: '🕵️',
    activities: [
      {
        id: 1,
        icon: '🚄',
        title: 'Activity 1: High-Speed Rail Mystery',
        desc: 'Train beacons A and B mark two track mileposts. Calculate the step size between track sleepers, then find the exact kilometer of emergency beacon P!',
        speech: 'Train beacons A and B mark two track mileposts. Calculate the step size between track sleepers, then find the exact kilometer of emergency beacon P!',
        tipSpeech: 'Two-step method: first, find the step size by subtracting Beacon B minus Beacon A, then dividing by the number of tick intervals. Second, start at Beacon A and add or subtract one step size for each tick toward P!'
      },
      {
        id: 2,
        icon: '🚁',
        title: 'Activity 2: Coast Guard Rescue Midpoint',
        desc: 'A stranded vessel sits at A and a lighthouse sits at B. Calculate total patrol distance and deploy rescue helicopter M exactly halfway between them!',
        speech: 'A stranded vessel sits at A and a lighthouse sits at B. Calculate total patrol distance and deploy rescue helicopter M exactly halfway between them!',
        tipSpeech: 'For distance, subtract coordinates and take the absolute value: the absolute value of B minus A. Distance is always positive! For the midpoint, find the average coordinate: A plus B, divided by 2. That is the exact point halfway between them!'
      },
      {
        id: 3,
        icon: '🏛️',
        title: 'Activity 3: Architectural Tile Root Squeeze',
        desc: 'Cut a square marble tile with target area N. Squeeze side length x until x times x matches the target, finding the exact spot of the square root!',
        speech: 'Cut a square marble tile with target area N. Squeeze side length x until x times x matches the target, finding the exact spot of the square root!',
        tipSpeech: 'Numbers like the square root of 2, the square root of 3, and the square root of 5 are irrational. Their decimals go on forever without ever repeating, yet they have an exact physical spot on the number line!'
      }
    ]
  }
];

/* -------------------------------------------------------------------------
   REFLECT + FEEDBACK LINES (all pre-generated as static audio)
   ------------------------------------------------------------------------- */
export const REFLECT = {
  cheer: 'Great work completing the module!',
  question: 'What did you learn about the number line? Explain it to Robo with an example!'
};

export const CORRECT_LINES = [
  'Correct! Excellent number line thinking!',
  'Yes! You placed that perfectly!',
  'Spot on! Keep going!',
  "Brilliant! That's exactly right!"
];
export const WRONG_LINES = [
  'Not quite! Look at where it sits on the line.',
  'Almost! Check left and right again.',
  "Good try! Let's learn from this one.",
  'Oops! Count the steps carefully next time.'
];
export const SIM_SUCCESS_LINES = [
  'Awesome! Mission complete!',
  'Fantastic work! You cracked it!',
  'Great job, number line explorer!'
];
export const SIM_RETRY_LINE = 'Not quite yet. Check the hint and try again!';
export const REFLECT_DONE_LINE = 'Outstanding reflection! Lesson complete!';

/* -------------------------------------------------------------------------
   PRACTICE WORLDS
   ------------------------------------------------------------------------- */
export const PRACTICE_WORLDS = [
  { id: 0, name: 'Thermometer Town',    icon: '🌡️', range: 'Q1–10',   difficulty: 1, types: ['read_point', 'opposite', 'greater_int'] },
  { id: 1, name: 'Submarine Sea',       icon: '🤿', range: 'Q11–20',  difficulty: 1, types: ['opposite', 'read_point', 'dist', 'order_int'] },
  { id: 2, name: 'Elevator Tower',      icon: '🛗', range: 'Q21–30',  difficulty: 2, types: ['order_int', 'dist', 'greater_int'] },
  { id: 3, name: 'Fraction Bakery',     icon: '🥐', range: 'Q31–40',  difficulty: 2, types: ['frac_place', 'greater_frac', 'frac_place'] },
  { id: 4, name: 'Decimal Dock',        icon: '⚓', range: 'Q41–50',  difficulty: 3, types: ['dec_place', 'greater_dec', 'dec_place'] },
  { id: 5, name: 'Absolute Mountain',   icon: '⛰️', range: 'Q51–60',  difficulty: 3, types: ['abs_val', 'abs_compare', 'abs_eq'] },
  { id: 6, name: 'Distance Desert',     icon: '🏜️', range: 'Q61–70',  difficulty: 3, types: ['dist_ctx', 'midpoint', 'dist'] },
  { id: 7, name: 'Irrational Island',   icon: '🏝️', range: 'Q71–80',  difficulty: 4, types: ['sqrt_between', 'irrational_id', 'sqrt_est'] },
  { id: 8, name: 'Inequality Coaster',  icon: '🎢', range: 'Q81–90',  difficulty: 4, types: ['ineq_read', 'ineq_member', 'compound_count'] },
  { id: 9, name: 'Number Line Citadel', icon: '🏰', range: 'Q91–100', difficulty: 4, types: [
    'read_point', 'opposite', 'order_int', 'dist_ctx', 'midpoint', 'frac_place', 'dec_place',
    'abs_compare', 'sqrt_between', 'irrational_id', 'ineq_read', 'ineq_member', 'compound_count'
  ] }
];

/* -------------------------------------------------------------------------
   DETERMINISTIC RNG & SPOKEN MATH PRONUNCIATION
   ------------------------------------------------------------------------- */
function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (arr, rng = Math.random) => arr[Math.floor(rng() * arr.length)];
const randInt = (min, max, rng = Math.random) => Math.floor(rng() * (max - min + 1)) + min;
const coin = (p = 0.5, rng = Math.random) => rng() < p;

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speakFrac(nStr, dStr) {
  const n = Number(nStr);
  const d = Number(dStr);
  if (n === 1 && d === 2) return 'one half';
  if (n === 1 && d === 3) return 'one third';
  if (n === 2 && d === 3) return 'two thirds';
  if (n === 1 && d === 4) return 'one quarter';
  if (n === 3 && d === 4) return 'three quarters';
  const denomWords = {
    2: ['half', 'halves'],
    3: ['third', 'thirds'],
    4: ['fourth', 'fourths'],
    5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'],
    7: ['seventh', 'sevenths'],
    8: ['eighth', 'eighths'],
    9: ['ninth', 'ninths'],
    10: ['tenth', 'tenths'],
    12: ['twelfth', 'twelfths']
  };
  const pair = denomWords[d];
  if (pair) return `${n === 1 ? 'one' : n} ${n === 1 ? pair[0] : pair[1]}`;
  return `${n} over ${d}`;
}

/** Convert displayed math symbols into natural, crystal-clear spoken English. */
export function toSpokenMath(raw) {
  if (!raw) return '';
  let s = String(raw);

  // Clean repeating notation & special constants
  s = s.replace(/…\s*\(repeating\)/g, ' repeating');
  s = s.replace(/…/g, ' repeating');
  s = s.replace(/π/g, 'pi');
  s = s.replace(/°C/g, ' degrees Celsius');
  s = s.replace(/\bm²\b/g, 'square meters');
  s = s.replace(/(\d+|x)\s*²/g, '$1 squared');
  s = s.replace(/≈/g, ' is approximately ');
  s = s.replace(/÷/g, ' divided by ');
  s = s.replace(/×/g, ' times ');

  // Units after numbers (before minus/fraction conversion so m stays distinct)
  s = s.replace(/(\d+(?:\.\d+)?)\s*mm\b/g, '$1 millimeters');
  s = s.replace(/(\d+(?:\.\d+)?)\s*µm\b/g, '$1 micrometers');
  s = s.replace(/(\d+(?:\.\d+)?)\s*km\b/g, '$1 kilometers');
  s = s.replace(/(\d+(?:\.\d+)?)\s*NM\b/g, '$1 nautical miles');
  s = s.replace(/(\d+(?:\.\d+)?)\s*m\b/g, '$1 meters');

  // Compound inequalities: a ≤ x < b
  s = s.replace(
    /([−-]?\d+(?:\.\d+)?)\s*(≤|<)\s*x\s*(≤|<)\s*([−-]?\d+(?:\.\d+)?)/g,
    (_, lo, op1, op2, hi) =>
      `${lo} ${op1 === '≤' ? 'is less than or equal to' : 'is less than'} x, and x ${op2 === '≤' ? 'is less than or equal to' : 'is less than'} ${hi}`
  );

  // Simple inequalities: x ≥ a, x < a, etc.
  s = s.replace(
    /\bx\s*(≥|≤|>|<)\s*([−-]?\d+(?:\.\d+)?)/g,
    (_, op, val) => {
      const words = {
        '>': 'is greater than',
        '≥': 'is greater than or equal to',
        '<': 'is less than',
        '≤': 'is less than or equal to'
      };
      return `x ${words[op]} ${val}`;
    }
  );

  // Standalone inequality symbols inside text
  s = s.replace(/≥/g, ' is greater than or equal to ');
  s = s.replace(/≤/g, ' is less than or equal to ');

  // Absolute values |expr|
  s = s.replace(/the absolute value\s+\|([^|]+)\|/gi, (_, inner) => `the absolute value of ${inner.trim()}`);
  s = s.replace(/\|([^|]+)\|/g, (_, inner) => `the absolute value of ${inner.trim()}`);

  // Square roots √n or −√n
  s = s.replace(/([−-])\s*√(\d+(?:\.\d+)?)/g, 'negative the square root of $2');
  s = s.replace(/√(\d+(?:\.\d+)?)/g, 'the square root of $1');

  // Fractions: −3/4 or 3/4
  s = s.replace(/(^|[^\d.])([−-]?)(\d+)\/(\d+)(?!\d)/g, (_, pre, neg, n, d) => {
    return `${pre}${neg ? 'negative ' : ''}${speakFrac(n, d)}`;
  });

  // Unwrap parenthesized unary negatives like (−3) -> −3, and clean "(a + b) divided by 2"
  s = s.replace(/\(([−-]\d+(?:\.\d+)?)\)/g, '$1');
  s = s.replace(/\(([^()]+)\)\s*divided by/g, '$1, divided by');

  // Binary subtraction: "a − b" or "5 − 3" -> "a minus b"
  s = s.replace(/([a-zA-Z0-9)])\s+[−-]\s+/g, '$1 minus ');

  // Unary negative numbers: −5 or -5
  s = s.replace(/(^|[\s(,:;])[−-](\d+(?:\.\d+)?)/g, '$1negative $2');

  // Equals and plus
  s = s.replace(/\s*=\s*/g, ' equals ');
  s = s.replace(/\s+\+\s+/g, ' plus ');

  return s.replace(/\s+/g, ' ').replace(/\s+([,?.!;:])/g, '$1').trim();
}

/** Choose a neat axis (min, max, tick & label steps) for an integer window. */
export function axisFor(lo, hi) {
  const span = Math.max(1, hi - lo);
  const steps = [1, 2, 5, 10, 20, 50, 100];
  const ls = steps.find((s) => span / s <= 12) || 100;
  const tickMap = { 1: 1, 2: 1, 5: 1, 10: 5, 20: 5, 50: 10, 100: 20 };
  return {
    min: Math.floor(lo / ls) * ls,
    max: Math.ceil(hi / ls) * ls,
    tickStep: tickMap[ls],
    labelStep: ls
  };
}

/** Build 4 unique shuffled options with the correct one tracked. */
function buildChoices(correct, distractors, fillers = [], rng = Math.random) {
  const opts = [correct];
  for (const d of [...distractors, ...fillers]) {
    if (opts.length >= 4) break;
    if (d != null && !opts.includes(d)) opts.push(d);
  }
  let k = 1;
  while (opts.length < 4) {
    const s = String(k++);
    if (!opts.includes(s)) opts.push(s);
  }
  const options = shuffle(opts, rng);
  return { options, correctIndex: options.indexOf(correct) };
}

const plural = (n, w) => `${n} ${w}${Math.abs(n) === 1 ? '' : 's'}`;

function distinctInts(count, lo, hi, minNegatives = 2, rng = Math.random) {
  for (let tries = 0; tries < 200; tries++) {
    const set = new Set();
    while (set.size < count) set.add(randInt(lo, hi, rng));
    const arr = [...set];
    if (arr.filter((v) => v < 0).length >= minNegatives) return arr;
  }
  return [-7, -3, 2, 5].slice(0, count);
}

/* -------------------------------------------------------------------------
   QUESTION ARCHETYPES
   each returns { prompt, correct, distractors, fillers?, diagram, rule, hint, explanation, options? }
   ------------------------------------------------------------------------- */
const ARCH = {
  read_point(diff, rng = Math.random, variant = 0) {
    const lo = randInt(-8, -2, rng);
    const span = variant % 2 === 0 ? 10 : 12;
    const hi = lo + span;
    let p = randInt(lo + 1, hi - 1, rng);
    if (p === 0 && coin(0.7, rng)) p = randInt(1, hi - 1, rng);
    const labels = [];
    for (let v = lo; v <= hi; v++) {
      if (v === p) continue;
      if (diff <= 1 || v === lo || v === hi || v === 0 || v % 5 === 0) labels.push(v);
    }
    const promptTemplates = [
      `On the number line from ${fmt(lo)} to ${fmt(hi)}, what number does point P show?`,
      `Look at point P between ${fmt(lo)} and ${fmt(hi)} on the number line. What number does it show?`,
      `Count the tick marks from 0 on this ${fmt(lo)} to ${fmt(hi)} number line. What value is at point P?`
    ];
    const hintTemplates = [
      `On the ${fmt(lo)} to ${fmt(hi)} line, point P sits ${p < 0 ? 'to the left' : 'to the right'} of 0. Count each tick mark from 0 to find its value.`,
      `Point P is ${p < 0 ? 'negative (left of 0)' : 'positive (right of 0)'} on this ${fmt(lo)} to ${fmt(hi)} scale. Count the ticks from 0 toward P.`,
      `Between ${fmt(lo)} and ${fmt(hi)}, start at 0 and count each unit step ${p < 0 ? 'left' : 'right'} until you land on P.`
    ];
    return {
      prompt: promptTemplates[variant % promptTemplates.length],
      correct: fmt(p),
      distractors: [fmt(-p), fmt(p + 1), fmt(p - 1)],
      fillers: [fmt(p + 2), fmt(p - 2)],
      diagram: { min: lo, max: hi, tickStep: 1, labels, points: [{ v: p, label: 'P', color: '#facc15' }] },
      rule: 'READ THE TICKS RULE',
      hint: p === 0
        ? `Check the center tick mark halfway between ${fmt(lo)} and ${fmt(hi)} on this line.`
        : hintTemplates[variant % hintTemplates.length],
      explanation: p === 0
        ? 'Point P sits exactly on 0.'
        : `Point P is ${plural(Math.abs(p), 'step')} ${p < 0 ? 'left' : 'right'} of 0, so P = ${fmt(p)}.`
    };
  },

  opposite(diff, rng = Math.random) {
    const n = randInt(2, 6 + 3 * diff, rng) * (coin(0.5, rng) ? 1 : -1);
    const R = Math.abs(n) + 2;
    return {
      prompt: `What is the opposite of ${fmt(n)}?`,
      correct: fmt(-n),
      distractors: [fmt(n), fracStr(1, n), '0'],
      fillers: [fmt(-n + (n > 0 ? 1 : -1)), fmt(2 * n)],
      diagram: {
        min: -R, max: R, tickStep: 1, labelStep: R > 8 ? 5 : 1, mirror: true,
        points: [{ v: n, label: fmt(n), color: '#facc15' }]
      },
      rule: 'OPPOSITES RULE',
      hint: `Opposites sit the same distance from 0 on opposite sides. Since ${fmt(n)} is ${Math.abs(n)} steps ${n > 0 ? 'right' : 'left'} of 0, look ${Math.abs(n)} steps on the ${n > 0 ? 'left' : 'right'} side.`,
      explanation: `The opposite of ${fmt(n)} is the same distance from 0 on the other side: ${fmt(-n)}.`
    };
  },

  greater_int(diff, rng = Math.random) {
    const vals = distinctInts(4, -9, 9, 2, rng);
    const mode = coin(0.5, rng) ? 'max' : 'min';
    const ans = mode === 'max' ? Math.max(...vals) : Math.min(...vals);
    return {
      prompt: `Which number is farthest to the ${mode === 'max' ? 'right' : 'left'} on the number line: ${vals.map(fmt).join(', ')}?`,
      correct: fmt(ans),
      distractors: vals.filter((v) => v !== ans).map(fmt),
      diagram: { min: -10, max: 10, tickStep: 1, labelStep: 5 },
      rule: 'LEFT < RIGHT RULE',
      hint: mode === 'max'
        ? `Right means greater on the number line. Compare the positive numbers among ${vals.map(fmt).join(', ')} to find the greatest.`
        : `Left means smaller on the number line. Among ${vals.map(fmt).join(', ')}, the negative number farthest from 0 sits farthest left.`,
      explanation: `Right means greater and left means smaller, so the ${mode === 'max' ? 'greatest' : 'least'} number is ${fmt(ans)}.`
    };
  },

  order_int(_diff, rng = Math.random) {
    const vals = distinctInts(4, -9, 9, 2, rng);
    const asc = [...vals].sort((a, b) => a - b);
    const desc = [...asc].reverse();
    const byAbs = [...vals].sort((a, b) => Math.abs(a) - Math.abs(b));
    const swapped = [...asc];
    const si = randInt(0, 2, rng);
    [swapped[si], swapped[si + 1]] = [swapped[si + 1], swapped[si]];
    const str = (arr) => arr.map(fmt).join(', ');
    const shown = shuffle(vals, rng);
    return {
      prompt: `Arrange from smallest to largest: ${shown.map(fmt).join(', ')}`,
      correct: str(asc),
      distractors: [str(desc), str(byAbs), str(swapped)],
      fillers: [str([asc[1], asc[0], asc[3], asc[2]])],
      diagram: { min: -10, max: 10, tickStep: 1, labelStep: 5 },
      rule: 'LEFT < RIGHT RULE',
      hint: `For ${shown.map(fmt).join(', ')}, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.`,
      explanation: `Correct order: ${str(asc)}.`
    };
  },

  dist(diff, rng = Math.random) {
    const R = 4 + 2 * diff;
    let a, b;
    do { a = randInt(-R, R, rng); b = randInt(-R, R, rng); } while (a === b || Math.abs(a - b) < 3);
    const d = Math.abs(a - b);
    const ax = axisFor(Math.min(a, b) - 1, Math.max(a, b) + 1);
    return {
      prompt: `Point A is at ${fmt(a)} and point B is at ${fmt(b)}. How far apart are they?`,
      correct: fmt(d),
      distractors: [fmt(Math.abs(a) + Math.abs(b)), fmt(Math.abs(Math.abs(a) - Math.abs(b))), fmt(a + b), fmt(a - b)],
      fillers: [fmt(d + 1), fmt(d - 1)],
      diagram: {
        ...ax,
        points: [{ v: a, label: 'A', color: '#facc15' }, { v: b, label: 'B', color: '#38bdf8' }],
        segments: [{ a, b, label: '?', color: '#4ade80' }]
      },
      rule: '|a − b| RULE',
      hint: `Count the total steps from ${fmt(Math.min(a, b))} up to ${fmt(Math.max(a, b))}, or compute |${fmt(a)} − ${b < 0 ? '(' + fmt(b) + ')' : fmt(b)}|. Distance is never negative.`,
      explanation: `Distance = |${fmt(a)} − ${b < 0 ? '(' + fmt(b) + ')' : fmt(b)}| = ${fmt(d)}.`
    };
  },

  dist_ctx(diff, rng = Math.random) {
    const kind = pick(['temp', 'depth', 'floor'], rng);
    let prompt, a, b, correct, distractors, hint, explanation, lo, hi;
    if (kind === 'temp') {
      a = randInt(2, 6 + 2 * diff, rng); b = randInt(3, 10 + diff, rng);
      prompt = `At night the temperature is ${fmt(-a)}°C. By noon it is ${fmt(b)}°C. By how many degrees did it rise?`;
      correct = String(a + b);
      distractors = [String(Math.abs(b - a)), String(a), String(b)];
      hint = `First count the steps from ${fmt(-a)}°C up to 0°C, then add the steps from 0°C up to ${b}°C.`;
      explanation = `From ${fmt(-a)} up to 0 is ${a}, then 0 up to ${b} is ${b}. Total rise = ${a + b}°C.`;
      lo = -a; hi = b;
    } else if (kind === 'depth') {
      a = randInt(5, 10 * diff, rng); b = randInt(4, 8 * diff, rng);
      prompt = `A diver is ${a} m below sea level and a gull flies ${b} m above sea level. How far apart are they?`;
      correct = `${a + b} m`;
      distractors = [`${Math.abs(a - b)} m`, `${a} m`, `${b} m`];
      hint = `Sea level is 0 m. Add the diver's distance below 0 (${a} m) and the gull's height above 0 (${b} m).`;
      explanation = `The diver is at ${fmt(-a)} and the gull at ${b}, so the distance is ${a} + ${b} = ${a + b} m.`;
      lo = -a; hi = b;
    } else {
      a = randInt(2, 5, rng); b = randInt(5, 10, rng);
      prompt = `An elevator starts at basement floor ${fmt(-a)} and goes up to floor ${b}. How many floors does it travel?`;
      correct = String(a + b);
      distractors = [String(Math.abs(b - a)), String(a), String(b)];
      hint = `Ground level is 0. Count the floors from basement ${fmt(-a)} up to 0, then add the floors up to ${b}.`;
      explanation = `From ${fmt(-a)} to ${b} is |${b} − (${fmt(-a)})| = ${a + b} floors.`;
      lo = -a; hi = b;
    }
    const ax = axisFor(lo - 1, hi + 1);
    return {
      prompt, correct, distractors,
      fillers: [String(a + b + 1), String(a + b - 1)].map((s) => (kind === 'depth' ? `${s} m` : s)),
      diagram: { ...ax, points: [{ v: lo, label: fmt(lo), color: '#38bdf8' }, { v: hi, label: fmt(hi), color: '#facc15' }], segments: [{ a: lo, b: hi, label: '?', color: '#4ade80' }] },
      rule: '|a − b| RULE',
      hint,
      explanation
    };
  },

  midpoint(diff, rng = Math.random) {
    const R = 4 + 3 * diff;
    let a, b;
    do { a = randInt(-R, R, rng); b = randInt(-R, R, rng); } while (b - a < 3);
    const m = (a + b) / 2;
    const ax = axisFor(a - 1, b + 1);
    return {
      prompt: `What number is exactly halfway between ${fmt(a)} and ${fmt(b)}?`,
      correct: fmt(m),
      distractors: [fmt(a + b), fmt((b - a) / 2), fmt(b - a), fmt(m + 1)],
      fillers: [fmt(m - 1)],
      diagram: { ...ax, points: [{ v: a, label: 'A', color: '#facc15' }, { v: b, label: 'B', color: '#38bdf8' }, { v: m, label: 'M?', color: '#4ade80', hollow: true }] },
      rule: 'MIDPOINT RULE',
      hint: `To find the midpoint between ${fmt(a)} and ${fmt(b)}, add the two numbers together and divide by 2: (${fmt(a)} + ${b < 0 ? '(' + fmt(b) + ')' : fmt(b)}) ÷ 2.`,
      explanation: `Midpoint = (${fmt(a)} + ${b < 0 ? '(' + fmt(b) + ')' : fmt(b)}) ÷ 2 = ${fmt(m)}.`
    };
  },

  frac_place(diff, rng = Math.random, variant = 0) {
    const d = randInt(3, Math.min(8, 4 + diff), rng);
    const k = randInt(1, d - 1, rng);
    const neg = diff >= 3 ? coin(0.5, rng) : (variant % 2 === 1);
    const sign = neg ? -1 : 1;
    const v = (sign * k) / d;
    const promptTemplates = [
      `The distance from ${neg ? '−1 to 0' : '0 to 1'} is split into ${d} equal parts. What fraction does point P show?`,
      `Between ${neg ? '−1 and 0' : '0 and 1'}, the line is divided into ${d} equal parts. Which fraction is marked at P?`
    ];
    return {
      prompt: promptTemplates[variant % promptTemplates.length],
      correct: fracStr(sign * k, d),
      distractors: [fracStr(sign * (k + 1), d), fracStr(sign * (k - 1), d), fracStr(sign * k, d + 1), fracStr(-sign * k, d)],
      fillers: [fracStr(sign * d, k)],
      diagram: {
        min: neg ? -1 : 0, max: neg ? 0 : 1, tickStep: 1 / d, labels: neg ? [-1, 0] : [0, 1],
        points: [{ v, label: 'P', color: '#facc15' }]
      },
      rule: 'EQUAL PARTS RULE',
      hint: `Each equal step between ${neg ? '−1 and 0' : '0 and 1'} is 1/${d}. Count how many steps point P sits ${neg ? 'left of 0' : 'right of 0'}, and simplify if possible.`,
      explanation: `Each part is 1/${d}. P is ${plural(k, 'part')} ${neg ? 'left of 0' : 'right of 0'}, so P = ${fracStr(sign * k, d)}.`
    };
  },

  greater_frac(_diff, rng = Math.random) {
    const dens = [2, 3, 4, 5, 6, 8];
    let items = [];
    for (let tries = 0; tries < 300 && items.length < 4; tries++) {
      const d = pick(dens, rng);
      const n = randInt(-2 * d + 1, 2 * d - 1, rng);
      if (n === 0 || n % d === 0) continue;
      const v = n / d;
      if (items.some((it) => Math.abs(it.v - v) < 0.04)) continue;
      items.push({ n, d, v });
    }
    if (!items.some((i) => i.v < 0)) items[0] = { n: -3, d: 4, v: -0.75 };
    const mode = coin(0.5, rng) ? 'max' : 'min';
    const target = items.reduce((best, it) => (mode === 'max' ? (it.v > best.v ? it : best) : (it.v < best.v ? it : best)));
    const s = (it) => fracStr(it.n, it.d);
    const dec = (it) => `${s(it)} = ${fmt(Math.round(it.v * 1000) / 1000)}`;
    return {
      prompt: `Which fraction is farthest to the ${mode === 'max' ? 'right' : 'left'} on the number line: ${items.map(s).join(', ')}?`,
      correct: s(target),
      distractors: items.filter((i) => i !== target).map(s),
      diagram: { min: -2, max: 2, tickStep: 0.5, labels: [-2, -1, 0, 1, 2] },
      rule: 'LEFT < RIGHT RULE',
      hint: `Convert ${items.map(s).join(', ')} into decimals to compare them. ${mode === 'max' ? 'The greatest positive fraction sits farthest right.' : 'Among negative fractions, the one farthest left of 0 is smallest.'}`,
      explanation: `As decimals: ${items.map(dec).join('; ')}. The ${mode === 'max' ? 'greatest' : 'least'} is ${s(target)}.`
    };
  },

  dec_place(diff, rng = Math.random, variant = 0) {
    const hundredths = diff >= 3 && coin(0.5, rng);
    if (!hundredths) {
      const a = randInt(-3, 3, rng);
      const j = randInt(1, 9, rng);
      const v = a + j / 10;
      const promptTemplates = [
        `The distance from ${fmt(a)} to ${fmt(a + 1)} is split into 10 equal parts. What decimal does point P show?`,
        `Between ${fmt(a)} and ${fmt(a + 1)}, there are 10 equal tenths. What decimal is at point P?`
      ];
      return {
        prompt: promptTemplates[variant % promptTemplates.length],
        correct: fmtFixed(v, 1),
        distractors: [fmtFixed(a + 1 - j / 10, 1), fmtFixed(a + (j + 1) / 10, 1), fmtFixed(a + (j - 1) / 10, 1), fmtFixed(-v, 1)],
        fillers: [fmtFixed(a + (j + 2) / 10, 1)],
        diagram: { min: a, max: a + 1, tickStep: 0.1, labels: [a, a + 1], points: [{ v, label: 'P', color: '#facc15' }] },
        rule: 'TENTHS RULE',
        hint: `Each tick mark between ${fmt(a)} and ${fmt(a + 1)} adds 0.1. Start at ${fmt(a)} and count the tenths to the right up to P.`,
        explanation: `Each part is 0.1. P is ${j} parts right of ${fmt(a)}, so P = ${fmt(a)} + ${(j / 10).toFixed(1)} = ${fmtFixed(v, 1)}.`
      };
    }
    const a = randInt(-2, 2, rng);
    const t = randInt(0, 8, rng);
    const base = a + t / 10;
    const j = randInt(1, 9, rng);
    const v = base + j / 100;
    const promptTemplates = [
      `The distance from ${fmtFixed(base, 1)} to ${fmtFixed(base + 0.1, 1)} is split into 10 equal parts. What decimal does point P show?`,
      `Zoomed in from ${fmtFixed(base, 1)} to ${fmtFixed(base + 0.1, 1)} with 10 equal parts, what decimal does point P mark?`
    ];
    return {
      prompt: promptTemplates[variant % promptTemplates.length],
      correct: fmtFixed(v, 2),
      distractors: [fmtFixed(base + 0.1 - j / 100, 2), fmtFixed(base + (j + 1) / 100, 2), fmtFixed(base + (j - 1) / 100, 2), fmtFixed(base + j / 10, 2)],
      fillers: [fmtFixed(base + (j + 2) / 100, 2)],
      diagram: {
        min: base, max: base + 0.1, tickStep: 0.01, labels: [base, base + 0.1],
        labelFmt: (x) => fmtFixed(x, 1), points: [{ v, label: 'P', color: '#facc15' }]
      },
      rule: 'HUNDREDTHS RULE',
      hint: `Each small tick between ${fmtFixed(base, 1)} and ${fmtFixed(base + 0.1, 1)} is 0.01. Start at ${fmtFixed(base, 1)} and count the hundredths up to P.`,
      explanation: `Each part is 0.01. P is ${j} parts right of ${fmtFixed(base, 1)}, so P = ${fmtFixed(v, 2)}.`
    };
  },

  greater_dec(_diff, rng = Math.random) {
    let vals = [];
    for (let tries = 0; tries < 300 && vals.length < 4; tries++) {
      const v = randInt(-250, 250, rng) / 100;
      if (Math.abs(v) < 0.05) continue;
      if (vals.some((x) => Math.abs(x - v) < 0.04)) continue;
      vals.push(v);
    }
    if (!vals.some((v) => v < 0)) vals[0] = -0.3;
    const mode = coin(0.5, rng) ? 'max' : 'min';
    const ans = mode === 'max' ? Math.max(...vals) : Math.min(...vals);
    return {
      prompt: `Which decimal is farthest to the ${mode === 'max' ? 'right' : 'left'} on the number line: ${vals.map(fmt).join(', ')}?`,
      correct: fmt(ans),
      distractors: vals.filter((v) => v !== ans).map(fmt),
      diagram: { min: -3, max: 3, tickStep: 0.5, labels: [-3, -2, -1, 0, 1, 2, 3] },
      rule: 'LEFT < RIGHT RULE',
      hint: `Compare the decimals ${vals.map(fmt).join(', ')} by tenths and hundredths. ${mode === 'max' ? 'Positive decimals always sit farther right than negatives.' : 'For negative decimals, the one with the largest magnitude sits farthest left.'}`,
      explanation: `In order from least to greatest: ${[...vals].sort((a, b) => a - b).map(fmt).join(', ')}. The ${mode === 'max' ? 'greatest' : 'least'} is ${fmt(ans)}.`
    };
  },

  abs_val(diff, rng = Math.random) {
    if (coin(0.4, rng)) {
      const a = randInt(2, 6 + diff, rng) * -1;
      const b = randInt(2, 6 + diff, rng);
      return {
        prompt: `What is |${fmt(a)}| + |${fmt(b)}|?`,
        correct: fmt(Math.abs(a) + Math.abs(b)),
        distractors: [fmt(a + b), fmt(Math.abs(a + b)), fmt(Math.abs(a) - Math.abs(b)), fmt(-(Math.abs(a) + Math.abs(b)))],
        diagram: { ...axisFor(a - 1, b + 1), points: [{ v: a, label: fmt(a), color: '#facc15' }, { v: b, label: fmt(b), color: '#38bdf8' }], segments: [{ a: 0, b: a, label: `|${fmt(a)}|`, color: '#facc15' }, { a: 0, b: b, label: `|${fmt(b)}|`, color: '#38bdf8' }] },
        rule: 'DISTANCE FROM ZERO RULE',
        hint: `Find each number's positive distance from 0 first: |${fmt(a)}| and |${fmt(b)}|, then add those two positive distances together.`,
        explanation: `|${fmt(a)}| = ${Math.abs(a)} and |${fmt(b)}| = ${b}, so the sum is ${Math.abs(a) + Math.abs(b)}.`
      };
    }
    const n = randInt(2, 9 + diff, rng) * (coin(0.7, rng) ? -1 : 1);
    const R = Math.abs(n) + 2;
    return {
      prompt: `What is the absolute value |${fmt(n)}|?`,
      correct: fmt(Math.abs(n)),
      distractors: [fmt(-Math.abs(n)), '0', fmt(2 * Math.abs(n)), fracStr(1, Math.abs(n))],
      diagram: { min: -R, max: R, tickStep: 1, labelStep: R > 8 ? 5 : 1, points: [{ v: n, label: fmt(n), color: '#facc15' }], segments: [{ a: 0, b: n, label: '?', color: '#4ade80' }] },
      rule: 'DISTANCE FROM ZERO RULE',
      hint: `Absolute value measures how many steps ${fmt(n)} is from 0 on the number line. Distance is never negative!`,
      explanation: `${fmt(n)} is ${Math.abs(n)} steps from 0, so |${fmt(n)}| = ${Math.abs(n)}. Distance is never negative.`
    };
  },

  abs_compare(_diff, rng = Math.random) {
    let vals;
    for (let tries = 0; tries < 200; tries++) {
      vals = distinctInts(4, -12, 12, 1, rng);
      const abs = vals.map(Math.abs);
      if (new Set(abs).size === 4) break;
    }
    const ans = vals.reduce((best, v) => (Math.abs(v) > Math.abs(best) ? v : best));
    return {
      prompt: `Which number has the greatest absolute value: ${vals.map(fmt).join(', ')}?`,
      correct: fmt(ans),
      distractors: vals.filter((v) => v !== ans).map(fmt),
      diagram: { min: -12, max: 12, tickStep: 1, labelStep: 4, mirror: true },
      rule: 'DISTANCE FROM ZERO RULE',
      hint: `Compare each number's distance from 0 among ${vals.map(fmt).join(', ')} without its minus sign. The one farthest from 0 has the greatest absolute value.`,
      explanation: `Distances from 0: ${vals.map((v) => `|${fmt(v)}| = ${Math.abs(v)}`).join(', ')}. The largest is ${fmt(ans)}.`
    };
  },

  abs_eq(_diff, rng = Math.random) {
    const n = randInt(2, 12, rng);
    return {
      prompt: `Which numbers have an absolute value of ${n}?`,
      correct: `${n} and ${MINUS}${n}`,
      distractors: [`${n} only`, `${MINUS}${n} only`, `0 and ${n}`],
      fillers: [`${n} and ${2 * n}`],
      diagram: { min: -n - 2, max: n + 2, tickStep: 1, labelStep: n + 2 > 8 ? 5 : 1, mirror: true, points: [{ v: n, label: fmt(n), color: '#facc15' }, { v: -n, label: fmt(-n), color: '#38bdf8' }] },
      rule: 'DISTANCE FROM ZERO RULE',
      hint: `Think in both directions from 0: you can walk ${n} steps to the right OR ${n} steps to the left.`,
      explanation: `Both ${n} and ${MINUS}${n} are exactly ${n} steps from 0, so |${n}| = |${MINUS}${n}| = ${n}.`
    };
  },

  sqrt_between(diff, rng = Math.random) {
    const max = diff >= 4 ? 80 : 50;
    let n;
    do { n = randInt(2, max, rng); } while (Number.isInteger(Math.sqrt(n)));
    const k = Math.floor(Math.sqrt(n));
    const h = Math.floor(n / 2);
    return {
      prompt: `Between which two consecutive integers does √${n} lie?`,
      correct: `${k} and ${k + 1}`,
      distractors: [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${h} and ${h + 1}`],
      fillers: [`${k + 2} and ${k + 3}`, `${k - 2} and ${k - 1}`],
      diagram: { min: k - 1, max: k + 2, tickStep: 0.5, labels: [k - 1, k, k + 1, k + 2], points: [{ v: Math.sqrt(n), label: `√${n}`, color: '#facc15' }] },
      rule: 'SQUEEZE RULE',
      hint: `Check perfect squares near ${n}: find the whole number whose square is just below ${n} and the next whole number whose square is just above ${n}.`,
      explanation: `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}. Since ${k * k} < ${n} < ${(k + 1) ** 2}, √${n} is between ${k} and ${k + 1}.`
    };
  },

  irrational_id(_diff, rng = Math.random) {
    const irr = pick(['√2', '√3', '√5', '√7', '√11', '√13', 'π', '√17'], rng);
    const rats = shuffle(['√16', '√49', '0.25', `${MINUS}3/7`, '22/7', `${MINUS}5`, '0.333… (repeating)', '√0.25', '√81'], rng).slice(0, 3);
    const { options, correctIndex } = buildChoices(irr, rats, [], rng);
    return {
      prompt: `Which of these numbers is irrational: ${options.join(', ')}?`,
      correct: irr,
      distractors: rats,
      options,
      correctIndex,
      diagram: { min: -4, max: 4, tickStep: 1, labelStep: 1 },
      rule: 'NEVER-ENDING RULE',
      hint: `Among ${options.join(', ')}, look for the number whose decimal never ends and never repeats (like pi or the square root of a non-square number).`,
      explanation: `${irr} has a decimal that never ends and never repeats. The others can be written as fractions (for example √16 = 4 and 22/7 is only close to π).`
    };
  },

  sqrt_est(_diff, rng = Math.random) {
    let n;
    do { n = randInt(2, 40, rng); } while (Number.isInteger(Math.sqrt(n)));
    const k = Math.floor(Math.sqrt(n));
    const est = Number(Math.sqrt(n).toFixed(1));
    const fixed = (x) => x.toFixed(1);
    return {
      prompt: `Which is the best estimate of √${n} to one decimal place?`,
      correct: fixed(est),
      distractors: [fixed(est + 0.3), fixed(est - 0.3), fixed(est + 0.6), fixed(est - 0.6)].filter((s) => Number(s) > 0),
      fillers: [fixed(n / 2)],
      diagram: { min: k, max: k + 1, tickStep: 0.1, labels: [k, k + 1], points: [{ v: Math.sqrt(n), label: `√${n}`, color: '#facc15' }] },
      rule: 'SQUEEZE RULE',
      hint: `Multiply each decimal choice by itself (squaring it) and see which result lands closest to ${n}. Look between ${k} and ${k + 1}.`,
      explanation: `${fixed(est)} × ${fixed(est)} = ${(est * est).toFixed(2)}, which is closest to ${n}. So √${n} ≈ ${fixed(est)}.`
    };
  },

  ineq_read(_diff, rng = Math.random, variant = 0) {
    const a = randInt(-6, 6, rng);
    const op = pick(['>', '≥', '<', '≤'], rng);
    const right = op === '>' || op === '≥';
    const closed = op === '≥' || op === '≤';
    const opts = ['>', '≥', '<', '≤'].map((o) => `x ${o} ${fmt(a)}`);
    const promptTemplates = [
      `On this number line, the shaded ray starts at ${fmt(a)} and points to the ${right ? 'right' : 'left'}. Which inequality is shown?`,
      `Look at the shaded inequality graph starting at ${fmt(a)} and pointing ${right ? 'right' : 'left'}. Which inequality matches it?`
    ];
    return {
      prompt: promptTemplates[variant % promptTemplates.length],
      correct: `x ${op} ${fmt(a)}`,
      distractors: opts.filter((o) => o !== `x ${op} ${fmt(a)}`),
      diagram: { min: -8, max: 8, tickStep: 1, labelStep: 1, shade: { from: right ? a : -Infinity, to: right ? Infinity : a, fromClosed: closed, toClosed: closed } },
      rule: 'OPEN / CLOSED RULE',
      hint: `Check the circle at ${fmt(a)}: an open circle excludes ${fmt(a)}, while a closed circle includes ${fmt(a)}. Shading ${right ? 'right' : 'left'} means ${right ? 'greater than' : 'less than'}.`,
      explanation: `The ${closed ? 'closed' : 'open'} circle at ${fmt(a)} means ${fmt(a)} is ${closed ? 'included' : 'not included'}, and shading to the ${right ? 'right' : 'left'} means ${right ? 'greater' : 'smaller'} numbers: x ${op} ${fmt(a)}.`
    };
  },

  ineq_member(_diff, rng = Math.random) {
    const a = randInt(-5, 5, rng);
    const op = pick(['>', '≥', '<', '≤'], rng);
    const right = op === '>' || op === '≥';
    const closed = op === '≥' || op === '≤';
    const dir = right ? 1 : -1;
    const good = closed && coin(0.4, rng) ? a : a + dir * randInt(1, 4, rng);
    const bad = [];
    if (!closed) bad.push(a);
    for (let s = 1; bad.length < 3; s++) bad.push(a - dir * s);
    return {
      prompt: `Which value makes x ${op} ${fmt(a)} true?`,
      correct: fmt(good),
      distractors: bad.map(fmt),
      fillers: [fmt(a - dir * 5)],
      diagram: { min: -8, max: 8, tickStep: 1, labelStep: 1, shade: { from: right ? a : -Infinity, to: right ? Infinity : a, fromClosed: closed, toClosed: closed } },
      rule: 'OPEN / CLOSED RULE',
      hint: `${closed ? `Since ${op} includes the boundary, ${fmt(a)} itself works,` : `Since ${op} is strict, ${fmt(a)} itself is NOT allowed;`} pick a value inside the shaded part to the ${right ? 'right' : 'left'} of ${fmt(a)}.`,
      explanation: `${fmt(good)} lies in the shaded part, so ${fmt(good)} ${op} ${fmt(a)} is true.${!closed ? ` (${fmt(a)} itself is not allowed because the circle is open.)` : ''}`
    };
  },

  compound_count(_diff, rng = Math.random) {
    const lo = randInt(-5, 0, rng);
    const hi = lo + randInt(3, 7, rng);
    const lc = coin(0.5, rng); const hc = coin(0.5, rng);
    const first = lo + (lc ? 0 : 1);
    const last = hi - (hc ? 0 : 1);
    const count = last - first + 1;
    const list = [];
    for (let v = first; v <= last; v++) list.push(fmt(v));
    return {
      prompt: `How many integers satisfy ${fmt(lo)} ${lc ? '≤' : '<'} x ${hc ? '≤' : '<'} ${fmt(hi)}?`,
      correct: String(count),
      distractors: [String(count + 1), String(count - 1), String(hi - lo), String(count + 2)],
      diagram: { min: lo - 3, max: hi + 3, tickStep: 1, labelStep: 1, shade: { from: lo, to: hi, fromClosed: lc, toClosed: hc } },
      rule: 'OPEN / CLOSED RULE',
      hint: `Count every whole number between ${fmt(lo)} and ${fmt(hi)}. Endpoint ${fmt(lo)} is ${lc ? 'included' : 'excluded'}, and ${fmt(hi)} is ${hc ? 'included' : 'excluded'}.`,
      explanation: `The integers are ${list.join(', ')}, which is ${count} integers.`
    };
  }
};

function finalizeQuestion(world, type, q, rng = Math.random) {
  const { options, correctIndex } = q.options
    ? { options: q.options, correctIndex: q.correctIndex }
    : buildChoices(q.correct, q.distractors, q.fillers || [], rng);
  return {
    world,
    type,
    prompt: q.prompt,
    promptSpeech: toSpokenMath(q.prompt),
    options,
    correctIndex,
    diagramData: q.diagram,
    rule: q.rule,
    hint: q.hint,
    hintSpeech: toSpokenMath(q.hint),
    explanation: q.explanation
  };
}

/* -------------------------------------------------------------------------
   100 DETERMINISTIC PRACTICE QUESTIONS (10 worlds x 10 unique questions)
   ------------------------------------------------------------------------- */
function buildAllPracticeQuestions() {
  const usedPrompts = new Set();
  const usedHints = new Set();

  return PRACTICE_WORLDS.map((world, wIdx) => {
    const questions = [];
    for (let qIdx = 0; qIdx < 10; qIdx++) {
      const type = world.types[qIdx % world.types.length];
      let chosen = null;
      for (let attempt = 0; attempt < 200; attempt++) {
        const rng = createRng(10007 * (wIdx + 1) + 7919 * (qIdx + 1) + attempt * 131);
        const q = ARCH[type](world.difficulty, rng, qIdx + attempt);
        const finalized = finalizeQuestion(world, type, q, rng);
        if (!usedPrompts.has(finalized.promptSpeech) && !usedHints.has(finalized.hintSpeech)) {
          usedPrompts.add(finalized.promptSpeech);
          usedHints.add(finalized.hintSpeech);
          chosen = finalized;
          break;
        }
      }
      if (!chosen) {
        const rng = createRng(99991 * (wIdx + 1) + qIdx);
        const q = ARCH[type](world.difficulty, rng, qIdx);
        chosen = finalizeQuestion(world, type, q, rng);
      }
      questions.push(chosen);
    }
    return questions;
  });
}

export const PRACTICE_QUESTIONS = buildAllPracticeQuestions();

/* -------------------------------------------------------------------------
   MAIN GENERATOR
   ------------------------------------------------------------------------- */
export function makeQuestion(worldIndex = 0, qIndex = null) {
  if (qIndex != null && PRACTICE_QUESTIONS[worldIndex]?.[qIndex]) {
    return PRACTICE_QUESTIONS[worldIndex][qIndex];
  }
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const type = pick(world.types);
  const q = ARCH[type](world.difficulty);
  return finalizeQuestion(world, type, q);
}
