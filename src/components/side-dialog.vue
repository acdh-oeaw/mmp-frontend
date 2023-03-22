<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import { ClientOnly } from "#components";
import { useRouter } from "#imports";

const props = defineProps<{
	open: boolean;
}>();

const emit = defineEmits<{
	(event: "toggle"): void;
}>();

function onToggle() {
	emit("toggle");
}

const router = useRouter();
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

				<div class="pointer-events-none fixed inset-0 flex">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="duration-200 ease-in"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
					>
						<DialogPanel
							class="pointer-events-auto grid h-full w-full max-w-md grid-rows-[auto_1fr] overflow-y-auto rounded bg-white py-8 shadow-xl"
						>
							<div class="flex justify-between">
								<div class="px-8">
									<button class="flex gap-1" @click="router.go(-1)">
										<ArrowLeftIcon
											aria-hidden="true"
											class="h-6 w-6 shrink-0 transition hover:text-neutral-700"
										/>
										<span class="sr-only">Go Back</span>
									</button>
								</div>
								<div class="px-8">
									<button class="flex gap-1" @click="onToggle">
										<XMarkIcon
											aria-hidden="true"
											class="h-6 w-6 shrink-0 transition hover:text-neutral-700"
										/>
										<span class="sr-only">Close</span>
									</button>
								</div>
							</div>

							<slot />
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</TransitionRoot>
	</ClientOnly>
</template>
