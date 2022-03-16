/**
 * This is an example of a server that returns dynamic video.
 * Run `npm run server` to try it out!
 * If you don't want to render videos on a server, you can safely
 * delete this file.
 */

import {bundle} from '@remotion/bundler';
import {
	getCompositions,
	renderFrames,
	renderStill,
	stitchFramesToVideo,
} from '@remotion/renderer';
import express, {RequestHandler} from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 6969;

const cache = new Map<string, string>();

const renderHandler: RequestHandler<{compositionId: string}> = async (
	req,
	res
) => {
	if (!req.params || !req.params.compositionId)
		req.params = {compositionId: 'TwitchPanel'};
	const {compositionId} = req.params;
	const sendFile = (file: string) => {
		fs.createReadStream(file)
			.pipe(res)
			.on('close', () => {
				res.end();
			});
	};
	try {
		if (cache.get(JSON.stringify(req.query))) {
			sendFile(cache.get(JSON.stringify(req.query)) as string);
			return;
		}
		const bundled = await bundle(path.join(__dirname, './src/index.tsx'));
		const comps = await getCompositions(bundled, {inputProps: req.query});
		const video = comps.find((c) => c.id === compositionId);
		const tmpDir = await fs.promises.mkdtemp(
			path.join(os.tmpdir(), 'remotion-')
		);
		if (!video) {
			throw new Error(`No video called ${compositionId}`);
		} else if (video.durationInFrames < 2) {
			res.set('content-type', 'image/png');
			const finalOutput = path.join(tmpDir, 'out.png');
			await renderStill({
				composition: video,
				output: finalOutput,
				onError: (e) => console.error(e),
				webpackBundle: bundled,
				imageFormat: 'png',
				inputProps: req.query,
			});
			cache.set(JSON.stringify(req.query), finalOutput);
			sendFile(finalOutput);
			console.log('Image rendered and sent!');
		} else {
			res.set('content-type', 'video/mp4');

			const {assetsInfo} = await renderFrames({
				config: video,
				webpackBundle: bundled,
				onStart: () => console.log('Rendering frames...'),
				onFrameUpdate: (f) => {
					if (f % 10 === 0) {
						console.log(`Rendered frame ${f}`);
					}
				},
				parallelism: null,
				outputDir: tmpDir,
				inputProps: req.query,
				compositionId,
				imageFormat: 'jpeg',
			});

			const finalOutput = path.join(tmpDir, 'out.mp4');
			await stitchFramesToVideo({
				dir: tmpDir,
				force: true,
				fps: video.fps,
				height: video.height,
				width: video.width,
				outputLocation: finalOutput,
				imageFormat: 'jpeg',
				assetsInfo,
			});
			cache.set(JSON.stringify(req.query), finalOutput);
			sendFile(finalOutput);
			console.log('Video rendered and sent!');
		}
	} catch (err) {
		console.error(err);
		res.json({
			error: err,
		});
	}
};
app.get('/favicon.ico', (req, res) => {
	res.set('content-type', 'image/webp');
	res.sendFile(path.join(__dirname, './src/assets/DaRules.webp'));
});
app.get('/:compositionId', renderHandler);
app.get('/', renderHandler);

app.listen(port);

console.log(
	[
		`The server has started on http://localhost:${port}!`,
		'You can render a video by passing props as URL parameters.',
		'',
	].join('\n')
);
