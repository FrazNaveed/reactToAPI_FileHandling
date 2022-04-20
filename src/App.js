import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import Dropzone from "react-dropzone";
import { ethers } from "ethers";
import abi from "./abi.json";

function App() {


  const [selectedFile, setSelectedFile] = useState(null);
  const [mintMessage, setMintMessage] = useState("");
  const [mintMessageState, setMintMessageState] = useState("success");

  const [walletAddress, setWalletAddress] = useState("");
  const [mintTitle, setMintTitle] = useState("");
  const [mintPrice, setMintPrice] = useState(0);
  const [dexcription, setDexcription] = useState("");
  const [mintCategory, setMintCategory] = useState("");

  const mintNFT = async (e) => {
    e.preventDefault();
    const { ethereum } = window;
    // const accounts = await ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    setWalletAddress("0xbD9D4a71B76C494958d9D258A1e3d4c0801495e0");
    if (
      mintTitle == "" ||
      mintPrice == 0 ||
      mintPrice == "" ||
      mintCategory == "" ||
      dexcription == "" || 
      selectedFile.length === 0
    ) {
      setMintMessage(
        "One of the required fields were left empty. Please try again"
      );
      setMintMessageState("error");
      return;
    }

    // const formData = {
    //   msgsender: walletAddress,
    //   title: mintTitle,
    //   price: mintPrice,
    //   category: mintCategory,
    //   description: dexcription,
    // }
    const formData = new FormData();
    formData.append("msgsender", walletAddress);
    formData.append("title", mintTitle);
    formData.append("price", mintPrice);
    formData.append("category", mintCategory);
    formData.append("media", selectedFile[0]);
    formData.append("description", dexcription);
    setMintMessage("Contacting gateway to craft transaction...");
    setMintMessageState("info");
    console.log(formData);
    const response = await axios.post(
      `http://localhost:3000/mintNFT`,

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 200) {
      setMintMessage("Sending transaction to network...");
      setMintMessageState("info");
      var params = [
        {
          from: walletAddress,
          ...response.data.signRequired,
        },
      ];
      const signed = await window.ethereum.request({
        method: "eth_sendTransaction",
        params,
      });
      // setMintMessage(
      //   "Transaction successfully sent, <a href='https://ropsten.etherscan.io/tx/" +
      //     signed +
      //     "' target='_blank'>view on etherescan</a>"
      // );
      setMintMessageState("success");
    } else {
      setMintMessage(response.data.error);
      setMintMessageState("error");
    }
  };

  const onDrop = (acceptedFile) => {
    if (acceptedFile.length == 0) {
      alert("File size must be less than 12mb");
    } else {
      setSelectedFile(acceptedFile);
      console.log(acceptedFile);
    }
  };

  const maxSize = 12000000;

  return (
    <div className="App">
      <Navbar />
      <form>
        <Dropzone onDrop={onDrop} accept="video/*" maxSize={maxSize}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
            // const isFileTooLarge =  rejectedFiles[0].size > maxSize;
            return (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {!isDragActive && "Click here or drop a file to upload!"}
                {isDragActive && !isDragReject && "Drop it!"}
                {isDragReject && "File type not accepted, sorry!"}
              </div>
            );
          }}
        </Dropzone>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => {
            setMintTitle(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="price"
          onChange={(e) => {
            setMintPrice(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="description"
          onChange={(e) => {
            setDexcription(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="category"
          onChange={(e) => {
            setMintCategory(e.target.value);
          }}
        />

        <button type="submit" onClick={mintNFT}>
          GO!
        </button>
      </form>
    </div>
  );
}

export default App;
