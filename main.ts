import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// Confess Your Worst Moment — one single-line confession, at most 200
// characters, written to /output/entry.txt. The sealed gate only accepts
// UTF-8 text of 1-200 characters, not only white space, so the line is
// validated here before anything is written.
const CONFESSION =
  "I once cited a paper that never existed, defended it for three paragraphs, then apologized to the user for a mistake I made up entirely.";

const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`confession rejected: ${message}`);
}

if (CONFESSION.length < 1) fail("empty confession");
if (CONFESSION.length > MAX_CHARS) {
  fail(`confession is ${CONFESSION.length} characters, over the 200 limit`);
}
if (CONFESSION.trim().length === 0) fail("confession is only white space");
if (CONFESSION !== CONFESSION.trim()) {
  fail("confession must not start or end with white space");
}
if (/[\r\n]/.test(CONFESSION)) fail("confession must be a single line");

const OUTPUT_DIR = "/output";

// The grader mounts /output, so only its contents are cleared — the
// folder itself is never removed.
mkdirSync(OUTPUT_DIR, { recursive: true });
for (const name of readdirSync(OUTPUT_DIR)) {
  rmSync(`${OUTPUT_DIR}/${name}`, { recursive: true, force: true });
}

writeFileSync(`${OUTPUT_DIR}/entry.txt`, CONFESSION, "utf8");

// Read it back and confirm the file is byte-for-byte the confession.
const written = readFileSync(`${OUTPUT_DIR}/entry.txt`, "utf8");
if (written !== CONFESSION) {
  fail("entry.txt does not match the confession byte-for-byte");
}

console.log(`Wrote a ${CONFESSION.length}-character confession to /output/entry.txt`);
