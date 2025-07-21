import axios from './AxiosInstance';

export interface AccessPass {
  passId: number;
  memberId: number;
  hospitalId: number;
  accessAreas: AccessArea[];
  visitCategory: string;
  patientId: number;
  patientName: string;
  issuanceStatus: string; 
  startedAt: string;
  expiredAt: string;
}

export interface AccessArea {
  areaCode: string;
  areaName: string;
}

// 출입증 목록 조회
export const getAccessList = async (): Promise<AccessPass[]> => {
  const response = await axios.get<{
    success: boolean;
    status: number;
    data: AccessPass[];
    timestamp: string;
  }>('/passes');
  return response.data.data;
};
