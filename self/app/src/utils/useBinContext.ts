import { useContext } from "react";
import { BinFinderContext } from "../context/BinFinderContext";

export const useBinFinder = () => {
  const ctx = useContext(BinFinderContext);
  if (!ctx) throw new Error("useBinFinder must be used inside BinFinderProvider");
  return ctx;
};