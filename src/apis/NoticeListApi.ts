import axios from './AxiosInstance';

interface SuccessResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestamp?: string;
}

export interface Notice {
  title: string;
  content: string;
  createdAt: string;
}

// 알림 목록 조회 함수
export const getNoticeList = async (): Promise<Notice[]> => {
  const response = await axios.get<SuccessResponse<Notice[]>>('/passes/notifications');
  return response.data.data;
};

// 최신 알림 1개 조회 함수
export const getMostRecentNotice = async (): Promise<Notice | null> => {
  try {
    const response = await axios.get('/passes/notifications/recent');
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 알림 목록 전체 삭제 함수
export const deleteAllNotice = async (): Promise<SuccessResponse<null>> => {
  const response = await axios.delete<SuccessResponse<null>>('/passes/notifications');
  return response.data;
};
