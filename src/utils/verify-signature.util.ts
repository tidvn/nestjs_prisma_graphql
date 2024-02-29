// import { checkSignature } from '@meshsdk/core';
import { Blockchain } from '@prisma/client';
import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';

export const verifyMessage = (
  blockchain: Blockchain,
  message: string,
  signature: string,
  walletAddress: string,
): boolean => {
  let result = false;
  switch (blockchain) {
    case Blockchain.solana:
      result = nacl.sign.detached.verify(
        new TextEncoder().encode(message),
        bs58.decode(signature),
        bs58.decode(walletAddress),
      );
      break;
    // case Network.CARDANO:
    //   result = checkSignature(message, walletAddress, signature);
    //   break;
    // default:
    //   throw new Error('Unsupported network');
    //   break;
  }
  return result;
};
