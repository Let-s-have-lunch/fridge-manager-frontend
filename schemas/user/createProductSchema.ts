import { z } from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "제품명을 입력해주세요.")
        .max(30, "제품명은 30자 이내로 입력해주세요."),
    memo: z.string().max(100, "메모는 100자 이내로 입력해주세요.").optional(),
    categoryId: z.number().int().positive("유효한 카테고리를 선택해주세요."),
    storageType: z.enum(["REFRIGERATED", "FROZEN", "ROOM_TEMP"]),
    quantity: z.number().int().positive("수량은 0보다 커야 합니다."),
    unit: z.enum(["EA", "G", "KG", "ML", "L"]),
    price: z.number().int().nonnegative("가격은 0 이상이어야 합니다.").optional(), // 💡 일반 사용자도 가격 입력 가능!
    expirationDate: z.string().transform(str => new Date(str)),
    addMethod: z.enum(["MANUAL", "RECEIPT"]).optional().default("MANUAL"),
    status: z.enum(["STORED", "CONSUMED", "DISCARDED"]).default("STORED"),
});

export type ProductInputType = z.infer<typeof productSchema>;
