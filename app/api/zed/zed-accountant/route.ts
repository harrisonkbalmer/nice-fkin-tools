// app/api/zed-accountant/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || 'CLZsN3sDDL9wcHdSq1tMB';
const BASE_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const TOKEN_CONTRACT = '0xA7921e4C3Dc8E38069061a07C08fC0D2a35B9E6f';
const REWARD_CONTRACT = '0x4597f9Be8016217637f531B8Cb27bB678e70D59e';
const NFT_CONTRACT = '0x276CF8D7AeC9fDDC60c4Ed1aA37Dcd32b9e4afCf';

const HORSE_ADDRESS = '0x14B815A85341E857FB590e2CeB4AA17C2f7c2de5';
const STAKING_ADDRESS = '0xD0B125971DC4F0486bF7c4FF3da7007Dec2022fD';
const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();
    if (!wallet?.startsWith('0x')) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    console.log(`[Stable Accountant] Searching wallet: ${wallet}`);

    // Current balances (this part was working before)
    const balanceRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [wallet, [TOKEN_CONTRACT, REWARD_CONTRACT]],
      }),
    });
    const balanceData = await balanceRes.json();

    // TOKEN flows — only transfers involving this wallet
    const [tokenToHorseRes, tokenFromHorseRes, tokenToStakingRes, tokenFromStakingRes] = await Promise.all([
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: wallet, toAddress: HORSE_ADDRESS, contractAddresses: [TOKEN_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: HORSE_ADDRESS, toAddress: wallet, contractAddresses: [TOKEN_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 4, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: wallet, toAddress: STAKING_ADDRESS, contractAddresses: [TOKEN_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 5, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: STAKING_ADDRESS, toAddress: wallet, contractAddresses: [TOKEN_CONTRACT], category: ['erc20'] }] }) }),
    ]);

    // REWARD TOKEN flows — only transfers involving this wallet
    const [rewardToHorseRes, rewardFromHorseRes, rewardToStakingRes, rewardFromStakingRes, rewardIncomingNullRes] = await Promise.all([
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 6, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: wallet, toAddress: HORSE_ADDRESS, contractAddresses: [REWARD_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: HORSE_ADDRESS, toAddress: wallet, contractAddresses: [REWARD_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 8, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: wallet, toAddress: STAKING_ADDRESS, contractAddresses: [REWARD_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: STAKING_ADDRESS, toAddress: wallet, contractAddresses: [REWARD_CONTRACT], category: ['erc20'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 10, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: BURN_ADDRESS, toAddress: wallet, contractAddresses: [REWARD_CONTRACT], category: ['erc20'] }] }) }),
    ]);

    // NFT flows
    const [nftToRes, nftFromRes] = await Promise.all([
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 11, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", toAddress: wallet, contractAddresses: [NFT_CONTRACT], category: ['erc721'] }] }) }),
      fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 12, method: 'alchemy_getAssetTransfers', params: [{ fromBlock: "0x0", fromAddress: wallet, contractAddresses: [NFT_CONTRACT], category: ['erc721'] }] }) }),
    ]);

    const tokenToHorse = (await tokenToHorseRes.json()).result?.transfers || [];
    const tokenFromHorse = (await tokenFromHorseRes.json()).result?.transfers || [];
    const tokenToStaking = (await tokenToStakingRes.json()).result?.transfers || [];
    const tokenFromStaking = (await tokenFromStakingRes.json()).result?.transfers || [];

    const rewardToHorse = (await rewardToHorseRes.json()).result?.transfers || [];
    const rewardFromHorse = (await rewardFromHorseRes.json()).result?.transfers || [];
    const rewardToStaking = (await rewardToStakingRes.json()).result?.transfers || [];
    const rewardFromStaking = (await rewardFromStakingRes.json()).result?.transfers || [];
    const rewardIncomingNull = (await rewardIncomingNullRes.json()).result?.transfers || [];

    const toNft = (await nftToRes.json()).result?.transfers || [];
    const fromNft = (await nftFromRes.json()).result?.transfers || [];

    const sumTransfers = (transfers: any[]) => {
      let total = BigInt(0);
      transfers.forEach(t => {
        const raw = t.rawContract?.value || t.rawValue || '0';
        if (raw && raw !== '0' && raw !== '0x0') total += BigInt(raw);
      });
      return (Number(total) / 1e18).toFixed(4);
    };

    const formatBalance = (hex: string) => {
      if (!hex || hex === '0x0') return '0';
      try { return (Number(BigInt(hex)) / 1e18).toFixed(4); } catch { return '0'; }
    };

    const result = {
      token: formatBalance(balanceData.result?.tokenBalances?.find((t: any) => t.contractAddress.toLowerCase() === TOKEN_CONTRACT.toLowerCase())?.tokenBalance || '0x0'),
      rewardToken: formatBalance(balanceData.result?.tokenBalances?.find((t: any) => t.contractAddress.toLowerCase() === REWARD_CONTRACT.toLowerCase())?.tokenBalance || '0x0'),

      // TOKEN flows
      tokenHorseIn: sumTransfers(tokenFromHorse),   // horse → wallet
      tokenHorseOut: sumTransfers(tokenToHorse),    // wallet → horse
      tokenStakeIn: sumTransfers(tokenFromStaking), // stake → wallet
      tokenStakeOut: sumTransfers(tokenToStaking),  // wallet → stake

      // REWARD TOKEN flows
      rewardIncomingNull: sumTransfers(rewardIncomingNull),
      rewardHorseIn: sumTransfers(rewardFromHorse),   // horse → wallet
      rewardHorseOut: sumTransfers(rewardToHorse),    // wallet → horse
      rewardStakeIn: sumTransfers(rewardFromStaking), // stake → wallet
      rewardStakeOut: sumTransfers(rewardToStaking),  // wallet → stake

      // NFT
      currentHorses: toNft.length - fromNft.length,
      incomingNft: toNft.filter((t: any) => !t.from || t.from === BURN_ADDRESS).length,
      archivedNft: fromNft.filter((t: any) => !t.to || t.to === BURN_ADDRESS).length,
      transferredNft: fromNft.length - fromNft.filter((t: any) => !t.to || t.to === BURN_ADDRESS).length,
      totalNftCount: toNft.length + fromNft.length,
    };

    console.log('[Stable Accountant] Final result sent to frontend:', result);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}