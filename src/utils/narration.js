/* =========================================================================
   NARRATION SCRIPTS — maps application phases to their audio scripts.
   POLICY: only paragraph text, questions, hints & simulation guidance are
   narrated. Titles, headings and section labels are NEVER spoken.
   The text of every line lives in mathData.js, next to the on-screen text it
   belongs to, so audio and UI always stay in sync (symbols are spoken in words).
   ========================================================================= */
import { say, ask, cheer, think, celebrate, instruct, emphasize } from './audio.js';
import {
  WONDER, STORY_SLIDES, SIM_STATIONS, REFLECT,
  CORRECT_LINES, WRONG_LINES, SIM_SUCCESS_LINES, SIM_RETRY_LINE, REFLECT_DONE_LINE,
  PRACTICE_QUESTIONS
} from '../mathData.js';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const STYLE_FN = {
  statement: say,
  question: ask,
  celebration: celebrate,
  emphasis: emphasize,
  thinking: think,
  encouragement: instruct
};

/* ---------- Phase 1: Wonder ---------- */
export function wonderNarration() {
  return [say(WONDER.speech), ask(WONDER.question)];
}

/* ---------- Phase 2: Story ---------- */
export function getStoryNarration(index) {
  const slide = STORY_SLIDES[index];
  if (!slide) return [];
  return [(STYLE_FN[slide.style] || say)(slide.speech)];
}

/* ---------- Phase 3: Simulate ---------- */
export function simulateActivityNarration(stationNo, activityIdx) {
  const act = SIM_STATIONS[stationNo - 1]?.activities[activityIdx];
  return act ? [instruct(act.speech)] : [];
}
export function simulateTipNarration(stationNo, activityIdx) {
  const act = SIM_STATIONS[stationNo - 1]?.activities[activityIdx];
  return act?.tipSpeech ? [instruct(act.tipSpeech)] : [];
}
export const simSuccessNarration = () => [cheer(pick(SIM_SUCCESS_LINES))];
export const simRetryNarration = () => [instruct(SIM_RETRY_LINE)];

/* ---------- Phase 4: Practice ---------- */
export function practiceQuestionNarration(qData) {
  return qData?.promptSpeech ? [ask(qData.promptSpeech)] : [];
}
export function practiceHintNarration(qData) {
  return qData?.hintSpeech ? [instruct(qData.hintSpeech)] : [];
}
export const correctFeedbackNarration = () => [cheer(pick(CORRECT_LINES))];
export const wrongFeedbackNarration = () => [instruct(pick(WRONG_LINES))];

/* ---------- Phase 5: Reflect ---------- */
export const reflectQuestionNarration = () => [cheer(REFLECT.cheer), think(REFLECT.question)];
export const reflectDoneNarration = () => [celebrate(REFLECT_DONE_LINE)];

/* ---------- Everything that can be pre-generated ---------- */
export function allNarrationSegments() {
  const all = [
    ...wonderNarration(),
    ...STORY_SLIDES.flatMap((_, i) => getStoryNarration(i)),
    ...SIM_STATIONS.flatMap((st) => st.activities.map((_, a) => simulateActivityNarration(st.id, a)[0])),
    ...SIM_STATIONS.flatMap((st) => st.activities.map((_, a) => simulateTipNarration(st.id, a)[0])),
    ...SIM_SUCCESS_LINES.map((t) => cheer(t)),
    instruct(SIM_RETRY_LINE),
    ...PRACTICE_QUESTIONS.flat().flatMap((q) => [ask(q.promptSpeech), instruct(q.hintSpeech)]),
    ...CORRECT_LINES.map((t) => cheer(t)),
    ...WRONG_LINES.map((t) => instruct(t)),
    ...reflectQuestionNarration(),
    ...reflectDoneNarration()
  ].filter(Boolean);
  const seen = new Set();
  return all.filter((s) => (seen.has(s.text) ? false : seen.add(s.text)));
}
