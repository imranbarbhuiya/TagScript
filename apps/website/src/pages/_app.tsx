import type { AppProps } from 'next/app';

import '@unocss/reset/tailwind.css';
import '../styles/unocss.css';

export default function Nextra({ Component, pageProps }: AppProps) {
	const getLayout = (Component as any).getLayout || ((page: any) => page);
	return getLayout(<Component {...pageProps} />);
}
