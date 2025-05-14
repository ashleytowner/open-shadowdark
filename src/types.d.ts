type DataKey = "monsters" | "magicItems" | "spells";

type Manifest = {
  source: string;
  author: string;
  slug: string;
  legal: string;
  licenses: string[];
  data: Record<DataKey, string>;
};
