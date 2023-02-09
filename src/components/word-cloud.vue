<script lang="ts" setup>
import { scaleOrdinal, schemeCategory10, select } from 'd3';
import wordcloud, { type Word } from 'd3-cloud';
import { onUnmounted, ref, watch } from 'vue';

import { debounce } from '@/lib/debounce';
import { useElementDimensions } from '@/lib/use-element-dimensions';
import type { Token } from '@/lib/word-cloud/word-cloud.types';

type WordToken = Word & { text: string; value: number };

const props = defineProps<{
	data: Array<Token>;
	title: string;
}>();

const elementRef = ref<HTMLDivElement | null>(null);
const dimensions = useElementDimensions(elementRef);

const fill = scaleOrdinal(schemeCategory10);

function draw(words: Array<WordToken>) {
	if (words.length !== props.data.length) {
		console.warn('Wordcloud does not display all tokens.');
	}

	select('[data-word-cloud]')
		.html(null)
		.append('svg')
		.attr('width', layout.size()[0])
		.attr('height', layout.size()[1])
		.append('g')
		.attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
		.selectAll('text')
		.data(words)
		.enter()
		.append('text')
		.style('font-size', function (d) {
			return d.size + 'px';
		})
		.style('fill', (d) => fill(d.text))
		.attr('text-anchor', 'middle')
		.attr('transform', function (d) {
			return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
		})
		.text((d) => d.text);
}

const layout = wordcloud<WordToken>()
	.font("'Roboto FlexVariable', ui-sans-serif, system-ui, sans-serif")
	.padding(2)
	.rotate(() => Math.floor(Math.random() * 2) * 90)
	.timeInterval(16)
	.on('end', draw);

onUnmounted(() => {
	layout.stop();
});

const resize = debounce((dimensions: DOMRect) => {
	layout.stop().size([dimensions.width, dimensions.height]).start();
});

watch(
	dimensions,
	(dimensions) => {
		if (dimensions == null) return;

		resize(dimensions);
	},
	{ immediate: true }
);

watch(
	() => props.data,
	(data) => {
		const words = data.map(([text, value]) => ({ text, value }));

		layout
			.stop()
			/**
			 * `d3-cloud` will simply ignore words which would not fit the available space,
			 * so we need to scale text conservatively.
			 *
			 * @see https://github.com/jasondavies/d3-cloud#start
			 * @see https://github.com/jasondavies/d3-cloud/issues/36
			 */
			.fontSize((word) => (word.value * 200) / words.length)
			.words(words)
			.start();
	},
	{ immediate: true }
);
</script>

<template>
	<div class="word-cloud-container">
		<h3 class="text-center">{{ title }}</h3>
		<div ref="elementRef" data-word-cloud="" />
	</div>
</template>

<style scoped>
.word-cloud-container {
	height: 460px;
}

[data-word-cloud] {
	display: grid;
	width: 100%;
	height: 100%;
}
</style>
