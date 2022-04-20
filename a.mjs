import {
	Interpreter,
	RandomParser,
	RangeParser,
	FiftyFiftyParser,
	IfStatementParser,
	SliceParser,
} from './dist/index.mjs';
const interpreter = new Interpreter(
	new SliceParser(),
	new FiftyFiftyParser(),
	new RandomParser(),
	new IfStatementParser(),
);

const result = await interpreter.parse(
	'{random: Parbez,Rkn,Priyansh} attempts to pick the lock!, \nI pick {if({5050:.}!=):heads|tails} \n{slice(1):ok} \n{slice(1-5):Hi RKN}',
);
console.log(result);
