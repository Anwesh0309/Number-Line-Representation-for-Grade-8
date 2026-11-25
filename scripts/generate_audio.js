/* =========================================================================
   OFFLINE AUDIO GENERATION  —  node scripts/generate_audio.js
   - Reads the `phrases` array (exact text + intended style)
   - Applies per-style ElevenLabs voice settings
   - Calls the ElevenLabs text-to-speech API with VITE_ELEVENLABS_API_KEY (.env.local)
   - Saves slugified .mp3 files to public/assets/audio/
   - Writes src/utils/audioMap.js   (exact text -> mp3 path)
   - Rate-limited: 500 ms between API calls
   Only paragraph text and questions are listed. NEVER add titles.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_FILE = path.join(ROOT, 'src', 'utils', 'audioMap.js');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

/* ---------- PHRASES (keep in sync with src/utils/narration.js -> `npm run check-audio`) ---------- */
const phrases = [
  { text: "Leo and Emma zoomed in on the number line. Every time they zoomed in, they found more numbers: fractions, decimals, and even strange ones like the square root of 2 that never end!", style: "statement" },
  { text: "How can one straight line hold every number there is, and how do we find exactly where each one lives?", style: "question" },
  { text: "Every real number has its own special spot on a straight line called the number line. Zero sits in the middle, positive numbers march to the right, and negative numbers stretch to the left.", style: "statement" },
  { text: "Integers are the whole numbers: positive, negative, and zero. Every number has an opposite the same distance from zero on the other side, like 4 and negative 4.", style: "emphasis" },
  { text: "Between any two integers sit fractions and decimals. To place three quarters, split the gap from 0 to 1 into 4 equal parts, then count 3 parts from 0.", style: "statement" },
  { text: "The farther right a number sits, the greater it is. So negative one half is greater than negative three quarters, even though three quarters is bigger than one half. Be extra careful when comparing negatives!", style: "emphasis" },
  { text: "Absolute value is the distance from zero, so the absolute value of negative 5 is 5. The distance between two points a and b is the absolute value of a minus b, and distance is never negative.", style: "statement" },
  { text: "Numbers like the square root of 2 and pi are irrational: their decimals never end and never repeat. They still have exact spots! A unit square has a diagonal of the square root of 2, so swing that diagonal down onto the line with a compass to mark the square root of 2, which is about 1 point 4 1 4.", style: "celebration" },
  { text: "To show x greater than 2, draw an open circle at 2 and shade to the right. For x less than or equal to 2, use a closed circle because 2 is included, and shade to the left.", style: "encouragement" },
  { text: "Awesome job! You've learned how integers, fractions, decimals, and irrational numbers all live on one number line. Now step into the lab to zoom, place, and solve number line mysteries!", style: "celebration" },
  { text: "Measure aerospace microchip wires between 0 and 1 millimeter. Zoom in three times to see that numbers never run out, just like Leo and Emma discovered!", style: "encouragement" },
  { text: "Submarine Nautilus dives below sea level at zero meters while a research drone flies above. Discover why opposites share the exact same distance from zero!", style: "encouragement" },
  { text: "Slice a 1-meter artisan chocolate bar into equal portions. Find three equivalent cuts that match exactly half of the bar!", style: "encouragement" },
  { text: "Drop sensor readings onto the polar thermometer from negative freezing blizzards to warm greenhouses. Place all five cards and press Check!", style: "encouragement" },
  { text: "Rank expedition sensor readings from coldest on the left to warmest on the right, including negatives, decimals, and square roots!", style: "encouragement" },
  { text: "Build the inequality graph for coaster height, wind speed, and coolant limits. Set the boundary, pick open or closed circle, and shade!", style: "encouragement" },
  { text: "Train beacons A and B mark two track mileposts. Calculate the step size between track sleepers, then find the exact kilometer of emergency beacon P!", style: "encouragement" },
  { text: "A stranded vessel sits at A and a lighthouse sits at B. Calculate total patrol distance and deploy rescue helicopter M exactly halfway between them!", style: "encouragement" },
  { text: "Cut a square marble tile with target area N. Squeeze side length x until x times x matches the target, finding the exact spot of the square root!", style: "encouragement" },
  { text: "Just like you can keep zooming a camera into a computer chip forever, you can always split any gap on a number line into 10 smaller tenths, then hundredths, then thousandths. Between 0 and 1 live infinitely many numbers!", style: "encouragement" },
  { text: "Absolute value is physical distance! A submarine diving 7 meters underwater, negative 7 meters, and a drone flying 7 meters in the air, positive 7 meters, are both exactly 7 meters away from the water surface at 0. Distance is never negative: the absolute value of negative 7 equals 7, and the absolute value of positive 7 equals 7!", style: "encouragement" },
  { text: "If you cut a 1-meter chocolate bar into 4 pieces and take 2, that is two quarters, the exact same amount of chocolate as cutting it into 8 pieces and taking 4, or four eighths. Both give exactly half the bar: 0.5 meters, or 500 grams!", style: "encouragement" },
  { text: "Remember the thermometer rule: negative 2.5 degrees Celsius is colder than negative 1.5 degrees Celsius, so negative 2.5 must sit farther to the left from zero. The bigger a negative number looks, the colder and smaller it really is!", style: "encouragement" },
  { text: "Remember: the square root of 2 is approximately 1.414, between 1 and 2, and pi is approximately 3.141, between 3 and 4. When comparing negatives, negative three halves equals negative 1.5, which is smaller and colder than negative 1.0 because it sits farther to the left!", style: "encouragement" },
  { text: "Use a closed circle when the boundary number is allowed, which has the equals bar: less than or equal to, or greater than or equal to. Use an open circle when the value must strictly stay beyond the boundary, for less than or greater than!", style: "encouragement" },
  { text: "Two-step method: first, find the step size by subtracting Beacon B minus Beacon A, then dividing by the number of tick intervals. Second, start at Beacon A and add or subtract one step size for each tick toward P!", style: "encouragement" },
  { text: "For distance, subtract coordinates and take the absolute value: the absolute value of B minus A. Distance is always positive! For the midpoint, find the average coordinate: A plus B, divided by 2. That is the exact point halfway between them!", style: "encouragement" },
  { text: "Numbers like the square root of 2, the square root of 3, and the square root of 5 are irrational. Their decimals go on forever without ever repeating, yet they have an exact physical spot on the number line!", style: "encouragement" },
  { text: "Awesome! Mission complete!", style: "celebration" },
  { text: "Fantastic work! You cracked it!", style: "celebration" },
  { text: "Great job, number line explorer!", style: "celebration" },
  { text: "Not quite yet. Check the hint and try again!", style: "encouragement" },
  { text: "On the number line from negative 5 to 5, what number does point P show?", style: "question" },
  { text: "On the negative 5 to 5 line, point P sits to the right of 0. Count each tick mark from 0 to find its value.", style: "encouragement" },
  { text: "What is the opposite of 9?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since 9 is 9 steps right of 0, look 9 steps on the left side.", style: "encouragement" },
  { text: "Which number is farthest to the right on the number line: negative 3, negative 6, 8, 3?", style: "question" },
  { text: "Right means greater on the number line. Compare the positive numbers among negative 3, negative 6, 8, 3 to find the greatest.", style: "encouragement" },
  { text: "On the number line from negative 5 to 7, what number does point P show?", style: "question" },
  { text: "On the negative 5 to 7 line, point P sits to the right of 0. Count each tick mark from 0 to find its value.", style: "encouragement" },
  { text: "What is the opposite of negative 3?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since negative 3 is 3 steps left of 0, look 3 steps on the right side.", style: "encouragement" },
  { text: "Which number is farthest to the left on the number line: negative 2, 0, negative 9, negative 7?", style: "question" },
  { text: "Left means smaller on the number line. Among negative 2, 0, negative 9, negative 7, the negative number farthest from 0 sits farthest left.", style: "encouragement" },
  { text: "On the number line from negative 3 to 7, what number does point P show?", style: "question" },
  { text: "On the negative 3 to 7 line, point P sits to the right of 0. Count each tick mark from 0 to find its value.", style: "encouragement" },
  { text: "What is the opposite of 7?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since 7 is 7 steps right of 0, look 7 steps on the left side.", style: "encouragement" },
  { text: "Which number is farthest to the right on the number line: negative 4, negative 8, 5, 7?", style: "question" },
  { text: "Right means greater on the number line. Compare the positive numbers among negative 4, negative 8, 5, 7 to find the greatest.", style: "encouragement" },
  { text: "On the number line from negative 6 to 6, what number does point P show?", style: "question" },
  { text: "On the negative 6 to 6 line, point P sits to the left of 0. Count each tick mark from 0 to find its value.", style: "encouragement" },
  { text: "What is the opposite of negative 7?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since negative 7 is 7 steps left of 0, look 7 steps on the right side.", style: "encouragement" },
  { text: "Look at point P between negative 7 and 5 on the number line. What number does it show?", style: "question" },
  { text: "Point P is negative (left of 0) on this negative 7 to 5 scale. Count the ticks from 0 toward P.", style: "encouragement" },
  { text: "Point A is at 4 and point B is at 1. How far apart are they?", style: "question" },
  { text: "Count the total steps from 1 up to 4, or compute the absolute value of 4 minus 1. Distance is never negative.", style: "encouragement" },
  { text: "Arrange from smallest to largest: negative 4, negative 3, 5, negative 2", style: "question" },
  { text: "For negative 4, negative 3, 5, negative 2, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "What is the opposite of negative 6?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since negative 6 is 6 steps left of 0, look 6 steps on the right side.", style: "encouragement" },
  { text: "Count the tick marks from 0 on this negative 2 to 10 number line. What value is at point P?", style: "question" },
  { text: "Between negative 2 and 10, start at 0 and count each unit step left until you land on P.", style: "encouragement" },
  { text: "Point A is at negative 2 and point B is at negative 5. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 5 up to negative 2, or compute the absolute value of negative 2 minus negative 5. Distance is never negative.", style: "encouragement" },
  { text: "Arrange from smallest to largest: negative 6, 0, negative 4, negative 3", style: "question" },
  { text: "For negative 6, 0, negative 4, negative 3, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "What is the opposite of negative 8?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since negative 8 is 8 steps left of 0, look 8 steps on the right side.", style: "encouragement" },
  { text: "Look at point P between negative 7 and 3 on the number line. What number does it show?", style: "question" },
  { text: "Point P is negative (left of 0) on this negative 7 to 3 scale. Count the ticks from 0 toward P.", style: "encouragement" },
  { text: "Arrange from smallest to largest: 1, 8, negative 5, negative 4", style: "question" },
  { text: "For 1, 8, negative 5, negative 4, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "Point A is at negative 6 and point B is at 8. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 6 up to 8, or compute the absolute value of negative 6 minus 8. Distance is never negative.", style: "encouragement" },
  { text: "Which number is farthest to the right on the number line: negative 7, negative 5, negative 1, 9?", style: "question" },
  { text: "Right means greater on the number line. Compare the positive numbers among negative 7, negative 5, negative 1, 9 to find the greatest.", style: "encouragement" },
  { text: "Arrange from smallest to largest: 1, 7, negative 3, negative 5", style: "question" },
  { text: "For 1, 7, negative 3, negative 5, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "Point A is at 4 and point B is at negative 5. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 5 up to 4, or compute the absolute value of 4 minus negative 5. Distance is never negative.", style: "encouragement" },
  { text: "Which number is farthest to the left on the number line: negative 3, 8, negative 8, 2?", style: "question" },
  { text: "Left means smaller on the number line. Among negative 3, 8, negative 8, 2, the negative number farthest from 0 sits farthest left.", style: "encouragement" },
  { text: "Arrange from smallest to largest: negative 2, negative 3, 2, 0", style: "question" },
  { text: "For negative 2, negative 3, 2, 0, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "Point A is at 6 and point B is at negative 4. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 4 up to 6, or compute the absolute value of 6 minus negative 4. Distance is never negative.", style: "encouragement" },
  { text: "Which number is farthest to the right on the number line: negative 5, negative 8, 9, negative 7?", style: "question" },
  { text: "Right means greater on the number line. Compare the positive numbers among negative 5, negative 8, 9, negative 7 to find the greatest.", style: "encouragement" },
  { text: "Arrange from smallest to largest: 4, negative 9, negative 1, 9", style: "question" },
  { text: "For 4, negative 9, negative 1, 9, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "The distance from 0 to 1 is split into 3 equal parts. What fraction does point P show?", style: "question" },
  { text: "Each equal step between 0 and 1 is one third. Count how many steps point P sits right of 0, and simplify if possible.", style: "encouragement" },
  { text: "Which fraction is farthest to the left on the number line: negative one third, 3 fifths, three quarters, 3 halves?", style: "question" },
  { text: "Convert negative one third, 3 fifths, three quarters, 3 halves into decimals to compare them. Among negative fractions, the one farthest left of 0 is smallest.", style: "encouragement" },
  { text: "The distance from 0 to 1 is split into 4 equal parts. What fraction does point P show?", style: "question" },
  { text: "Each equal step between 0 and 1 is one quarter. Count how many steps point P sits right of 0, and simplify if possible.", style: "encouragement" },
  { text: "Between negative 1 and 0, the line is divided into 4 equal parts. Which fraction is marked at P?", style: "question" },
  { text: "Each equal step between negative 1 and 0 is one quarter. Count how many steps point P sits left of 0, and simplify if possible.", style: "encouragement" },
  { text: "Which fraction is farthest to the right on the number line: 3 fifths, negative 3 halves, two thirds, negative one sixth?", style: "question" },
  { text: "Convert 3 fifths, negative 3 halves, two thirds, negative one sixth into decimals to compare them. The greatest positive fraction sits farthest right.", style: "encouragement" },
  { text: "Between negative 1 and 0, the line is divided into 6 equal parts. Which fraction is marked at P?", style: "question" },
  { text: "Each equal step between negative 1 and 0 is one sixth. Count how many steps point P sits left of 0, and simplify if possible.", style: "encouragement" },
  { text: "The distance from 0 to 1 is split into 5 equal parts. What fraction does point P show?", style: "question" },
  { text: "Each equal step between 0 and 1 is one fifth. Count how many steps point P sits right of 0, and simplify if possible.", style: "encouragement" },
  { text: "Which fraction is farthest to the left on the number line: negative 6 fifths, negative 2 fifths, one quarter, one fifth?", style: "question" },
  { text: "Convert negative 6 fifths, negative 2 fifths, one quarter, one fifth into decimals to compare them. Among negative fractions, the one farthest left of 0 is smallest.", style: "encouragement" },
  { text: "The distance from 0 to 1 is split into 6 equal parts. What fraction does point P show?", style: "question" },
  { text: "Each equal step between 0 and 1 is one sixth. Count how many steps point P sits right of 0, and simplify if possible.", style: "encouragement" },
  { text: "Between negative 1 and 0, the line is divided into 5 equal parts. Which fraction is marked at P?", style: "question" },
  { text: "Each equal step between negative 1 and 0 is one fifth. Count how many steps point P sits left of 0, and simplify if possible.", style: "encouragement" },
  { text: "The distance from negative 1.2 to negative 1.1 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each small tick between negative 1.2 and negative 1.1 is 0.01. Start at negative 1.2 and count the hundredths up to P.", style: "encouragement" },
  { text: "Which decimal is farthest to the left on the number line: 1.69, 1.34, negative 0.41, 0.63?", style: "question" },
  { text: "Compare the decimals 1.69, 1.34, negative 0.41, 0.63 by tenths and hundredths. For negative decimals, the one with the largest magnitude sits farthest left.", style: "encouragement" },
  { text: "The distance from negative 1.7 to negative 1.6 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each small tick between negative 1.7 and negative 1.6 is 0.01. Start at negative 1.7 and count the hundredths up to P.", style: "encouragement" },
  { text: "Zoomed in from 2.7 to 2.8 with 10 equal parts, what decimal does point P mark?", style: "question" },
  { text: "Each small tick between 2.7 and 2.8 is 0.01. Start at 2.7 and count the hundredths up to P.", style: "encouragement" },
  { text: "Which decimal is farthest to the left on the number line: negative 0.3, 1.18, 0.62, 2.35?", style: "question" },
  { text: "Compare the decimals negative 0.3, 1.18, 0.62, 2.35 by tenths and hundredths. For negative decimals, the one with the largest magnitude sits farthest left.", style: "encouragement" },
  { text: "Between negative 3 and negative 2, there are 10 equal tenths. What decimal is at point P?", style: "question" },
  { text: "Each tick mark between negative 3 and negative 2 adds 0.1. Start at negative 3 and count the tenths to the right up to P.", style: "encouragement" },
  { text: "The distance from 0 to 1 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each tick mark between 0 and 1 adds 0.1. Start at 0 and count the tenths to the right up to P.", style: "encouragement" },
  { text: "Which decimal is farthest to the left on the number line: 0.42, 1.26, 0.71, negative 1.38?", style: "question" },
  { text: "Compare the decimals 0.42, 1.26, 0.71, negative 1.38 by tenths and hundredths. For negative decimals, the one with the largest magnitude sits farthest left.", style: "encouragement" },
  { text: "The distance from 2.2 to 2.3 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each small tick between 2.2 and 2.3 is 0.01. Start at 2.2 and count the hundredths up to P.", style: "encouragement" },
  { text: "The distance from negative 0.9 to negative 0.8 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each small tick between negative 0.9 and negative 0.8 is 0.01. Start at negative 0.9 and count the hundredths up to P.", style: "encouragement" },
  { text: "What is the absolute value of 12?", style: "question" },
  { text: "Absolute value measures how many steps 12 is from 0 on the number line. Distance is never negative!", style: "encouragement" },
  { text: "Which number has the greatest absolute value: negative 10, negative 4, 0, 11?", style: "question" },
  { text: "Compare each number's distance from 0 among negative 10, negative 4, 0, 11 without its minus sign. The one farthest from 0 has the greatest absolute value.", style: "encouragement" },
  { text: "Which numbers have an absolute value of 3?", style: "question" },
  { text: "Think in both directions from 0: you can walk 3 steps to the right OR 3 steps to the left.", style: "encouragement" },
  { text: "What is the absolute value of negative 11?", style: "question" },
  { text: "Absolute value measures how many steps negative 11 is from 0 on the number line. Distance is never negative!", style: "encouragement" },
  { text: "Which number has the greatest absolute value: negative 10, negative 4, negative 12, 6?", style: "question" },
  { text: "Compare each number's distance from 0 among negative 10, negative 4, negative 12, 6 without its minus sign. The one farthest from 0 has the greatest absolute value.", style: "encouragement" },
  { text: "Which numbers have an absolute value of 4?", style: "question" },
  { text: "Think in both directions from 0: you can walk 4 steps to the right OR 4 steps to the left.", style: "encouragement" },
  { text: "What is the absolute value of negative 5 plus the absolute value of 6?", style: "question" },
  { text: "Find each number's positive distance from 0 first: the absolute value of negative 5 and the absolute value of 6, then add those two positive distances together.", style: "encouragement" },
  { text: "Which number has the greatest absolute value: 7, negative 1, 8, 9?", style: "question" },
  { text: "Compare each number's distance from 0 among 7, negative 1, 8, 9 without its minus sign. The one farthest from 0 has the greatest absolute value.", style: "encouragement" },
  { text: "Which numbers have an absolute value of 7?", style: "question" },
  { text: "Think in both directions from 0: you can walk 7 steps to the right OR 7 steps to the left.", style: "encouragement" },
  { text: "What is the absolute value of negative 5?", style: "question" },
  { text: "Absolute value measures how many steps negative 5 is from 0 on the number line. Distance is never negative!", style: "encouragement" },
  { text: "An elevator starts at basement floor negative 3 and goes up to floor 5. How many floors does it travel?", style: "question" },
  { text: "Ground level is 0. Count the floors from basement negative 3 up to 0, then add the floors up to 5.", style: "encouragement" },
  { text: "What number is exactly halfway between negative 2 and 8?", style: "question" },
  { text: "To find the midpoint between negative 2 and 8, add the two numbers together and divide by 2: negative 2 plus 8, divided by 2.", style: "encouragement" },
  { text: "Point A is at 10 and point B is at negative 1. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 1 up to 10, or compute the absolute value of 10 minus negative 1. Distance is never negative.", style: "encouragement" },
  { text: "At night the temperature is negative 6 degrees Celsius. By noon it is 11 degrees Celsius. By how many degrees did it rise?", style: "question" },
  { text: "First count the steps from negative 6 degrees Celsius up to 0 degrees Celsius, then add the steps from 0 degrees Celsius up to 11 degrees Celsius.", style: "encouragement" },
  { text: "What number is exactly halfway between negative 7 and 11?", style: "question" },
  { text: "To find the midpoint between negative 7 and 11, add the two numbers together and divide by 2: negative 7 plus 11, divided by 2.", style: "encouragement" },
  { text: "Point A is at 5 and point B is at negative 1. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 1 up to 5, or compute the absolute value of 5 minus negative 1. Distance is never negative.", style: "encouragement" },
  { text: "An elevator starts at basement floor negative 3 and goes up to floor 8. How many floors does it travel?", style: "question" },
  { text: "Ground level is 0. Count the floors from basement negative 3 up to 0, then add the floors up to 8.", style: "encouragement" },
  { text: "What number is exactly halfway between negative 12 and 9?", style: "question" },
  { text: "To find the midpoint between negative 12 and 9, add the two numbers together and divide by 2: negative 12 plus 9, divided by 2.", style: "encouragement" },
  { text: "Point A is at negative 1 and point B is at negative 8. How far apart are they?", style: "question" },
  { text: "Count the total steps from negative 8 up to negative 1, or compute the absolute value of negative 1 minus negative 8. Distance is never negative.", style: "encouragement" },
  { text: "A diver is 6 meters below sea level and a gull flies 22 meters above sea level. How far apart are they?", style: "question" },
  { text: "Sea level is 0 meters. Add the diver's distance below 0 (6 meters) and the gull's height above 0 (22 meters).", style: "encouragement" },
  { text: "Between which two consecutive integers does the square root of 28 lie?", style: "question" },
  { text: "Check perfect squares near 28: find the whole number whose square is just below 28 and the next whole number whose square is just above 28.", style: "encouragement" },
  { text: "Which of these numbers is irrational: the square root of 3, negative 3 sevenths, 0.25, 22 sevenths?", style: "question" },
  { text: "Among the square root of 3, negative 3 sevenths, 0.25, 22 sevenths, look for the number whose decimal never ends and never repeats (like pi or the square root of a non-square number).", style: "encouragement" },
  { text: "Which is the best estimate of the square root of 32 to one decimal place?", style: "question" },
  { text: "Multiply each decimal choice by itself (squaring it) and see which result lands closest to 32. Look between 5 and 6.", style: "encouragement" },
  { text: "Between which two consecutive integers does the square root of 53 lie?", style: "question" },
  { text: "Check perfect squares near 53: find the whole number whose square is just below 53 and the next whole number whose square is just above 53.", style: "encouragement" },
  { text: "Which of these numbers is irrational: the square root of 0.25, the square root of 16, the square root of 49, the square root of 13?", style: "question" },
  { text: "Among the square root of 0.25, the square root of 16, the square root of 49, the square root of 13, look for the number whose decimal never ends and never repeats (like pi or the square root of a non-square number).", style: "encouragement" },
  { text: "Which is the best estimate of the square root of 37 to one decimal place?", style: "question" },
  { text: "Multiply each decimal choice by itself (squaring it) and see which result lands closest to 37. Look between 6 and 7.", style: "encouragement" },
  { text: "Between which two consecutive integers does the square root of 19 lie?", style: "question" },
  { text: "Check perfect squares near 19: find the whole number whose square is just below 19 and the next whole number whose square is just above 19.", style: "encouragement" },
  { text: "Which of these numbers is irrational: 0.333 repeating, the square root of 49, the square root of 16, the square root of 11?", style: "question" },
  { text: "Among 0.333 repeating, the square root of 49, the square root of 16, the square root of 11, look for the number whose decimal never ends and never repeats (like pi or the square root of a non-square number).", style: "encouragement" },
  { text: "Which is the best estimate of the square root of 6 to one decimal place?", style: "question" },
  { text: "Multiply each decimal choice by itself (squaring it) and see which result lands closest to 6. Look between 2 and 3.", style: "encouragement" },
  { text: "Between which two consecutive integers does the square root of 24 lie?", style: "question" },
  { text: "Check perfect squares near 24: find the whole number whose square is just below 24 and the next whole number whose square is just above 24.", style: "encouragement" },
  { text: "On this number line, the shaded ray starts at negative 5 and points to the right. Which inequality is shown?", style: "question" },
  { text: "Check the circle at negative 5: an open circle excludes negative 5, while a closed circle includes negative 5. Shading right means greater than.", style: "encouragement" },
  { text: "Which value makes x is greater than 5 true?", style: "question" },
  { text: "Since > is strict, 5 itself is NOT allowed; pick a value inside the shaded part to the right of 5.", style: "encouragement" },
  { text: "How many integers satisfy negative 2 is less than x, and x is less than or equal to 2?", style: "question" },
  { text: "Count every whole number between negative 2 and 2. Endpoint negative 2 is excluded, and 2 is included.", style: "encouragement" },
  { text: "Look at the shaded inequality graph starting at 5 and pointing right. Which inequality matches it?", style: "question" },
  { text: "Check the circle at 5: an open circle excludes 5, while a closed circle includes 5. Shading right means greater than.", style: "encouragement" },
  { text: "Which value makes x is less than or equal to 4 true?", style: "question" },
  { text: "Since is less than or equal to includes the boundary, 4 itself works, pick a value inside the shaded part to the left of 4.", style: "encouragement" },
  { text: "How many integers satisfy negative 3 is less than x, and x is less than 3?", style: "question" },
  { text: "Count every whole number between negative 3 and 3. Endpoint negative 3 is excluded, and 3 is excluded.", style: "encouragement" },
  { text: "On this number line, the shaded ray starts at 4 and points to the left. Which inequality is shown?", style: "question" },
  { text: "Check the circle at 4: an open circle excludes 4, while a closed circle includes 4. Shading left means less than.", style: "encouragement" },
  { text: "Which value makes x is greater than negative 2 true?", style: "question" },
  { text: "Since > is strict, negative 2 itself is NOT allowed; pick a value inside the shaded part to the right of negative 2.", style: "encouragement" },
  { text: "How many integers satisfy negative 3 is less than or equal to x, and x is less than 0?", style: "question" },
  { text: "Count every whole number between negative 3 and 0. Endpoint negative 3 is included, and 0 is excluded.", style: "encouragement" },
  { text: "Look at the shaded inequality graph starting at 2 and pointing left. Which inequality matches it?", style: "question" },
  { text: "Check the circle at 2: an open circle excludes 2, while a closed circle includes 2. Shading left means less than.", style: "encouragement" },
  { text: "On the number line from negative 8 to 2, what number does point P show?", style: "question" },
  { text: "On the negative 8 to 2 line, point P sits to the right of 0. Count each tick mark from 0 to find its value.", style: "encouragement" },
  { text: "What is the opposite of negative 5?", style: "question" },
  { text: "Opposites sit the same distance from 0 on opposite sides. Since negative 5 is 5 steps left of 0, look 5 steps on the right side.", style: "encouragement" },
  { text: "Arrange from smallest to largest: 3, negative 4, 7, negative 8", style: "question" },
  { text: "For 3, negative 4, 7, negative 8, place the negative numbers farthest left of 0 first, then move right toward the largest positive number.", style: "encouragement" },
  { text: "At night the temperature is negative 7 degrees Celsius. By noon it is 5 degrees Celsius. By how many degrees did it rise?", style: "question" },
  { text: "First count the steps from negative 7 degrees Celsius up to 0 degrees Celsius, then add the steps from 0 degrees Celsius up to 5 degrees Celsius.", style: "encouragement" },
  { text: "What number is exactly halfway between negative 7 and 13?", style: "question" },
  { text: "To find the midpoint between negative 7 and 13, add the two numbers together and divide by 2: negative 7 plus 13, divided by 2.", style: "encouragement" },
  { text: "Between negative 1 and 0, the line is divided into 3 equal parts. Which fraction is marked at P?", style: "question" },
  { text: "Each equal step between negative 1 and 0 is one third. Count how many steps point P sits left of 0, and simplify if possible.", style: "encouragement" },
  { text: "The distance from negative 2.0 to negative 1.9 is split into 10 equal parts. What decimal does point P show?", style: "question" },
  { text: "Each small tick between negative 2.0 and negative 1.9 is 0.01. Start at negative 2.0 and count the hundredths up to P.", style: "encouragement" },
  { text: "Which number has the greatest absolute value: 3, negative 11, 9, 2?", style: "question" },
  { text: "Compare each number's distance from 0 among 3, negative 11, 9, 2 without its minus sign. The one farthest from 0 has the greatest absolute value.", style: "encouragement" },
  { text: "Between which two consecutive integers does the square root of 10 lie?", style: "question" },
  { text: "Check perfect squares near 10: find the whole number whose square is just below 10 and the next whole number whose square is just above 10.", style: "encouragement" },
  { text: "Which of these numbers is irrational: 22 sevenths, 0.25, the square root of 11, the square root of 49?", style: "question" },
  { text: "Among 22 sevenths, 0.25, the square root of 11, the square root of 49, look for the number whose decimal never ends and never repeats (like pi or the square root of a non-square number).", style: "encouragement" },
  { text: "Correct! Excellent number line thinking!", style: "celebration" },
  { text: "Yes! You placed that perfectly!", style: "celebration" },
  { text: "Spot on! Keep going!", style: "celebration" },
  { text: "Brilliant! That's exactly right!", style: "celebration" },
  { text: "Not quite! Look at where it sits on the line.", style: "encouragement" },
  { text: "Almost! Check left and right again.", style: "encouragement" },
  { text: "Good try! Let's learn from this one.", style: "encouragement" },
  { text: "Oops! Count the steps carefully next time.", style: "encouragement" },
  { text: "Great work completing the module!", style: "celebration" },
  { text: "What did you learn about the number line? Explain it to Robo with an example!", style: "thinking" },
  { text: "Outstanding reflection! Lesson complete!", style: "celebration" },
];

/* ---------- helpers ---------- */
function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return {};
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}
const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').split('_').slice(0, 6).join('_');
const hash = (text, style) => crypto.createHash('sha1').update(`${style}::${text}`).digest('hex').slice(0, 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tts(text, style, apiKey) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement })
      }
    );
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await sleep(1500 * attempt);
      continue;
    }
    throw new Error(`ElevenLabs ${res.status}: ${body}`);
  }
}

/* ---------- main ---------- */
async function main() {
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY || loadEnv().VITE_ELEVENLABS_API_KEY;
  if (!apiKey) { console.error('Missing VITE_ELEVENLABS_API_KEY in .env.local'); process.exit(1); }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  const audioMap = {};
  let made = 0, skipped = 0, failed = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const file = `audio_${slugify(text)}_${i}.mp3`;
    const full = path.join(AUDIO_DIR, file);
    const h = hash(text, style);

    if (fs.existsSync(full) && manifest[file] === h) {
      audioMap[text] = `/assets/audio/${file}`;
      skipped++;
      continue;
    }
    try {
      process.stdout.write(`[${i + 1}/${phrases.length}] ${style.padEnd(13)} ${text.slice(0, 60)}… `);
      fs.writeFileSync(full, await tts(text, style, apiKey));
      manifest[file] = h;
      audioMap[text] = `/assets/audio/${file}`;
      made++;
      console.log('ok');
    } catch (e) {
      failed++;
      console.log('FAILED\n   ' + e.message);
    }
    await sleep(250); // rate limit
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  const header = `/* AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.\n   Key: exact spoken text   Value: pre-generated .mp3 */\n`;
  fs.writeFileSync(MAP_FILE, `${header}export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`);
  console.log(`\nDone. generated ${made}, unchanged ${skipped}, failed ${failed}. audioMap.js updated (${Object.keys(audioMap).length} entries).`);
  if (failed) process.exitCode = 1;
}
main();
