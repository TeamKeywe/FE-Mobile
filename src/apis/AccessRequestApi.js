import axios from './AxiosInstance';

// 병원 목록 조회
export const getHospitalList = async () => {
  const response = await axios.get('/hospitals');
  return response.data.data;
};

// 환자용: 본인 정보 검증
export const verifyPatientInfo = async (hospitalId) => {
  const response = await axios.post(
    '/patients/verify/patient',
    {},
    {
      headers: {
        'X-Hospital-Id': hospitalId,
      },
    },
  );

  return response.data;
};

// 보호자용: 환자 번호 검증
export const verifyPatientCode = async (patientCode, hospitalId) => {
  const response = await axios.post(
    '/patients/verify/guardian',
    { patientCode },
    {
      headers: {
        'X-Hospital-Id': hospitalId,
      },
    },
  );

  return response.data;
};

// 병원의 출입증 발급 가능 날짜 조회
export const getAvailableDates = async (hospitalId) => {
  const response = await axios.get('/hospitals/policies/available-dates', {
    headers: {
      'X-Hospital-Id': hospitalId,
    },
  });
  return response.data.data.availableDates;
};

// 출입증 신청
export const createAccessPass = async (form) => {
  const patientCode = form.visitCategory === 'PATIENT' ? '' : form.patientCode;

  const response = await axios.post(
    '/passes',
    {
      visitCategory: form.visitCategory,
      patientCode,
      startAt: form.checkedDate,
    },
    {
      headers: {
        'X-Hospital-Id': form.hospitalId,
      },
    },
  );
  return response.data;
};
