import { createTsdownConfig } from '../../scripts/tsdown.config.ts';

export default createTsdownConfig({
	entry: ['src/index.ts', 'src/effect/index.ts'],
});
