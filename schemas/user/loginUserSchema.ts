import { z } from "zod";

export const loginUserSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
});

export type LoginUserInputType = z.infer<typeof loginUserSchema>;
