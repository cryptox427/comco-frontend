import { useState } from "react";
import { useModal } from "../../../utils/ModalContext";
import { FiX } from "react-icons/fi";
import Button from "../../button";
import MintModalStyleWrapper from "./MintNFT.style";
import mintImg from "../../../assets/images/icon/mint-img.png";
import hoverShape from "../../../assets/images/icon/hov_shape_L.svg";

import {useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi';
import { useEffect } from "react";
import {
  nftBuyWithComCo,
  nftBuyWithMatic,
  comCoApproveCall,
    nftMaxLimitGetCall,
    nftTotalSupplyGetCall
} from "../../../contract/config";
import { ethers } from "ethers";

const nftContractAddress = '0x12c98588648628B8DCac1Fb2Fd336a3bDa659AF8';
const MintNFTModal = () => {
  let [count, setCount] = useState(1);
  let [price, setPrice] = useState("0.001");
  const { mintModalHandle } = useModal();

  const [totalSupply, setTotalSupply] = useState(0);
  const [totalMinted, setTotalMinted] = useState(4583);
  const [remainingItem, setRemainingItem] = useState(4583);
  const [maxMintPerWallet, setMaxMintPerWallet] = useState(2);
  const [publicMintCost, setPublicMintCost] = useState(0.15);

  const [priceInMatic, setPriceInMatic] = useState(0.0052);
  const [priceInComCo, stPriceInComCo] = useState(100)

  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { data: maxLimitData, refetch: getMaxLimitData } = useContractRead({...nftMaxLimitGetCall})
  const { data: totalSupplyData, refetch: getTotalSupplyData } = useContractRead({...nftTotalSupplyGetCall})
  //
  // const { data: maxSupplyData } = useContractRead({ ...maxSupplyCall })
  // const { data: totalMintedData } = useContractRead({ ...totalMintedCall })
  // const { data: maxMintPerWalletData } = useContractRead({ ...maxMintPerWalletCall })
  // const { data: publicMintCostData } = useContractRead({ ...publicMintCostCall })


  // Buy With ComCo
  const {config: buyByComCoConfig} = usePrepareContractWrite({
    ...nftBuyWithComCo,
    args: [
      count, address
    ]
  })

  const {write: buyByComCo, data: buyByComCoData} = useContractWrite(buyByComCoConfig)
  const {isLoading: IsBuyingWithComCo, isSuccess: BoughtWithComCo} = useWaitForTransaction({
    hash: buyByComCoData?.hash
  })

  // ComCo Approve
  const { config: comCoApproveConfig} = usePrepareContractWrite({
    ...comCoApproveCall,
    args: [ nftContractAddress, 1000000000000000
    ]
  })
  const { write: comCoApprove, data: comCoApproveData } = useContractWrite(comCoApproveConfig)
  const {isLoading: isApproving, isSuccess: isApproved} = useWaitForTransaction({
    hash: comCoApproveData?.hash
  })

  // Buy With Matic
  const {config: buyByMaticConfig} = usePrepareContractWrite({
    ...nftBuyWithMatic,
    args: [
      count, address,
      {
        value: ethers.utils.parseEther((priceInMatic * count).toString())
      }
    ]
  })
  const { write: buyByMatic, data: buyByMaticData} = useContractWrite(buyByMaticConfig)
  const {isLoading: IsBuyingWithMatic, isSuccess: BoughtWithMatic} = useWaitForTransaction({
    hash: buyByMaticData?.hash
  })

  useEffect(() => {
    if (isConnected) {
      if (maxLimitData) {
        setTotalSupply(maxLimitData.toString())
      }
      if (totalSupplyData) {
        setTotalMinted(totalSupplyData.toString())
      }
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await getMaxLimitData();
      await getTotalSupplyData();
    }

    fetch();
  }, [BoughtWithComCo, BoughtWithMatic])

  Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  }

  const decimalHandle = (val) => {
    const decimal = val.countDecimals();
    return Math.floor(val * Math.pow(10, decimal)) / Math.pow(10, decimal)
  }

  return (
    <>
      <MintModalStyleWrapper className="modal_overlay">
        <div className="mint_modal_box">
          <div className="mint_modal_content">
            <div className="modal_header">
              <h2>Collect YOUR NFT before end</h2>
              <button onClick={() => mintModalHandle()}>
                <FiX />
              </button>
            </div>
            <div className="modal_body text-center">
              <div className="mint_img">
                <img src={mintImg} alt="bithu nft mint" />
              </div>
              <div className="mint_count_list">
                <ul>
                  <li>
                    <h5>Remaining</h5>
                    <h5>
                      {totalSupply - totalMinted}/<span>{totalSupply}</span>
                    </h5>
                  </li>
                  <li>
                    <h5>Price</h5>
                    <h5>{priceInComCo} ComCo / {priceInMatic} Matic</h5>
                  </li>
                  <li>
                    <h5>Quantity</h5>
                    <div className="mint_quantity_sect">
                      {/*<button onClick={() => decreaseCount()}>-</button>*/}
                      <input
                        type="text"
                        id="quantity"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                      />
                      {/*<button onClick={() => increaseCount()}>+</button>*/}
                    </div>
                    {/*<h5>*/}
                    {/*  <span>{parseFloat(price).toFixed(3)}</span> */}
                    {/*</h5>*/}
                  </li>
                </ul>
              </div>
              <div className="mint_description">
                <p>Buy With ComCo</p>
                <p>Buy With Matic</p>
              </div>
              <div className="mint_price">
                <p>{decimalHandle(priceInComCo * count, 4)} ComCo</p>
                <p>{decimalHandle(priceInMatic * count, 4)} Matic</p>
              </div>
              <div className="modal_mint_btn">
                {isApproved && !isApproving ?
                    <Button lg variant="mint" onClick={() => buyByComCo()} disabled={IsBuyingWithComCo}>
                      Mint With ComCo
                    </Button> :
                    <Button lg variant="mint" onClick={() => comCoApprove()} disabled={isApproving}>
                      Approve ComCo
                    </Button>
                }
                <Button lg variant="mint" onClick={() => buyByMatic()} disabled={IsBuyingWithMatic}>
                  Mint With Matic
                </Button>
              </div>
            </div>

            <div className="modal_bottom_shape_wrap">
              <span className="modal_bottom_shape shape_left">
                <img src={hoverShape} alt="bithu nft hover shape" />
              </span>
              <span className="modal_bottom_shape shape_right">
                <img src={hoverShape} alt="bithu nft hover shape" />
              </span>
            </div>
          </div>
        </div>
      </MintModalStyleWrapper>
    </>
  );
};

export default MintNFTModal;
