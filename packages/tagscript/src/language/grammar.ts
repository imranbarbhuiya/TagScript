/**
 * The TextMate grammar for TagScript.
 *
 * This is the portable half of the two. Hand it to shiki for a static code block, or point a VS
 * Code extension's `contributes.grammars` at the file itself, which is published at
 * `tagscript/language/tagscript.tmLanguage.json` so it needs no build step.
 *
 * It cannot say whether a tag exists, only what shape it has. Use `tokenize` for that, which runs
 * the real lexer. A test in this package asserts the two scope every character the same way, so
 * the grammar cannot quietly drift from the interpreter.
 */
export { default as grammar } from '../../language/tagscript.tmLanguage.json';
