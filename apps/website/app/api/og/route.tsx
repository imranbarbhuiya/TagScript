import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const font = fetch(new URL('Inter-SemiBold.otf', import.meta.url)).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
	const inter = await font;

	const { searchParams } = new URL(req.url);

	const hasTitle = searchParams.has('title');
	const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Tagscript';
	const description = searchParams.get('description') ?? 'Tagscript is a simple, lightweight, and easy to use templating language.';

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
					padding: 80,
					backgroundColor: '#030303',
					backgroundImage:
						'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
					backgroundSize: '100px 100px',
					backgroundPosition: '-30px -10px',
					fontWeight: 600,
					color: 'white'
				}}
			>
				<span style={{ position: 'absolute', top: 70, left: 80, fontSize: 40 }}>Tagscript</span>
				<p
					style={{
						position: 'absolute',
						bottom: 70,
						left: 80,
						margin: 0,
						fontSize: 30,
						letterSpacing: -1
					}}
				>
					{description}
				</p>
				<h1
					style={{
						fontSize: 82,
						margin: '0 0 40px -2px',
						lineHeight: 1.1,
						textShadow: '0 2px 30px #000',
						letterSpacing: -4,
						backgroundImage: 'linear-gradient(90deg, #fff 40%, #aaa)',
						backgroundClip: 'text',
						color: 'transparent'
					}}
				>
					{title}
				</h1>
			</div>
		),
		{
			width: 1_200,
			height: 630,
			fonts: [
				{
					name: 'inter',
					data: inter,
					style: 'normal'
				}
			]
		}
	);
}
