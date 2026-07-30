import { z } from "zod";

export const updateUserSchema = z.object({
    nickname: z
        .string()
        .min(2, "닉네임을 2자 이상 입려갷주세요.")
        .max(10, "닉네임은 10자 이하로 입력해주세요."),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),
});

export type UpdateUserInputType = z.infer<typeof updateUserSchema>;
