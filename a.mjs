import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser } from './dist/index.mjs';
const interpreter = new Interpreter(new FiftyFiftyParser(), new RandomParser(), new IfStatementParser());

const result = await interpreter.parse('{random: Parbez,Rkn,Priyansh} attempts to pick the lock!');
const result1 = await interpreter.parse('I pick {if({5050:.}!=):heads|tails}');
console.log(result, result1);
