export type PetStat = 'satiety' | 'happiness' | 'energy' | 'cleanliness';

export type PetAction = 'feed' | 'play' | 'sleep' | 'clean';

export type Pet = {
    id: number;
    name: string;
    level: number;
    experience: number;
    satiety: number;
    happiness: number;
    energy: number;
    cleanliness: number;
    last_action_at: string | null;
};

export type Item = {
    id: number;
    name: string;
    description: string;
    category: 'food' | 'toy' | 'hygiene' | 'energy';
    price: number;
    effect_stat: PetStat;
    effect_value: number;
    image_path: string | null;
};

export type InventoryItem = {
    id: number;
    item_id: number;
    quantity: number;
    item: Item;
};
