import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abi from "../utils/abi.json";
import { SwarContext } from "./swarContext";

// Add this global declaration for window.ethereum
declare global {
  interface EthereumProvider {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    on?(eventName: string, callback: (...args: unknown[]) => void): void;
    removeListener?(
      eventName: string,
      callback: (...args: unknown[]) => void
    ): void;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const SwarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const backendURL = "http://localhost:8080"; // Update with your backend URL

  const [chainId, setChainId] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [swarakshaContract, setSwarakshaContract] =
    useState<ethers.Contract | null>(null);

  const contractAddress = "0xf538d647b80B88d27597d60cA2B3deF0edC3ca3a";
  const contractABI = abi;
  const { ethereum } = window;

  useEffect(() => {
    const getContract = () => {
      const provider = new ethers.providers.Web3Provider(
        ethereum as ethers.providers.ExternalProvider
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setSwarakshaContract(contract);
    };
    if (ethereum && currentAccount) getContract();
  }, [ethereum, contractABI, currentAccount]);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (!ethereum) {
          console.log("Metamask not found");
          return;
        } else console.log("we have ethereum object");

        const accounts = (await ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          setCurrentAccount("");
          console.log("No authorized accounts found!");
        }

        const curr_chainId = await ethereum.request({ method: "eth_chainId" });
        setChainId(curr_chainId as string);

        if (ethereum && typeof ethereum.on === "function") {
          ethereum.on("chainChanged", handleChainChanged);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function handleChainChanged(_chainId: unknown) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, [currentAccount, contractABI, ethereum]);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentAccount) {
  //     // check if user is whitelisted
  //     console.log("User is connected:", currentAccount);
  //     navigate("/");
  //   } else {
  //     // navigate to connect wallet page
  //     // window.location.href = "/connect";
  //     navigate("/connect");
  //   }
  // }, [currentAccount, navigate]);

  const switchNetwork = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaef3" }], // celo alfajores chainId
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chainId !== "0xaef3") {
      switchNetwork();
    }
  }, [chainId, currentAccount]);

  // ========================
  // CONTRACT FUNCTIONS
  // ========================

  const addUserToWhitelist = async (userAddress: string) => {
    if (!swarakshaContract) return;
    try {
      const tx = await swarakshaContract.addUserToWhitelist(userAddress);
      await tx.wait();
      console.log("User added to whitelist:", userAddress);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const removeUserFromWhitelist = async (userAddress: string) => {
    if (!swarakshaContract) return;
    try {
      const tx = await swarakshaContract.removeUserFromWhitelist(userAddress);
      await tx.wait();
      console.log("User removed from whitelist:", userAddress);
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  const addReport = async (
    caseId: number,
    latitude: string,
    longitude: string,
    title: string,
    description: string,
    images: string[],
    severity: string,
    reportType: string,
    pincode: string
  ) => {
    if (!swarakshaContract) return;
    try {
      const tx = await swarakshaContract.addReport(
        caseId,
        latitude,
        longitude,
        title,
        description,
        images,
        severity,
        reportType,
        pincode
      );
      await tx.wait();
      console.log("Report added successfully");
    } catch (err) {
      console.error("Error adding report:", err);
    }
  };

  const getReportsByUser = async (userAddress: string) => {
    if (!swarakshaContract) return [];
    try {
      const reports = await swarakshaContract.getReportsByUser(userAddress);
      console.log("Reports by user:", reports);
      return reports;
    } catch (err) {
      console.error("Error fetching reports by user:", err);
      return [];
    }
  };

  const getAllReports = async () => {
    if (!swarakshaContract) return [];
    try {
      const reports = await swarakshaContract.getAllReports();
      console.log("All reports:", reports);
      return reports;
    } catch (err) {
      console.error("Error fetching all reports:", err);
      return [];
    }
  };

  return (
    <SwarContext.Provider
      value={{
        currentAccount,
        connectWallet,
        backendURL,
        addUserToWhitelist,
        removeUserFromWhitelist,
        addReport,
        getReportsByUser,
        getAllReports,
      }}
    >
      {children}
    </SwarContext.Provider>
  );
};
