import '../styles/Navigation.css'
import fox from '../assets/metamask.png'
import ethereum from '../assets/ethcolor.png'
import caution from '../assets/caution.png'
import cube from '../assets/cube.png'

export const Navigation = ({ connectWallet, currentAccount, isRinkeby }) => {  

    const switchNetwork = async () => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
        });
    }
    
    // Render
    const connectWalletButton = () => (
        <button onClick={connectWallet} className="nav_button" style={{ background: "rgba( 74, 144, 226, 0.25 )", boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}}>
            <img className="icons" src={ethereum} alt="ethereum-logo"/> <span>Connect Wallet</span>
        </button>
    )

    const switchNetworkButton = () => (
        <button onClick={switchNetwork} className="nav_button" style={{ background: "rgba(255, 87, 87, 0.25)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", color: "pink" }}>
            <img className="icons" src={caution} alt="caution-logo"/> <span>Connect to Rinkeby Network</span>
        </button>
    )

    const currentWalletAccount = () => (
        <div className="nav_address">
            <img className="icons" src={fox} alt="metamask-fox"/> <span>{currentAccount}</span>
        </div>
    )

    return (
        <nav id="navigation">
            <div className="project_name"><span id="title">NFT Confidential</span> <img id="logo" src={cube} alt="logo"/></div>

            {currentAccount === "" ? connectWalletButton() : isRinkeby === false ? switchNetworkButton() : currentWalletAccount()}
        </nav>
    )
}