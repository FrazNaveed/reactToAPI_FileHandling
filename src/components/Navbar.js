import { React, useEffect, useState } from "react";
import "./navbar.css";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const isWalletConnected = () => {
    if (!window.ethereum) {
      return;
    }
    let address = window.ethereum.selectedAddress;
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
    setWalletAddress(address ? address.toString() : "");
  };
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Install metamask");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    connectWalletHandler();
  });

  return(
    <div className="navbar">
      
    </div>
   );
};

export default Navbar;
