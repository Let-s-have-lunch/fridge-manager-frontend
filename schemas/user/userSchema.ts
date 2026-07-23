import { z } from "zod";

export const userSchema = z.object({
    nickname: z
        .string()
        .min(2, "닉네임을 2자 이상 입력해주세요.")
        .max(10, "닉네임은 10자 이하로 입력해주세요."),
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),
});
