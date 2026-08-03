export const categoryIcons = {
    vegetable: require("@/assets/images/category/vegetable.png"),
    fruit: require("@/assets/images/category/fruit.png"),
    meat: require("@/assets/images/category/meat.png"),
    milk: require("@/assets/images/category/milk.png"),
    processed_food: require("@/assets/images/category/processed_food.png"),
    sauce: require("@/assets/images/category/sauce.png"),
    dish: require("@/assets/images/category/dish.png"),
    juice: require("@/assets/images/category/juice.png"),
    bread: require("@/assets/images/category/bread.png"),
    snack: require("@/assets/images/category/snack.png"),
    salad: require("@/assets/images/category/salad.png"),
    pill: require("@/assets/images/category/pill.png"),
    cosmetics: require("@/assets/images/category/cosmetics.png"),
    baby_food: require("@/assets/images/category/baby_food.png"),
    tag: require("@/assets/images/category/tag.png"),
} as const;

export type CategoryIconKey = keyof typeof categoryIcons;