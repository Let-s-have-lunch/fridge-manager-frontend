import { z } from "zod";
import { userSchema } from "@/schemas/user/userSchema";

export const registerUserSchema = userSchema
    .extend({
        password: z.string().min(6, { message: "비밀번호는 6자 이상 입력해주세요." }),
        confirmPassword: z.string().min(6, { message: "비밀번호 확인을 입력해주세요." }),
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
