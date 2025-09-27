"use client";

import { ethers, JsonRpcProvider, Wallet } from "ethers";
// import { useRouter } from "next/navigation";
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
  const backendURL = "http://localhost:8080";
  // const router = useRouter();

  // const [mounted, setMounted] = useState(false);
  const [chainId, setChainId] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [swarakshaContract, setSwarakshaContract] =
    useState<ethers.Contract | null>(null);

  const contractAddress = "0xf538d647b80B88d27597d60cA2B3deF0edC3ca3a";
  const contractABI = abi;

  const { ethereum } = window;

  // -------------------------
  // Track client mount
  // -------------------------
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // // -------------------------
  // // Redirect if no wallet connected
  // // -------------------------
  // useEffect(() => {
  //   if (!mounted) return;
  //   if (currentAccount) {
  //     router.push("/");
  //   }
  // }, [mounted, currentAccount, router]);

  // -------------------------
  // Initialize contract
  // -------------------------
  useEffect(() => {
    const initContract = async () => {
      if (!ethereum || !currentAccount) return;

      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setSwarakshaContract(contract);
      } catch (err) {
        console.error("Contract init error:", err);
      }
    };

    initContract();
  }, [ethereum, contractABI, currentAccount]);

  const whitelistAddress = async () => {
    // Check env variables
    if (!process.env.NEXT_APP_RPC_URL || !process.env.NEXT_APP_PRIVATE_KEY) {
      throw new Error("RPC URL or private key is missing in env");
    }

    // Provider + wallet
    const provider = new JsonRpcProvider(process.env.NEXT_APP_RPC_URL);
    const wallet = new Wallet(process.env.NEXT_APP_PRIVATE_KEY, provider);

    // Contract instance
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
      // Make sure currentAccount is a valid Ethereum address
      if (!ethers.isAddress(currentAccount)) {
        throw new Error("Invalid Ethereum address provided");
      }

      const tx = await contract.addUserToWhitelist(currentAccount);
      const receipt = await tx.wait(); // waits for 1 confirmation
      console.log("Address whitelisted, tx hash:", receipt.transactionHash);
    } catch (err) {
      console.error("Whitelist error:", err);
    }
  };

  // -------------------------
  // Wallet check on load
  // -------------------------
  useEffect(() => {
    const checkWallet = async () => {
      if (!ethereum) {
        console.log("MetaMask not found");
        return;
      }

      try {
        const accounts = (await ethereum.request({
          method: "eth_accounts",
        })) as string[];
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
        else setCurrentAccount("");

        console.log("wallet check accounts:", accounts);

        const chain = (await ethereum.request({
          method: "eth_chainId",
        })) as string;
        setChainId(chain);

        if (currentAccount == "") {
          // router.push("/connect");
        } else {
          // check if address is whitelisted,
          // if yes, router.push("/");
          // else self-login
        }

        // Listen for chain changes
        if (ethereum.on) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const handleChainChanged = (_chainId: unknown) =>
            window.location.reload();
          ethereum.on("chainChanged", handleChainChanged);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkWallet();
  }, [ethereum]);

  // -------------------------
  // Connect wallet function
  // -------------------------
  const connectWallet = async () => {
    if (!ethereum) return alert("Install MetaMask!");
    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // Switch network to Celo Alfajores
  // -------------------------
  const switchNetwork = async () => {
    if (!ethereum) return;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaef3" }], // Celo Alfajores
      });
    } catch (err) {
      console.error("Network switch error:", err);
    }
  };

  useEffect(() => {
    if (chainId !== "0xaef3" && currentAccount) switchNetwork();
  }, [chainId, currentAccount]);

  // -------------------------
  // CONTRACT FUNCTIONS
  // -------------------------
  const addUserToWhitelist = async (userAddress: string) => {
    if (!swarakshaContract) return;
    try {
      const tx = await swarakshaContract.addUserToWhitelist(userAddress);
      await tx.wait();
      console.log("User added:", userAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const removeUserFromWhitelist = async (userAddress: string) => {
    if (!swarakshaContract) return;
    try {
      const tx = await swarakshaContract.removeUserFromWhitelist(userAddress);
      await tx.wait();
      console.log("User removed:", userAddress);
    } catch (err) {
      console.error(err);
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
      console.log("Report added");
    } catch (err) {
      console.error(err);
    }
  };

  const getReportsByUser = async (userAddress: string) => {
    if (!swarakshaContract) return [];
    try {
      const reports = await swarakshaContract.getReportsByUser(userAddress);
      return reports;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getAllReports = async () => {
    if (!swarakshaContract) return [];
    try {
      const reports = await swarakshaContract.getAllReports();
      return reports;
    } catch (err) {
      console.error(err);
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
        whitelistAddress,
      }}
    >
      {children}
    </SwarContext.Provider>
  );
};
