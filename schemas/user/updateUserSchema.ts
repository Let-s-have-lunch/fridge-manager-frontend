import { z } from "zod";

export const updateUserSchema = z.object({
    nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다.").optional(),
    email: z.string().email("올바른 이메일 형식이 아닙니다.").optional(),
    birthdate: z.union([z.string(), z.date()]).optional(), // 문자열이나 Date 객체 모두 허용
});

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
