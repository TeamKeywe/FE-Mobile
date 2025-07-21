import { Buffer } from 'buffer/';

(global as any).Buffer = Buffer;

import {
  Agent,
  OutOfBandModule,
  ConnectionsModule,
  CredentialsModule,
  HttpOutboundTransport,
  WsOutboundTransport,
  AutoAcceptCredential,
  MediationRecipientModule,
  AgentEventTypes,
  MessagePickupModule,
  MediatorPickupStrategy,
  V2CredentialProtocol, // 병원이 Issue-Credential v2 사용 시
  JsonLdCredentialFormatService, // 병원이 JSON-LD VC를 보내는 경우   // ← 여기서 AnonCreds 포맷 서비스 임포트
  DidCommMimeType,
  ProofsModule,
  V2ProofProtocol,
  AutoAcceptProof,
  DidsModule,
  W3cCredentialsModule,
  KeyDidRegistrar,
  KeyDidResolver,
} from '@credo-ts/core';
import { AskarModule } from '@credo-ts/askar';
import {
  AnonCredsModule,
  AnonCredsCredentialFormatService,
  AnonCredsProofFormatService,
  LegacyIndyProofFormatService,
  LegacyIndyCredentialFormatService,
  V1CredentialProtocol,
} from '@credo-ts/anoncreds';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
} from '@credo-ts/indy-vdr';
import { agentDependencies } from '@credo-ts/react-native';
import { ariesAskar } from '@hyperledger/aries-askar-react-native';
import 'react-native-get-random-values';
import 'react-native-quick-crypto'; // crypto 폴리필
import axios from 'axios';
import Config from 'react-native-config';
import { startHospitalPolling } from './hospitalConnectService';

// 지갑 정보
const walletId = 'test-wallet-id-1';
const walletKey = 'testkey00000000000000000000000000';

//const MEDIATOR_INVITATION_URL = 'ws://192.168.0.115:8000?oob=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzEuMS9pbnZpdGF0aW9uIiwgIkBpZCI6ICJkNjg4YjkwYi0zOWFhLTQyN2MtYjk1MS1iMjRmZTYxZmExNjMiLCAibGFiZWwiOiAibWVkaWF0b3ItYWNhcHkiLCAiaGFuZHNoYWtlX3Byb3RvY29scyI6IFsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiXSwgImFjY2VwdCI6IFsiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCAic2VydmljZXMiOiBbImRpZDpwZWVyOjIuVno2TWtmRXV3U1F2cHdDRFhaTWNhTEdiTlRaWm9HeU1URnB3V0Z5d3REd3BKYUpYcS5FejZMU25qczQ3bWdnUUF1WVBGQXpOMW1FSG5QcUU4R0pOZEpyVkZYWGlrZzdXYk5TLlNleUpwWkNJNklpTmthV1JqYjIxdExUQWlMQ0owSWpvaVpHbGtMV052YlcxMWJtbGpZWFJwYjI0aUxDSndjbWx2Y21sMGVTSTZNQ3dpY21WamFYQnBaVzUwUzJWNWN5STZXeUlqYTJWNUxURWlYU3dpY2lJNlcxMHNJbk1pT2lKM2N6b3ZMekU1TWk0eE5qZ3VNQzR4TVRVNk9EQXdNQ0o5Il19';

interface MediatorInvitationResponse {
  data: {
    invitationUrl: string;
  };
}

const getMediatorInvitation = async (): Promise<{ invitationUrl: string }> => {
  try {
    console.log(Config.DID_URL);
    const response = await axios.get<MediatorInvitationResponse>(
      `${Config.DID_URL}/polls/mediator-invitation`);
    return response.data.data;
  } catch (error) {
    console.log('❌ Mediator 초대 정보 요청 실패:', error);
    throw error;
  }
};

export async function createCredoAgent(
  mediatorUrl: string | null = null,
  passId?: string,
  hospitalId?: number
): Promise<Agent> {
  try {
    console.log('🔄 Agent 초기화 중...');

    const legacyIndyCredentialFormat = new LegacyIndyCredentialFormatService();
    const legacyIndyProofFormat = new LegacyIndyProofFormatService();

    let mediatorInvitationUrl = mediatorUrl;
    if (!mediatorInvitationUrl) {
      try {
        const mediatorInfo = await getMediatorInvitation();
        mediatorInvitationUrl = mediatorInfo.invitationUrl;
        console.log('✅ API에서 Mediator 초대 URL 획득:', mediatorInvitationUrl);
      } catch (error) {
        console.warn('⚠️ API에서 Mediator 정보 획득 실패, 기본값 사용');
        // 기본 mediator URL 사용: 기본적으로 테스트 할 때 하나 받아서 녛어두면 좋을 듯
        mediatorInvitationUrl =
          'ws://10.221.84.216:8000?oob=eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzEuMS9pbnZpdGF0aW9uIiwgIkBpZCI6ICJhYWNhODc0Yi0zNzVmLTQ1YzAtYTUyMC0yNmM0MWUyOGU2NTIiLCAibGFiZWwiOiAibWVkaWF0b3ItYWNhcHkiLCAiaGFuZHNoYWtlX3Byb3RvY29scyI6IFsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiXSwgImFjY2VwdCI6IFsiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCAic2VydmljZXMiOiBbImRpZDpwZWVyOjIuVno2TWtzY0s3MUhkeWpUV2c4ajJGWTIzS0E3UVVIU3RXdld6QmdFbUU3WENXUmtYZy5FejZMU25qWUNIenVSWTNLR2ZOSFJTNEdVVnE1TUJHUzRHdEE3WDFnTmNzVFMySGJlLlNleUpwWkNJNklpTmthV1JqYjIxdExUQWlMQ0owSWpvaVpHbGtMV052YlcxMWJtbGpZWFJwYjI0aUxDSndjbWx2Y21sMGVTSTZNQ3dpY21WamFYQnBaVzUwUzJWNWN5STZXeUlqYTJWNUxURWlYU3dpY2lJNlcxMHNJbk1pT2lKM2N6b3ZMekV3TGpJeU1TNDROQzR5TVRZNk9EQXdNQ0o5Il19';
      }
    }

    const _agent = new Agent({
      config: {
        label: 'KeyWeCredo',
        walletConfig: { id: walletId, key: walletKey },
        autoUpdateStorageOnStartup: true,
        didCommMimeType: DidCommMimeType.V1,
      },
      dependencies: agentDependencies,
      modules: {
        askar: new AskarModule({
          ariesAskar,
        }),
        connections: new ConnectionsModule({
          autoAcceptConnections: true,
        }),
        outOfBand: new OutOfBandModule(),
        anoncreds: new AnonCredsModule({
          registries: [new IndyVdrAnonCredsRegistry()],
          anoncreds: require('@hyperledger/anoncreds-react-native'),
        }),
        dids: new DidsModule({
          registrars: [new IndyVdrIndyDidRegistrar(), new KeyDidRegistrar()],
          resolvers: [new IndyVdrIndyDidResolver(), new KeyDidResolver()],
        }),
        credentials: new CredentialsModule({
          autoAcceptCredentials: AutoAcceptCredential.Always,
          credentialProtocols: [
            new V1CredentialProtocol({
              indyCredentialFormat: legacyIndyCredentialFormat,
            }),
            new V2CredentialProtocol({
              credentialFormats: [
                new JsonLdCredentialFormatService(),
                new AnonCredsCredentialFormatService(),
                new LegacyIndyCredentialFormatService(),
              ],
            }),
          ],
        }),
        proofs: new ProofsModule({
          autoAcceptProofs: AutoAcceptProof.ContentApproved,
          proofProtocols: [
            new V2ProofProtocol({
              proofFormats: [new LegacyIndyProofFormatService(), new AnonCredsProofFormatService()],
            }),
          ],
        }),
        w3cVc: new W3cCredentialsModule(),
        mediationRecipient: new MediationRecipientModule({
          mediatorInvitationUrl: mediatorInvitationUrl,
        }),
        messagePickup: new MessagePickupModule(),
      },
    });

    _agent.registerOutboundTransport(new HttpOutboundTransport());
    _agent.registerOutboundTransport(new WsOutboundTransport());

    // 이벤트 바인딩 (생략 가능: 필요하면 여기서 추가)
    _agent.events.on(AgentEventTypes.AgentMessageReceived, (event) => {
      console.log('📨 Mediator로부터 원시 메시지 수신:', JSON.stringify(event.payload, null, 2));
    });
    _agent.events.on(AgentEventTypes.AgentMessageProcessed, ({ payload }) => {
      console.log('🔓 복호화된 메시지:', payload.message);
    });

    await _agent.initialize();

    console.log('Agent 초기화 성공');

    //Agent 초기화 완료 후 Hospital polling 시작
    if (passId && hospitalId) {
      startHospitalPolling({agent: _agent, passId, hospitalId});
    }

    return _agent;
  } catch (error) {
    console.log('❌ Agent 초기화 실패:', error);

    // Mediator 연결 실패 시 재시도 로직
    setTimeout(() => {
      console.log('Mediator 연결 재시도');
      createCredoAgent();
    }, 5000); //5초 후 재시도

    throw error;
  }
}
