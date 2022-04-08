import { createContext, useState } from 'react';

export const AppContext = createContext()

export const AppContextProvider = props => {
    const [loading, setLoading] = useState(false);
    const [isRinkeby, setIsRinkeby] = useState(false)
    const [transaction, setTransaction] = useState("")
    const [nftImage, setNftImage] = useState("")
    const [nftLink, setNftLink] = useState("")
    const [complete, setComplete] = useState(false)

    return (
        <AppContext.Provider 
            value={{ loading, setLoading, isRinkeby, setIsRinkeby, transaction, setTransaction, nftImage, setNftImage, nftLink, setNftLink, complete, setComplete }}>
            {props.children}
        </AppContext.Provider>
    )
}