import React from "react";
import { FaLaptop } from "react-icons/fa";
import {
  FiPrinter,
  FiServer,
  FiCheck,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiFileText,
  FiShoppingCart,
  FiTool,
  FiCpu,
} from "react-icons/fi";

const MAP = {
  laptop: FaLaptop,
  printer: FiPrinter,
  server: FiServer,
  check: FiCheck,
  search: FiSearch,
  pencil: FiEdit3,
  trash: FiTrash2,
  invoice: FiFileText,
  shopping: FiShoppingCart,
  wrench: FiTool,
  cpu: FiCpu,
};

export function Icon({ name, className = "w-4 h-4 text-current" }) {
  const Comp = MAP[name] || FaLaptop;
  return <Comp className={className} />;
}

export default Icon;
