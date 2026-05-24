import type { CollectionEntry } from "astro:content";

export function getEntityType(entity: CollectionEntry<"entity">) {
	return entity.id.split("/")[1].replace(/-/g, " ");
}
