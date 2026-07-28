import axiosInstance from "@/api/axiosInstance";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";
import { User } from "@/types/user";
import { UpdateUserInputType } from "@/schemas/user/updateUserSchema";
import { ChangePasswordInputType } from "@/schemas/user/changePasswordSchema";

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

// 4. 내 프로필 조회 (마이페이지)
const getMyProfile = async (): Promise<User> => {
    const response = await axiosInstance.get("/users/me");
    return response.data.data;
};

// 5. 회원정보 수정 (마이페이지)
const updateUser = async (data: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch("/users/update", data);
    return response.data.data;
};

// 6. 비밀번호 변경 (마이페이지 내)
const changePassword = async (data: ChangePasswordInputType) => {
    const response = await axiosInstance.patch("/users/password", data);
    return response.data;
};

// 7. 로그아웃
const logout = async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
};

// 8. 회원탈퇴
const withdrawUser = async (data: { password: string }) => {
    const response = await axiosInstance.patch("/users/withdraw", data);
    return response.data;
};

export default {
    registerUser,
    login,
    resetPassword,
    getMyProfile,
    updateUser,
    changePassword,
    logout,
    withdrawUser,
};
