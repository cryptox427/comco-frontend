import { useState } from "react";
import { useModal } from "../../../utils/ModalContext";
import { FiX } from "react-icons/fi";
import Button from "../../button";
import MintTokenStyleWrapper from "./MintToken.style";
import mintImg from "../../../assets/images/icon/mint-img.png";
import hoverShape from "../../../assets/images/icon/hov_shape_L.svg";
import {db} from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore'

import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useEnsName
} from 'wagmi';
import { useEffect } from "react";
import {
    usdtApproveCall,
    comCoBuyByUSDTCall,
    comCoBuyByMaticCall,
  usdtBalaceGetCall
} from "../../../contract/config";
import { ethers } from "ethers";

const salesContractAddress = "0x78B16979a279DED296e409C550Aff4c5a0DDDd28";
const priceUSDT = 0.0000572;
const priceMatic = 0.0000052

const MintTokenModal = () => {
  let [count, setCount] = useState(1);
  let [price, setPrice] = useState("0.001");
  const { tokenMintModalHandle } = useModal();

  const [totalSupply, setTotalSupply] = useState(437000000);
  const [totalMinted, setTotalMinted] = useState(4583);
  const [remainingItem, setRemainingItem] = useState(4583);
  const [publicMintCost, setPublicMintCost] = useState(0.15);
  const [priceInUSDT, setPriceInUSDT] = useState(0.0000572);
  const [priceInMatic, setPriceInMatic] = useState(0.000052);

  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { chain } = useNetwork();

  // Get USDT balance
  const { data: usdtBalance } = useContractRead({...usdtBalaceGetCall});

  // Buy With USDT
  const {config: buyByUSDTConfig} = usePrepareContractWrite({
    ...comCoBuyByUSDTCall,
    args: [
        ethers.utils.parseUnits(count.toString(), 8)
    ]
  })

  const {write: buyByUSDT, data: buyByUSDTData} = useContractWrite(buyByUSDTConfig)
  const {isLoading: IsBuyingWithUSDT} = useWaitForTransaction({
    hash: buyByUSDTData?.hash
  })

  // USDT Approve
  const { config: usdtApproveConfig} = usePrepareContractWrite({
    ...usdtApproveCall,
    args: [ salesContractAddress, 1000000000000000
    ]
  })
  const { write: usdtApprove, data: usdtApproveData } = useContractWrite(usdtApproveConfig)
  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: usdtApproveData?.hash
  })

  // Buy With Matic
  const {config: buyByMaticConfig} = usePrepareContractWrite({
    ...comCoBuyByMaticCall,
    args: [
        ethers.utils.parseUnits(count.toString(), 8),
      {
        value: ethers.utils.parseEther((priceInMatic * count).toString())
      }
    ]
  })
  const { write: buyByMatic, data: buyByMaticData} = useContractWrite(buyByMaticConfig)
  const {isLoading: IsBuyingWithMatic} = useWaitForTransaction({
    hash: buyByMaticData?.hash
  })


  const setAmountHandler = (val) => {
    setCount(val);
    // setPriceInUSDT(Math.floor((priceUSDT * val) * 1000000) / 1000000);
    // setPriceInMatic(Math.floor(priceMatic * val * 1000000) / 1000000);
  }

  const saveFirebase = async () => {
    try {
      await addDoc(collection(db, 'comco'), {
        address: address,
        network: chain.id
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('approvl success');
      saveFirebase()
    }
  }, [isSuccess])

  Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  }

  const decimalHandle = (val) => {
    try {
      const decimal = val.countDecimals();
      return Math.floor(val * Math.pow(10, decimal)) / Math.pow(10, decimal)
    } catch (e) {
      return val
    }

  }


  return (
    <>
      <MintTokenStyleWrapper className="modal_overlay">
        <div className="mint_modal_box">
          <div className="mint_modal_content">
            <div className="modal_header">
              <h2>Buy Comedy Coin</h2>
              <button onClick={() => tokenMintModalHandle()}>
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
                    <h5>Total Sale</h5>
                    <h5>
                      <span>{totalSupply}</span>
                    </h5>
                  </li>
                  <li>
                    <h5>Price</h5>
                    <h5>{priceInUSDT} USDT / {priceInMatic} Matic</h5>
                  </li>t
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
                    {/*  <span>{parseFloat(price).toFixed(3)}</span> ETH*/}
                    {/*</h5>*/}
                  </li>
                </ul>
              </div>
              <div className="mint_description">
                <p>Buy With USDT</p>
                <p>Buy With Matic</p>
              </div>
              <div className="mint_price">
                {/*<p>{priceInUSDT * count} USDT</p>*/}
                {/*<p>{priceInMatic * count} Matic</p>*/}
                <p>{decimalHandle(priceInUSDT * count, 7)} USDT</p>
                <p>{decimalHandle(priceInMatic * count, 6)} Matic</p>
              </div>
              <div className="modal_mint_btn">
                {isSuccess && !isLoading ?
                    <Button lg variant="mint" onClick={() => buyByUSDT?.()} disabled={IsBuyingWithUSDT}>
                  Buy With USDT
                </Button>:
                    <Button lg variant="mint" onClick={() => usdtApprove?.()} disabled={isLoading}>
                      Approve USDT
                    </Button>}
                <Button lg variant="mint" onClick={() => buyByMatic()} disabled={IsBuyingWithMatic}>
                  Buy With Matic
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
      </MintTokenStyleWrapper>
    </>
  );
};

export default MintTokenModal;
