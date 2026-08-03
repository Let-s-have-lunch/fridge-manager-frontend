import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHomeStore } from "@/stores/home/productStore";

export function useFridgeHeader() {
    const fridges = useHomeStore(state => state.fridges);
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);
    const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

    const keyword = useHomeStore(state => state.keyword);
    const setKeyword = useHomeStore(state => state.setKeyword);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFridgeOpen, setIsFridgeOpen] = useState(false);

    // 바텀시트 참조 (Refs)
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const addFridgeRef = useRef<BottomSheetModal>(null);
    const editFridgeRef = useRef<BottomSheetModal>(null);
    const deleteFridgeRef = useRef<BottomSheetModal>(null);

    // 현재 선택된 냉장고 찾기
    const selectedFridge = fridges.find(fridge => fridge.id === selectedFridgeId);

    // 검색창 토글
    const handleSearchToggle = () => {
        setIsSearchOpen(prev => !prev);
        if (!isSearchOpen) {
            // 열릴 때가 아니라 닫힐 때 초기화하려면 로직 확인 (기존 코드 유지)
            setKeyword("");
        }
    };

    // 설정 모달 열기
    const handleOpenSetting = () => {
        setIsFridgeOpen(false);
        setTimeout(() => {
            bottomSheetRef.current?.present();
        }, 200);
    };

    // 냉장고 추가 모달 열기
    const handleOpenAddFridge = () => {
        bottomSheetRef.current?.dismiss();
        setTimeout(() => {
            addFridgeRef.current?.present();
        }, 200);
    };

    // 냉장고 수정 모달 열기
    const handleOpenEditFridge = () => {
        bottomSheetRef.current?.dismiss();
        setTimeout(() => {
            editFridgeRef.current?.present();
        }, 200);
    };

    // 냉장고 삭제 모달 열기
    const handleOpenDeleteFridge = () => {
        bottomSheetRef.current?.dismiss();
        setTimeout(() => {
            deleteFridgeRef.current?.present();
        }, 200);
    };

    return {
        fridges,
        selectedFridgeId,
        setSelectedFridgeId,
        selectedFridge,
        keyword,
        setKeyword,
        isSearchOpen,
        setIsSearchOpen,
        isFridgeOpen,
        setIsFridgeOpen,
        handleSearchToggle,
        bottomSheetRef,
        addFridgeRef,
        editFridgeRef,
        deleteFridgeRef,
        handleOpenSetting,
        handleOpenAddFridge,
        handleOpenEditFridge,
        handleOpenDeleteFridge,
    };
}
