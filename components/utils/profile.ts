import { ImageSourcePropType } from "react-native";

const PROFILE_IMAGES = [
    require("@/assets/images/bear.png"),
    require("@/assets/images/cat.png"),
    require("@/assets/images/dog.png"),
    require("@/assets/images/fox.png"),
    require("@/assets/images/hamster.png"),
    require("@/assets/images/rabbit.png"),
    require("@/assets/images/tiger.png"),
];

export const getAnimalIcon = (id?: number): ImageSourcePropType => {
    if (!id) return PROFILE_IMAGES[0];

    return PROFILE_IMAGES[id % PROFILE_IMAGES.length];
};
