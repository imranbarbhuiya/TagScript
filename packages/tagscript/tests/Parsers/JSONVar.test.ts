import { Interpreter, JSONVarParser, Response, SafeObjectTransformer, StrictVarsParser } from '../../src';

describe('JSONVar', () => {
	test('GIVEN a JSON in json var THEN store it as an object and show results using the parameter', async () => {
		const ts = new Interpreter(new JSONVarParser(), new StrictVarsParser());

		const text = '{json(data):{"name": "John Doe", "age": 30}}';

		expect(await ts.run(text)).toStrictEqual(
			new Response({
				data: new SafeObjectTransformer('{"name": "John Doe", "age": 30}')
			}).setValues('', text)
		);

		const text1 = `${text}{data.name}`;

		expect(await ts.run(text1)).toStrictEqual(
			new Response({
				data: new SafeObjectTransformer('{"name": "John Doe", "age": 30}')
			}).setValues('John Doe', text1)
		);
	});
});
