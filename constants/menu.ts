import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";

export const USER_NAV_LIST = [
    {
        name: "홈",
        path: "/",
        iconComponent: AntDesign,
        iconName: "home",
    },
    {
        name: "일정",
        path: "/shopping",
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
        path: "/my-page",
        iconComponent: Feather,
        iconName: "user",
    },
];

export const ADMIN_NAV_LIST = [
    { path: "/admin/users", label: "사용자 관리", icon: "users" },
    { path: "/admin/notices", label: "공지사항 관리", icon: "bell" },
    { path: "/admin/inquiries", label: "1:1 문의관리", icon: "message-square" },
    { path: "/", label: "서비스로 돌아가기", icon: "home" },
];
