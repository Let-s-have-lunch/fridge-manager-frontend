// schemas/admin/adminSchema.ts 에 추가/수정
import { z } from "zod";

export const updateUserSchema = z.object({
    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상 입력해주세요.")
        .max(10, "닉네임은 10자 이하로 입력해주세요."),
    email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."), // ✅ 이메일 검증 추가
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),
    password: z
        .string()
        .optional()
        .refine(val => !val || val.length >= 6, "비밀번호는 6자 이상이어야 합니다."),
});

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
