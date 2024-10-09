import React, { createContext, useContext, useState } from 'react';

const IpfsContext = createContext();

export const useIpfs = () => useContext(IpfsContext);

export const IpfsProvider = ({ children }) => {
    // Correct useState declaration
    const [photoHash, setPhotoHash] = useState("");  // Destructure correctly
    const [resultHash, setResultHash] = useState("");
    
    return (
        <IpfsContext.Provider value={{ photoHash, setPhotoHash,resultHash, setResultHash }}>
            {children}
        </IpfsContext.Provider>
    );
};
