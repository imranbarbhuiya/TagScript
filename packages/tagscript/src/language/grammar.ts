import tmLanguage from '../../language/tagscript.tmLanguage.json';

/**
 * The TextMate grammar for TagScript.
 *
 * This is the portable half of the two. Hand it to shiki for a static code block, or point a VS
 * Code extension's `contributes.grammars` at the file itself, which is published at
 * `tagscript/language/tagscript.tmLanguage.json` so it needs no build step.
 *
 * It cannot say whether a tag exists, only what shape it has. Use {@link tokenize} for that, which
 * runs the real lexer. A test in this package asserts the two agree on where each part of a tag
 * begins and ends, so the grammar cannot quietly drift from the interpreter.
 */
export const grammar = tmLanguage;
