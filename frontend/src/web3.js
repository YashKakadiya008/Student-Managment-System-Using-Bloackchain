import Web3 from "web3";

let web3;

// if (window.ethereum) {
//   web3 = new Web3(window.ethereum);
// } else {
  web3 = new Web3("http://127.0.0.1:8545");
// }

export default web3;
