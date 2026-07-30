import { z } from "zod";

export const fridgeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "냉장고 이름은 필수 입력 항목입니다.")
        .max(10, "10자 이내로 입력해주세요."),
});

export type FridgeInputType = z.infer<typeof fridgeSchema>;
