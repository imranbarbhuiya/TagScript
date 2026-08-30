import { describe, expect, test } from 'bun:test';

import {
	Interpreter,
	JSONVarParser,
	Response,
	SafeObjectTransformer,
	StrictVarsParser,
	TemplateError,
} from '../../src';

describe('JSONVar', () => {
	test('GIVEN a JSON in json var THEN store it as an object and show results using the parameter', async () => {
		const ts = new Interpreter(new JSONVarParser(), new StrictVarsParser());

		const text = '{json(data):{"name": "John Doe", "age": 30}}';

		expect(await ts.run(text)).toStrictEqual(
			new Response({
				data: new SafeObjectTransformer('{"name": "John Doe", "age": 30}'),
			}).setValues('', text),
		);

		const text1 = `${text}{data.name}`;

		expect(await ts.run(text1)).toStrictEqual(
			new Response({
				data: new SafeObjectTransformer('{"name": "John Doe", "age": 30}'),
			}).setValues('John Doe', text1),
		);
	});

	test('GIVEN malformed JSON THEN report it as a TemplateError', async () => {
		const ts = new Interpreter(new JSONVarParser(), new StrictVarsParser());
		const response = await ts.run('{json(data):{"name": }}');

		expect(response.errors).toHaveLength(1);
		expect(response.errors[0]).toBeInstanceOf(TemplateError);
		expect(response.body).toBe('json was given something that is not valid JSON');
	});
});
