import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import '../styles/Main.css'
import loadingGIF from '../assets/loading.gif'
import opensea from '../assets/opensea.png'
import etherscan from '../assets/etherscan.png'

export const Main = ({ askContractToMintNft }) => {

    const NFTData = async () => {
        const { nftImage, transaction, nftLink } = useContext(AppContext) 
        // currentAccount, isRinkeby, loading, complete, setLoading, setTransaction, setComplete

        return (
            <>
            <div className="render_box">
                <img src={nftImage} alt="nft"/>
            </div>

            <div className="link_box">
                <img className="logos" src={opensea} alt="logo"/> 
                <a href={nftLink} target="_blank" rel="noopener noreferrer nofollow">View on Opensea</a>
            </div>

            <div className="link_box">
                <img className="logos" src={etherscan} alt="logo"/> 
                <a href={transaction} target="_blank" rel="noopener noreferrer nofollow">View Transaction on Etherscan</a>
            </div>
            </>
        )
    }

    const mintButton = () => (
        <button onClick={() => {askContractToMintNft(setLoading, setTransaction, setComplete)}} className="mint_button" style={{ background: "rgba( 134, 233, 177, 0.25 )", boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}}>
            Mint
        </button>
    )

    const invalidChain = () => (
        <div className="nav_button" style={{ background: "rgba( 74, 144, 226, 0.25 )", boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}}>
            <span>Not Connected to Rinkeby</span>
        </div>
    )

    const invalidWallet = () => (
        <div className="nav_button" style={{ background: "rgba( 74, 144, 226, 0.25 )", boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}}>
            <span>Wallet Not Connected</span>
        </div>
    )

    const loadingImage = () => (
        <img style={{ height: "90px" }} src={loadingGIF} alt="Loading..."/>
    )

    return (
        <div className="main_container">
            <div className="main_box box1">
                <div className="info_box">
                    Mint your own ultra minimal NFT featuring select New York City neighborhoods. <br/> The city never sleeps.
                </div>
            </div>
            <div className="main_box box2">
                { loading ? loadingImage() : ""}

                { complete ? <NFTData/> : "" }

                { currentAccount === "" ? invalidWallet() : !isRinkeby ? invalidChain() : mintButton() }
            </div>
        </div>
    )
}