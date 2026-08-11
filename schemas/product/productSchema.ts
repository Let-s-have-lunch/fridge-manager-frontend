import { z } from "zod";
import { Status, Storage, Unit } from "@/types/product";

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "제품명을 입력해주세요.")
        .max(30, "제품명은 30자 이내로 입력해주세요."),
    memo: z.string().max(100, "메모는 100자 이내로 입력해주세요.").optional(),
    categoryId: z.number().int().positive("유효한 카테고리를 선택해주세요."),
    storageType: z.enum(Storage),
    quantity: z.number("수량을 입력해주세요.").int().positive("수량을 입력해주세요."),
    unit: z.enum(Unit),
    price: z.number().int().nonnegative("가격은 0 이상이어야 합니다.").nullable().optional(), // 💡 일반 사용자도 가격 입력 가능!
    expirationDate: z.string().regex(/^\d{8}$/, "유통기한은 8자리 숫자(YYYYMMDD)로 입력해주세요"),
    status: z.enum(Status),
});

export type ProductInputType = z.infer<typeof productSchema>;
