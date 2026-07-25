import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";

export const tabs = [

    {
        name: "홈",
        path: "/",
        iconComponent: AntDesign,
        iconName: "home",
    },
    {
        name: "목록",
        path: "/list",
        iconComponent: Feather,
        iconName: "calendar",
    },
    {
        name: "통계",
        path: "/stats",
        iconComponent: Feather,
        iconName: "pie-chart",
    },
    {
        name: "마이페이지",
        path: "/settings",
        iconComponent: Feather,
        iconName: "user",
    },
];
