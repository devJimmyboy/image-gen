import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import './fonts.css';
import {Swirl} from './Swirl';

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
	fontSize: '5.5em',
	marginTop: 0,
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
	backgroundImage: `linear-gradient(135deg, ${props.color}, ${props.color}c0)`,
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
	fontFamily,
});

const sloganStyle: React.CSSProperties = {
	position: 'absolute',
	bottom: 58,
	right: 75,
	fontSize: 36,
	lineHeight: 1.1,
	fontWeight: 500,
	textAlign: 'center',
	whiteSpace: 'pre',
};

export const TwitchPanel: React.FC<{
	title: string;
	description: string;
	slogan: string;
	colors: {
		header: string;
		background: string;
		description: string;
		icon: string;
	};
	icon: string;
}> = ({title, icon, description, slogan, colors}) => {
	const [handle] = useState(() => delayRender());
	const [loaded, setLoaded] = useState<boolean>(false);
	useEffect(() => {
		if (loaded) continueRender(handle);
	}, [handle, loaded]);
	return (
		<AbsoluteFill
			style={{
				...absContainer,
				color: colors.description,
				backgroundColor: colors.background,
			}}
		>
			<AbsoluteFill>
				<div style={container}>
					<div style={titleStyle}>
						<span style={gradientText({color: colors.header})}>{title}</span>
					</div>
					<p style={descriptionStyle({color: colors.description})}>
						{description}
					</p>
					<div style={sloganStyle}>{slogan}</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Icon
					color={colors.icon}
					fontSize={384}
					icon={icon}
					onLoad={() => setLoaded(true)}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<Swirl />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
