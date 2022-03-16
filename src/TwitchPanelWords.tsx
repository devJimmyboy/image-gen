import {Icon} from '@iconify/react';
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Img} from 'remotion';
import './fonts.css';
import daRulesImg from './assets/DaRules.webp';

const fontFamily = 'Lilita One';

const absContainer: React.CSSProperties = {
	backgroundColor: 'white',
	borderRadius: '25px',
	overflow: 'hidden',
};

const container: React.CSSProperties = {
	flex: 1,
	padding: 100,
	fontFamily,
	// Setting this property allows you to set a linebreak via URL parameter %0A
	whiteSpace: 'pre-wrap',
};

const titleStyle: React.CSSProperties = {
	fontSize: '4em',
	textShadow: '-6px 6px 0 rgba(0,0,0,0.4)',
	maxWidth: '5ch',
	marginLeft: 50,
	marginTop: -75,
	textAlignLast: 'center',
	width: '100%',
	fontWeight: 500,
	marginBottom: 0,
};

const descriptionStyle: (props: React.CSSProperties) => React.CSSProperties = (
	props
) => ({
	color: props.color,
	fontSize: '3.2em',
	margin: 0,
	marginTop: 20,
	lineHeight: 1.3,
	fontWeight: 400,
	maxWidth: '90%',
	maxLines: 2,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	lineClamp: 2,
});

const gradientText: (props: React.CSSProperties) => React.CSSProperties = (
	props
) => ({
	// backgroundImage: `linear-gradient(135deg, ${props.color}, ${props.color}c0)`,
	// backgroundClip: 'text',
	// WebkitBackgroundClip: 'text',
	// WebkitTextFillColor: 'transparent',
	fontFamily,
});

const wordsStyle: React.CSSProperties = {
	position: 'relative',
	textShadow: '-6px 6px 0 rgba(0,0,0,0.4)',
	bottom: 58,
	fontSize: 36,
	color: 'white',
	fontWeight: 700,
	textAlign: 'left',
};

export const TwitchPanelWords: React.FC<{
	title: string;
	description: string;
	words: string;
	colors: {
		header: string;
		background: string;
		description: string;
		icon: string;
	};
	icon: string;
}> = ({title, icon, description, words, colors}) => {
	// const [handle] = useState(() => delayRender());
	// const [loaded, setLoaded] = useState<boolean>(false);
	// useEffect(() => {
	// 	if (loaded) continueRender(handle);
	// }, [handle, loaded]);
	return (
		<AbsoluteFill
			style={{
				...absContainer,
				color: colors.description,
				backgroundColor: colors.background,
			}}
		>
			<AbsoluteFill>
				<Img
					style={{
						width: 420,
						filter: 'drop-shadow(-24px 12px 6px rgba(0,0,0,0.4))',
						position: 'absolute',
						top: '15%',
						left: '50%',
						transform: 'translateX(-50%)',
					}}
					src={daRulesImg}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<div style={container}>
					<div style={titleStyle}>
						<span style={gradientText({color: colors.header})}>{title}</span>
					</div>
					<p style={descriptionStyle({color: colors.description})}>
						{description}
					</p>
				</div>
			</AbsoluteFill>
			<AbsoluteFill>
				<div style={container}>
					<div
						style={{
							...wordsStyle,
							top: '45%',
							fontFamily: 'DM Sans',
							textAlign: 'center',
						}}
					>
						{words}
					</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill>
				<Swirl y={180} start={450} cycles={12} />
			</AbsoluteFill>
			<AbsoluteFill>
				<Swirl />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

import {
	interpolate,
	interpolateColors,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const COLOR_1 = '#4290f5';
const COLOR_2 = '#42e9f5';

function point({
	x,
	y,
	canvas,
	color,
	thickness,
}: {
	x: number;
	y: number;
	canvas: CanvasRenderingContext2D;
	color: string;
	thickness: number;
}) {
	canvas.beginPath();
	canvas.fillStyle = color;
	canvas.arc(x, y, thickness, 0, 2 * Math.PI, true);
	canvas.fill();
	canvas.closePath();
}

export const Swirl: React.FC<{
	y?: number;
	start?: number;
	end?: number;
	cycles?: number;
}> = (props) => {
	const ref = useRef<HTMLCanvasElement>(null);
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	useEffect(() => {
		const ctx = ref.current?.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, width, height);
		const start = props.start || 110;
		const end = props.end || width - 110;
		for (let i = start; i < end; i++) {
			const swirlProgress = interpolate(i, [start, end], [0, 1], {});
			const swirl = interpolate(
				swirlProgress,
				[0, 1],
				[0, Math.PI * (props.cycles || 24)]
			);
			const yOffset = Math.sin(swirl) * 15;

			const baseColor = interpolateColors(i, [0, width], [COLOR_2, COLOR_1]);

			point({
				x: i,
				y: (props.y || height) - 90 + yOffset,
				canvas: ctx,
				color: baseColor,
				thickness: 8,
			});
		}
	}, [frame, height, width]);

	return (
		<canvas ref={ref} style={{width, height}} width={width} height={height} />
	);
};
