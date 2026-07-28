import { z } from "zod";

export const updatePasswordSchema = z
    .object({
        prevPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
        password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
        confirmPassword: z.string().min(6, "비밀번호 확인은 6글자 이상이어야 합니다."),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "비밀번호 확인이 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export type UpdatePasswordInputType = z.infer<typeof updatePasswordSchema>;
