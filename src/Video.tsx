import {Still} from 'remotion';
import {TwitchPanel} from './TwitchPanel';
import {TwitchPanelWords} from './TwitchPanelWords';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Still
				id="TwitchPanel"
				component={TwitchPanel}
				width={1024}
				height={1024}
				defaultProps={{
					title: 'Twitch Panel',
					description: 'Dynamic template for twitch panels',
					slogan: 'Jimmyboy',
					icon: 'fa-brands:discord',
					colors: {
						header: '#f2f2f2',
						background: '#5662f6',
						description: '#f2f2f2af',
						icon: 'f2f2f2',
					},
				}}
			/>
			<Still
				id="TwitchPanelWords"
				component={TwitchPanelWords}
				width={1024}
				height={1536}
				defaultProps={{
					title: `Da Rules`,
					description: 'Dynamic template for twitch panels',
					words: `Cursing is allowed since this is a mature stream, but please don't say anything that's too far if you know what I mean.

No self-promotion - Talking to me saying you stream is fine, but just joining in to spam chat that you're better or you're going online is a big no-no.

I'm not sure what else to say, but please just follow in-general rules that you would follow on any other twitch stream!

Thanks for Understanding!`,
					icon: 'fa-brands:discord',
					colors: {
						header: '#f2f2f2',
						background: '#5662f6',
						description: '#f2f2f2',
						icon: 'f2f2f2',
					},
				}}
			/>
		</>
	);
};
