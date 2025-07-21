import axios from './AxiosInstance';

export interface MemberInfo {
  memberId: number;
  email: string;
  name: string;
  birthDate: string;
  contact: string;
}

export interface SuccessResponse<T> {
  success: true;
  status: number;
  data: T;
  timestamp: string;
}

export interface ErrorData {
  errorClassName: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  status: number;
  data: ErrorData;
  timestamp: string;
}

export type CommonResponse<T> = SuccessResponse<T> | ErrorResponse;

// 회원 정보 조회 함수
export const getMyInfo = async (): Promise<MemberInfo> => {
  const response = await axios.get<SuccessResponse<MemberInfo>>('/members/me');
  return response.data.data;
};

// 로그아웃 함수
export const logoutUser = async (): Promise<CommonResponse<null>> => {
  try {
  const response = await axios.post<SuccessResponse<null>>(
    '/auth/logout',
    {}, // body 부분에 빈 객체 명시
  );
  return response.data;
  } catch (error: any) {
  return handleErrorResponse(error);
  }
};

// 회원 탈퇴 함수
export const deleteUser = async (): Promise<CommonResponse<null>> => {
  try {
  const response = await axios.delete<SuccessResponse<null>>('/members');
  return response.data;
  } catch (error: any) {
    return handleErrorResponse(error);
  }
};

const handleErrorResponse = (error: any): ErrorResponse => {
  if (error.response?.data) {
    return error.response.data as ErrorResponse;
  }
  return {
    success: false,
    status: error.response?.status || 500,
    data: {
      errorClassName: error.name,
      message: error.message,
    },
    timestamp: new Date().toISOString(),
  };
};
