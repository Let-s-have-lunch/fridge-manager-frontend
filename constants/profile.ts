import { ImageSourcePropType } from "react-native";

const PROFILE_IMAGES: ImageSourcePropType[] = [
    require("@/assets/images/avatars/bear.png"),
    require("@/assets/images/avatars/cat.png"),
    require("@/assets/images/avatars/dog.png"),
    require("@/assets/images/avatars/fish.png"),
    require("@/assets/images/avatars/fox.png"),
    require("@/assets/images/avatars/hamster.png"),
    require("@/assets/images/avatars/rabbit.png"),
    require("@/assets/images/avatars/tiger.png"),
];

export const getAnimalIcon = (id?: number): ImageSourcePropType => {
    if (!id) return PROFILE_IMAGES[0];

    return PROFILE_IMAGES[id % PROFILE_IMAGES.length];
};
