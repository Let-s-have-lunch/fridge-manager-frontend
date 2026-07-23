import axiosInstance from "@/api/axiosInstance";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";
import { User } from "@/types/user";

const registerUser = async (
    data: Omit<RegisterUserInputType, "confirmPassword">,
): Promise<User> => {
    const response = await axiosInstance.post("/users/create", data);
    return response.data.data;
};

const login = async (data: LoginUserInputType): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data.data;
};

const resetPassword = async (data: { email: string; newPassword: string }) => {
    const response = await axiosInstance.post("/users/password-reset", data);
    return response.data;
};

export default { registerUser, login, resetPassword };
