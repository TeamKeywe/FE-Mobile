import axios from './AxiosInstance';

export interface VerifyPasswordRequest {
  password: string;
}

export interface UpdatePasswordRequest {
  originalPassword: string;
  newPassword: string;
}

interface SuccessResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestamp?: string;
}

// 마이 페이지 진입 시, 비밀번호 검증 함수
export const verifyPassword = async (
    data: VerifyPasswordRequest,
  ): Promise<SuccessResponse<null>> => {
  const response = await axios.post<SuccessResponse<null>>('/members/me/password', data);
  return response.data;
};

// 비밀번호 변경 함수
export const updatePassword = async (
  data: UpdatePasswordRequest,
): Promise<SuccessResponse<null>> => {
  const response = await axios.patch<SuccessResponse<null>>('/members/me/password', {
    passwordOriginal: data.originalPassword,
    passwordNew: data.newPassword,
  });
  return response.data;
};
