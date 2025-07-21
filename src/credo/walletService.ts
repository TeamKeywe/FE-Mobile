import { Agent } from '@credo-ts/core';

export async function deleteWallet(agent: Agent): Promise<void> {
  if (!agent) throw new Error('Agent가 초기화되지 않았습니다.');

  await agent.wallet.delete();
}
