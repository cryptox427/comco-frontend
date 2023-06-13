import ContractABI from "./contractABI.json";
import ComCoABI from "./abi/comcoABI.json";
import SaleABI from "./abi/saleABI.json";
import NFTABI from "./abi/nftABI.json";
import USDTABI from "./abi/usdt.json"

import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const contractAddress = "0xD88c24F137152B97BF33C5d500a3B5aC90dFf248";
const comcoContractAddress = "0x0527c9f0A48ddda0fC1d409d8AC84b32561c1c92";
const salesContractAddress = "0x78B16979a279DED296e409C550Aff4c5a0DDDd28";
const nftContractAddress = "0xdf55856589761027642994ed4Ef6385E05439Eba";
const usdtContractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

//contract configuration
export const contractConfig = {
    address: contractAddress,
    abi: ContractABI,
}

export const comcoConfig = {
    address: comcoContractAddress,
    abi: ComCoABI
}

export const saleConfig = {
    address: salesContractAddress,
    abi: SaleABI
}

export const nftConfig = {
    address: nftContractAddress,
    abi: NFTABI
}

export const usdtConfig = {
    address: usdtContractAddress,
    abi: USDTABI
}

//maximum mint per wallet
export const maxMintPerWalletCall = {
    ...contractConfig,
    functionName: 'maxMintAmount',
    watch: true,
}

//maximum supply
export const maxSupplyCall = {
    ...contractConfig,
    functionName: 'maxSupply',
    watch: true,
}

//total minted items
export const totalMintedCall = {
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
}

//public mint cost
export const publicMintCostCall = {
    ...contractConfig,
    functionName: 'cost',
    watch: true,
}

//public mint
export const publicMintCall = {
    ...contractConfig,
    functionName: 'mint',
}

export const comCoBuyByUSDTCall = {
    ...saleConfig,
    functionName : 'buyWithUSDT'
}

export const usdtApprovalCheckCall = {
    ...usdtConfig,
    functionName: 'allowance'
}

export const usdtApproveCall = {
    ...usdtConfig,
    functionName : 'approve'
}

export const comCoBuyByMaticCall = {
    ...saleConfig,
    functionName: 'buyWithMatic'
}

export const nftBuyWithComCo = {
    ...nftConfig,
    functionName: 'mintByComCo'
}

export const nftBuyWithMatic = {
    ...nftConfig,
    functionName: 'mintByMatic'
}

export const comCoApproveCall = {
    ...comcoConfig,
    functionName: 'approve'
}

export const nftPriceByMaticGetCall = {
    ...nftConfig,
    functionName: 'mintFeeMatic'
}

export const nftPriceByComCoGetCall = {
    ...nftConfig,
    functionName: 'mintFee'
}

export const comCoPriceByUSDTGetCall = {
    ...saleConfig,
    functionName: 'fee'
}

export const comCoPriceByMaticGetCall = {
    ...saleConfig,
    functionName: 'feeMatic'
}

export const nftMaxLimitGetCall = {
    ...nftConfig,
    functionName: '_maxSupply'
}

export const nftTotalSupplyGetCall = {
    ...nftConfig,
    functionName: 'totalSupply'
}

export const saleAmountGetCall = {
    ...saleConfig,
    functionName: 'totalSale'
}

export const usdtBalaceGetCall = {
    ...usdtConfig,
    functionName: 'balanceOf'
}

export const comCoBalanceGetCall = {
    ...comcoConfig,
    functionName: 'balanceOf'
}
