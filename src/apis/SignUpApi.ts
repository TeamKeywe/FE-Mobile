import axios from './AxiosInstance';

export interface CreateMemberForm {
  name: string;
  regNo: string;      
  contact: string;    
  email: string;
  password: string;
}

export interface CreateMemberResponse {
  success: boolean;
  status: number;
  data: {
    memberId: number;
    email: string;
  };
  timestamp?: string;
}

//회원가입 (회원 정보 생성)
export const createMemberInfo = async (
  form: CreateMemberForm,
): Promise<CreateMemberResponse> => {
  const response = await axios.post<CreateMemberResponse>('/members', {
    name: form.name,
    regNo: form.regNo,
    contact: form.contact,
    email: form.email,
    password: form.password,
  });

  return response.data;
};
