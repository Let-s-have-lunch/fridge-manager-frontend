import { z } from "zod";

export const shoppingListFormSchema = z.object({
    memo: z.string().min(1, "내용을 입력해주세요.").max(30, "메모는 30자 이내로 입력해주세요."),
});

export type ShoppingListFormInputType = z.infer<typeof shoppingListFormSchema>;
