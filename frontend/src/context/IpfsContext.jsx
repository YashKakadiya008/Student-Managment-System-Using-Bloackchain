import React, { createContext, useContext, useState } from 'react';

const IpfsContext = createContext();

export const useIpfs = () => useContext(IpfsContext);

export const IpfsProvider = ({ children }) => {
    const [photoHash, setPhotoHash] = useState("");
    const [resultHash, setResultHash] = useState("");

    return (
        <IpfsContext.Provider value={{ photoHash, setPhotoHash, resultHash, setResultHash }}>
            {children}
        </IpfsContext.Provider>
    );
};
