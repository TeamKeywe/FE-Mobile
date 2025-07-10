import { Buffer } from 'buffer/';
global.Buffer = Buffer;

import { PeerDidNumAlgo } from '@credo-ts/core';

import '@hyperledger/aries-askar-react-native';
import 'react-native-get-random-values';
import 'react-native-quick-crypto'; // crypto 폴리필
import axios from 'axios';
import Config from 'react-native-config';

// ✅ 기존 수동 연결용 URL (테스트용, 실사용 시 API에서 수신 권장)
//const HOSPITAL_INVITATION_URL =
//'http://192.168.0.115:8020?oob=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzEuMS9pbnZpdGF0aW9uIiwgIkBpZCI6ICIxZTE4YjUzMi1lM2QxLTQxMDEtODU3ZC05NzljY2ViZjM3NjMiLCAibGFiZWwiOiAiXHVhYzE1XHViZDgxXHVjMGJjXHVjMTMxXHViY2QxXHVjNmQwIiwgImhhbmRzaGFrZV9wcm90b2NvbHMiOiBbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4wIl0sICJhY2NlcHQiOiBbImRpZGNvbW0vYWlwMjtlbnY9cmZjMTkiXSwgInNlcnZpY2VzIjogWyJkaWQ6cGVlcjoyLlZ6Nk1rZzNzVFY0VVZjUXV6Y1ZWMlZwMlBTTVZWSFl6VzNBZWZLU0xIVXNVVEFuTVkuRXo2TFNjdVo2eUJGNDFyNWJtU2s0cDVuN2NBQ1RwSEdYVXFxMVRlMkRLS21EcmI1Vy5TZXlKcFpDSTZJaU5rYVdSamIyMXRMVEFpTENKMElqb2laR2xrTFdOdmJXMTFibWxqWVhScGIyNGlMQ0p3Y21sdmNtbDBlU0k2TUN3aWNtVmphWEJwWlc1MFMyVjVjeUk2V3lJamEyVjVMVEVpWFN3aWNpSTZXMTBzSW5NaU9pSm9kSFJ3T2k4dk1Ua3lMakUyT0M0d0xqRXhOVG80TURJd0luMCJdfQ';

const POLL_INTERVAL = 2000;

// 병원 초대 URL 가져오는 함수 (API 호출)
export async function getHospitalInvitation(passId, hospitalId) {
  try {
    console.log('[getHospitalInvitation] 호출됨', {
      passId,
      hospitalId,
      url: `${Config.DID_URL}/polls/hospital-invitation`,
    });

    const response = await axios.post(`${Config.DID_URL}/polls/hospital-invitation`, {
      passId,
      hospitalId,
    });

    console.log('[getHospitalInvitation] 응답:', response.data);

    return response.data?.data?.invitationUrl;
  } catch (error) {
    console.log('[getHospitalInvitation] 에러 발생:', error);
    throw error;
  }
}

// 병원 연결 함수 (초대 URL로 연결)
export async function connectToHospital(agent, invitationUrl) {
  if (!agent || !invitationUrl) return;
  try {
    const result = await agent.dids.create({
      method: 'peer',
      options: { numAlgo: PeerDidNumAlgo.InceptionKeyWithoutDoc },
    });

    const record = await agent.oob.receiveInvitationFromUrl(invitationUrl, {
      ourDid: result.didState.did,
      autoAcceptConnection: true,
      autoAcceptInvitation: true,
    });
    return record;
  } catch (error) {
    console.log('❌ 병원 연결 실패:', error);
    throw error;
  }
}

let globalTimer = null;

// Hospital Polling 함수 (타이머 반환)
export function startHospitalPolling({ agent, passId, hospitalId }) {
  if (globalTimer) {
    clearInterval(globalTimer);
    globalTimer = null;
  }

  const poll = async () => {
    try {
      console.log('🔍 병원 초대 정보 요청 중...');
      const invitationUrl = await getHospitalInvitation(passId, hospitalId);
      if (invitationUrl) {
        console.log('✅ 초대 URL 수신, 병원 연결 시도...');
        await connectToHospital(agent, invitationUrl);
        clearInterval(globalTimer);
        console.log('✅ 병원 연결 완료');
        const vcList = await getAllVCs(agent);
        console.log('📄 내 VC 목록:', vcList);
      } else {
        console.log('⏳ 초대 정보 없음. 계속 대기 중...');
      }
    } catch (error) {
      console.log('❌ 병원 초대 요청 실패. 재시도 중...');
    }
  };

  globalTimer = setInterval(poll, POLL_INTERVAL);
  poll();
  // 반환값: polling 종료 함수
  return () => {
    if (globalTimer) {
      clearInterval(globalTimer);
      globalTimer = null;
      console.log('⏹️ 병원 polling 중지됨');
    }
  };
}

// 필요하다면 VC 목록 조회 등 기타 함수도 여기에 추가 가능
export async function getAllVCs(agent) {
  if (!agent) return [];
  try {
    const allCreds = await agent.credentials.getAll();
    return allCreds;
  } catch (error) {
    console.log('❌ VC 조회 실패:', error);
    throw error;
  }
}
