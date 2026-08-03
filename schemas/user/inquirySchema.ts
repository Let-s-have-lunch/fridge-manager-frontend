import { z } from "zod";

export const inquirySchema = z.object({
    title: z.string().min(1, "제목은 필수 입력 항목입니다."),
    content: z.string().min(1, "내용은 필수 입력 항목입니다."),
});

export type InquiryInputType = z.infer<typeof inquirySchema>;
