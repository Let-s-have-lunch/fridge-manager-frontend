import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "카테고리 이름을 입력해주세요.")
        .max(30, "30자 이내로 입력해주세요."),
});

export type CategoryInputType = z.infer<typeof categorySchema>;
