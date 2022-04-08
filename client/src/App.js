import React, { useEffect, useState, useContext } from "react";
import { AppContext } from './Context/AppContext';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json'
import { Navigation } from './Components/Navigation';
import opensea from './assets/opensea.png'
import etherscan from './assets/etherscan.png'
import nftLoading from './assets/nftloading.gif'
import './styles/App.css'
import './styles/Main.css'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const { loading, setLoading, isRinkeby, setIsRinkeby, nftLink, setNftLink, nftImage, setNftImage, transaction, setTransaction, complete, setComplete } = useContext(AppContext)
  const contractAddress = "0x7908aCaCb3137a03A95e4B74aDFDFA0f5C677707"

  const { ethereum } = window

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    walletIsConnected()
    connectedToRinkeby()
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    ethereum.on('accountsChanged', () => {window.location.reload()})
  }, [ethereum])

  // Check if wallet is connected
  const walletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have Metamask!');
      return;
    } else {
      console.log("All sysyems go.");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      // console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener(setNftLink, setNftImage)
    } else {
      console.log("No authorized account found.")
    }
  }

  // Connect to Wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

    } catch (error) {
      console.log(error)
    }
  }

  // Check if the wallet is connected to Rinkeby Network
  const connectedToRinkeby = async () => {
    const { ethereum } = window;

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    // console.log("Connected to chain " + chainId);

    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      setIsRinkeby(false)
    } else {
      setIsRinkeby(true)
    }
  }

  // Mint NFT
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      setComplete(false)

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setLoading(true);

        console.log("Mining...")
        await nftTxn.wait();
        
        setTransaction(`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
        setLoading(false)
        setComplete(true)

      } else {
        console.log("Ethereum object doesn't exist!");
      }
      
      } catch (error) {
        console.log(error)
    }
  }

  const setupEventListener = () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", async (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          const id = tokenId.toNumber();

          let attempts = 7

          const getOpenSeaData = async () => {
            const response = await fetch(`https://testnets-api.opensea.io/api/v1/asset/rinkeby/${contractAddress}/${id}/validate?format=json`)
            const data = await response.json();
            const json = window.atob(data.token_uri.slice(29));
            const result = JSON.parse(json);
            setNftImage(result.image)
            setNftLink(`https://testnets.opensea.io/assets/${contractAddress}/${id}`)
          }

          while (attempts) {
            try {
              await getOpenSeaData();
              break;
            } catch (error) {
              console.log(error)
              attempts -= 1
              console.log(`Trying to display NFT information. Attempts left: ${attempts}`);
              await new Promise(() => setTimeout(getOpenSeaData, 5000))
            }
          }

        });

        // console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const NFTData = () => {
    const showNFT = () => (
      <img src={nftImage} alt="nft"/>
    )

    const waitForNFT = () => (
      <img id="loading" src={nftLoading} alt="nft"/>
    )

    return (
      <div className="mint_container">
        <div className="render_box">
          { nftImage ? showNFT() : waitForNFT() } 
        </div>

        <div className="link_box">
          <img className="logos" src={opensea} alt="logo"/> 
          <a href={nftLink} target="_blank" rel="noopener noreferrer nofollow">View on Opensea</a>
        </div>

        <div className="link_box">
          <img className="logos" src={etherscan} alt="logo"/> 
          <a href={transaction} target="_blank" rel="noopener noreferrer nofollow">View Transaction on Etherscan</a>
        </div>
      </div>
    )
  }

  // Button Renders
  const mintButton = () => (
    <button onClick={() => {askContractToMintNft()}} className="mint_button">
      { loading ? "Minting..." : complete ? "Success...mint another?" : "Mint" }
    </button>
  )

  const invalidChain = () => (
    <div className="nav_button" style={{ background: "yellow", color: "black" }}>
      <span>Not Connected to Rinkeby</span>
    </div>
  )

  const invalidWallet = () => (
    <div className="nav_button" style={{ background: "lightcoral", color: "black" }}>
      <span>Wallet Not Connected</span>
    </div>
  )

  // Loading GIF
  const loadingImage = () => (
    <img style={{ height: "90px" }} src={nftLoading} alt="Loading..."/>
  )

  return (
    <div className="App">
      <Navigation 
        connectWallet={connectWallet} 
        currentAccount={currentAccount} 
        isRinkeby={isRinkeby}
      />

      <div className="main_container">
        <div className="main_box box1">
          <div className="info_box">
            Mint your own ultra minimal NFT. <br/> Add some simplicity to your collection.
          </div>
        </div>
        <div className="main_box box2">
          { loading ? loadingImage() : ""}

          { complete ? <NFTData/> : "" }

          { currentAccount === "" ? invalidWallet() : !isRinkeby ? invalidChain() : mintButton() }
        </div>
      </div>
    </div>
  );
};

export default App;