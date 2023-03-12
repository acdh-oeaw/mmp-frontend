<script lang="ts" setup>
import { TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
	open: boolean;
}>();

const emit = defineEmits<{
	(event: "toggle"): void;
}>();

function onToggle() {
	emit("toggle");
}
</script>

<template>
	<TransitionRoot :show="props.open" as="template">
		<div class="relative z-50">
			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="duration-200 ease-in"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
					>
						<aside class="grid w-full max-w-md content-start gap-8 rounded bg-white py-8">
							<div class="justify-self-end px-8">
								<button class="flex gap-1" @click="onToggle">
									<XMarkIcon aria-hidden="true" class="h-6 w-6 transition hover:text-neutral-700" />
									<span class="sr-only">Close</span>
								</button>
							</div>

							<slot />
						</aside>
					</TransitionChild>
				</div>
			</div>
		</div>
	</TransitionRoot>
</template>
