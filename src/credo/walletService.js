export async function deleteWallet(agent) {
  if (!agent) throw new Error('Agent가 초기화되지 않았습니다.');

  await agent.wallet.delete();
}
