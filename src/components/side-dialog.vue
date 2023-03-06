<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

import { ClientOnly } from "#components";

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
	<!-- Dialog renders in a portal, so we need to wrap with `ClientOnly`. -->
	<ClientOnly>
		<TransitionRoot :show="props.open" as="template">
			<Dialog class="relative z-50" @close="onToggle">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-black/25" />
				</TransitionChild>

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
							<DialogPanel class="grid w-full max-w-sm content-start gap-8 rounded bg-white py-8">
								<div class="justify-self-end px-8">
									<button class="flex gap-1" @click="onToggle">
										<XMarkIcon
											aria-hidden="true"
											class="h-6 w-6 transition hover:text-neutral-700"
										/>
										<span class="sr-only">Close</span>
									</button>
								</div>

								<slot />
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>
	</ClientOnly>
</template>
