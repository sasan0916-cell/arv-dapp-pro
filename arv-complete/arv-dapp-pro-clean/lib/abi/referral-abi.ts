export const ARV_REFERRAL_ADDRESS = '0x73bCca6d8897f3dA3b43c085034F077d23D9Ed83' as `0x${string}`;

export const ARV_REFERRAL_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "string", "name": "code", "type": "string"}], "name": "CodeRegistered", "type": "event" },
  { "anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "referrer", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newUser", "type": "address"}, {"indexed": false, "internalType": "string", "name": "code", "type": "string"}], "name": "ReferralRegistered", "type": "event" },
  { "inputs": [{"internalType": "address", "name": "user", "type": "address"}], "name": "getReferralInfo", "outputs": [{"internalType": "string", "name": "code", "type": "string"}, {"internalType": "address", "name": "referrer", "type": "address"}, {"internalType": "uint256", "name": "invites", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "string", "name": "code", "type": "string"}], "name": "registerMyCode", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "string", "name": "code", "type": "string"}], "name": "registerReferral", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "string", "name": "", "type": "string"}], "name": "codeToReferrer", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "inviteCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "referredBy", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "userToCode", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function" }
] as const;
