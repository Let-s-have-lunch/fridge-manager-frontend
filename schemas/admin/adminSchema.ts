import { z } from "zod";

export const RoleType = ["USER", "ADMIN"] as const;

export const adminUpdateUserSchema = z.object({
    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상이어야 합니다.")
        .max(10, "닉네임은 10자 이내여야 합니다."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다.").optional().or(z.literal("")),
    email: z.string().email("유효한 이메일 형식이 아닙니다."),
    birthdate: z.string().optional(),
    role: z.enum(RoleType), // ✅ 하드코딩 제거, RoleType 변수 사용
});

export type AdminUpdateUserInputType = z.infer<typeof adminUpdateUserSchema>;

// 2. 관리자 - 공지사항 작성/수정 스키마
export const adminNoticeSchema = z.object({
    title: z.string().min(1, "제목은 필수값입니다."),
    content: z.string().min(1, "내용은 필수값입니다."),
});

export type AdminNoticeInputType = z.infer<typeof adminNoticeSchema>;
