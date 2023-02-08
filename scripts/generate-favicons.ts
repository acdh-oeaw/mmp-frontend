import { copyFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

import generateFavicons, { generateSocialImage } from '@stefanprobst/favicons';
import { log } from '@stefanprobst/log';

import { manifestFileName, metadata, openGraphImageName } from '../config/metadata.config';

async function generate() {
	const publicFolder = join(process.cwd(), 'public');
	const inputFilePath = join(process.cwd(), metadata.logo.pathname);
	const outputFolder = publicFolder;

	await generateFavicons({
		fit: metadata.logo.fit,
		inputFilePath,
		manifestFileName,
		maskable: metadata.logo.maskable,
		name: metadata.title,
		outputFolder,
		shortName: metadata.shortTitle,
	});

	if (extname(inputFilePath) === '.svg') {
		await copyFile(inputFilePath, join(outputFolder, 'icon.svg'));
	}

	await generateSocialImage(
		join(process.cwd(), metadata.image.pathname),
		join(outputFolder, openGraphImageName),
		{ fit: metadata.image.fit }
	);

	const robots = `User-agent: *\nAllow: /\n`;
	await writeFile(join(publicFolder, 'robots.txt'), robots, { encoding: 'utf-8' });
}

generate()
	.then(() => {
		log.success('Successfully generated favicons.');
	})
	.catch((error) => {
		const message = String(error);
		log.error('Failed to generate favicons.\n', message);
		process.exit(1);
	});
