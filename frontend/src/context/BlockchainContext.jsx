import React, { createContext, useContext, useState, useEffect } from 'react';
import web3 from '../web3';
import Admin from '../contracts/Admin.json';
import StudentFactory from '../contracts/StudentFactory.json';
import TeacherFactory from '../contracts/TeacherFactory.json';
import ResultContract from '../contracts/ResultContract.json';

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [account, setAccount] = useState(localStorage.getItem('account') || '');
    const [adminContract, setAdminContract] = useState(null);
    const [studentFactoryContract, setStudentFactoryContract] = useState(null);
    const [teacherFactoryContract, setTeacherFactoryContract] = useState(null);
    const [resultContract, setResultContract] = useState(null);
    const [networkError, setNetworkError] = useState("");
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadBlockchainData = async () => {
            setLoading(true);
            try {
                const accounts = await web3.eth.getAccounts();
                console.log("Account:", accounts[0]);

                const networkId = await web3.eth.net.getId();
                console.log("Network ID:", networkId);

                const adminNetworkData = Admin.networks[networkId];
                const studentFactoryNetworkData = StudentFactory.networks[networkId];
                const teacherFactoryNetworkData = TeacherFactory.networks[networkId];
                const resultNetworkData = ResultContract.networks[networkId];

                if (adminNetworkData && studentFactoryNetworkData && teacherFactoryNetworkData && resultNetworkData) {
                    const adminContractInstance = new web3.eth.Contract(Admin.abi, adminNetworkData.address);
                    const studentFactoryContractInstance = new web3.eth.Contract(StudentFactory.abi, studentFactoryNetworkData.address);
                    const teacherFactoryContractInstance = new web3.eth.Contract(TeacherFactory.abi, teacherFactoryNetworkData.address);
                    const resultContractInstance = new web3.eth.Contract(ResultContract.abi, resultNetworkData.address);

                    setAdminContract(adminContractInstance);
                    setStudentFactoryContract(studentFactoryContractInstance);
                    setTeacherFactoryContract(teacherFactoryContractInstance);
                    setResultContract(resultContractInstance);
                } else {
                    throw new Error("Smart contract not deployed to detected network.");
                }
            } catch (error) {
                console.error("Error loading blockchain data:", error);
                setNetworkError("Could not connect to blockchain.");
            } finally {
                setLoading(false);
            }
        };

        loadBlockchainData();
    }, []);

    const logout = () => {
        setRole('');
        setAccount('');
        localStorage.removeItem('role');
        localStorage.removeItem('account');
    };

    return (
        <BlockchainContext.Provider value={{
            account,
            setAccount,
            adminContract,
            setAdminContract,
            studentFactoryContract,
            setStudentFactoryContract,
            teacherFactoryContract,
            setTeacherFactoryContract,
            resultContract,
            setResultContract,
            loading,
            setLoading,
            networkError,
            setNetworkError,
            role,
            setRole,
            logout
        }}>
            {children}
        </BlockchainContext.Provider>
    );
};
