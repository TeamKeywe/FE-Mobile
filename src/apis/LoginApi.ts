import axios from './AxiosInstance';

export interface LoginForm {
  email: string;
  password: string;
  fcmToken?: string; 
}

export interface LoginResponse {
  success: boolean;
  status: number;
  data: {
    accessToken: string;
  };
  timestamp: string;
}

// 로그인 함수
export const loginUser = async (form: LoginForm): Promise<LoginResponse> => {
  const response = await axios.post('/auth/login', {
    email: form.email,
    password: form.password,
    fcmToken: form.fcmToken,
  });

  return response.data;
};
