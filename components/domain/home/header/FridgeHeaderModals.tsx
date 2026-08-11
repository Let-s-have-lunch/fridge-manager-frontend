import React from "react";
import FridgeSettingSheet from "@/components/domain/home/header/FridgeSettingSheet";
import FridgeSheet from "@/components/domain/home/header/FridgeSheet";
import DeleteFridgeSheet from "@/components/domain/home/header/DeleteFridgeSheet";

interface Props {
    bottomSheetRef: React.RefObject<any>;
    addFridgeRef: React.RefObject<any>;
    editFridgeRef: React.RefObject<any>;
    deleteFridgeRef: React.RefObject<any>;
    selectedFridge: any;
    handleOpenAddFridge: () => void;
    handleOpenEditFridge: () => void;
    handleOpenDeleteFridge: () => void;
}

export default function FridgeHeaderModals({
    bottomSheetRef,
    addFridgeRef,
    editFridgeRef,
    deleteFridgeRef,
    selectedFridge,
    handleOpenAddFridge,
    handleOpenEditFridge,
    handleOpenDeleteFridge,
}: Props) {
    return (
        <>
            <FridgeSettingSheet
                ref={bottomSheetRef}
                onClose={() => bottomSheetRef.current?.dismiss()}
                onAddFridge={handleOpenAddFridge}
                onEditFridge={handleOpenEditFridge}
                onDeleteFridge={handleOpenDeleteFridge}
            />
            <FridgeSheet
                ref={addFridgeRef}
                mode="create"
                onClose={() => addFridgeRef.current?.dismiss()}
            />
            <FridgeSheet
                ref={editFridgeRef}
                mode="edit"
                fridge={selectedFridge}
                onClose={() => editFridgeRef.current?.dismiss()}
            />
            <DeleteFridgeSheet
                ref={deleteFridgeRef}
                fridge={selectedFridge}
                onClose={() => deleteFridgeRef.current?.dismiss()}
            />
        </>
    );
}
