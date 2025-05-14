type DataKey = "monsters" | "magicItems" | "spells" | "traits";
type Alignment = "L" | "N" | "C";

type Trait = {
	name: string;
	description: string;
}

type Manifest = {
	source: string;
	author: string;
	slug: string;
	legal: string;
	licenses: string[];
	data: Record<DataKey, string>;
};

type Monster = {
	name: string;
	slug: string;
	description: string;
	armor_class: number;
	armor_type: string;
	hit_points: number;
	attacks: string;
	movement: string;
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	alignment: Alignment;
	level: number;
	traits: Trait[];
};

type Spell = {
	name: string;
	slug: string;
	description: string;
	classes: string[];
	duration: string;
	range: string;
	tier: string;
};

type MagicItem = {
	name: string;
	slug: string;
	description: string;
	traits: Trait[];
};

type DataItem = Monster | Spell | MagicItem | Trait;
