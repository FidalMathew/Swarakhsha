import React from "react";

export interface Report {
  caseId: number;
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  timestamp: number;
  images: string[];
  severity: string;   // "high" | "medium" | "low"
  reportType: string;
  pincode: string;
  userAddress: string;
}

export interface SwarContextType {
  currentAccount: string;
  connectWallet: () => Promise<void>;
  backendURL: string;

  // Contract functions
  addUserToWhitelist: (userAddress: string) => Promise<void>;
  removeUserFromWhitelist: (userAddress: string) => Promise<void>;
  addReport: (
    caseId: number,
    latitude: string,
    longitude: string,
    title: string,
    description: string,
    images: string[],
    severity: string,
    reportType: string,
    pincode: string
  ) => Promise<void>;
  getReportsByUser: (userAddress: string) => Promise<Report[]>;
  getAllReports: () => Promise<Report[]>;
    whitelistAddress(): Promise<void>;

}

// Create context
export const SwarContext = React.createContext<
  SwarContextType | undefined
>(undefined);
