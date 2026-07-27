import { z } from "zod";

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z.string().min(6, "새 비밀번호는 6자 이상이어야 합니다."),
});

export type ChangePasswordInputType = z.infer<typeof changePasswordSchema>;
