<script lang="ts" setup>
import { TransitionChild, TransitionRoot } from "@headlessui/vue";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/vue/24/outline";

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
	<ClientOnly>
		<TransitionRoot :show="props.open" as="template">
			<div class="relative z-50">
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
						<aside
							class="pointer-events-auto grid h-full w-full max-w-md grid-rows-[auto_1fr] overflow-y-auto rounded bg-white py-8 shadow-xl"
						>
							<div class="flex justify-between">
								<div class="px-8">
									<button class="flex gap-1" @click="$router.go(-1)">
										<ArrowLeftIcon
											aria-hidden="true"
											class="h-6 w-6 transition hover:text-neutral-700"
										/>
										<span class="sr-only">Go Back</span>
									</button>
								</div>
								<div class="px-8">
									<button class="flex gap-1" @click="onToggle">
										<XMarkIcon
											aria-hidden="true"
											class="h-6 w-6 transition hover:text-neutral-700"
										/>
										<span class="sr-only">Close</span>
									</button>
								</div>
							</div>
							<slot />
						</aside>
					</TransitionChild>
				</div>
			</div>
		</TransitionRoot>
	</ClientOnly>
</template>
