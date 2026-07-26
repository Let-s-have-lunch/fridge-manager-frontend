
// const PROFILE_IMAGES = [
//     "https://via.placeholder.com/150/FFB3B3/000000?text=Profile1",
//     "https://via.placeholder.com/150/FFD1B3/000000?text=Profile2",
//     "https://via.placeholder.com/150/FFFFB3/000000?text=Profile3",
//     "https://via.placeholder.com/150/B3FFB3/000000?text=Profile4",
//     "https://via.placeholder.com/150/B3B3FF/000000?text=Profile5",
// ];


import { useState } from "react";

interface MainHeaderProps {
    userName: string;
    onSearch: (Keyword: string) => void;
    onSortToggle: (order: "asc" | "desc") => void;
}

export default function MainHeader({ userName, onSearch, onSortToggle }: MainHeaderProps) {

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOrder, setSortOrder]  = useState<"asc" | "desc">("asc");
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        // 검색창을 닫을 때 검색어 초기화 로직이 필요하다면 여기에 추가
        if (isSearchOpen) {
            setSearchKeyword("");
            onSearch("");
        }
    };


}