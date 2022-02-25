import Image from 'next/image';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useEffect, useState, useRef } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';

function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      alert('Change the network to Rinkeby');
      throw new Error('Change network to Rinkeby');
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await whitelistContract.addAddressToWhiteList();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);
      const _numOfWhiteListed = await whitelistContract.numOfWhiteListedAddress();
      setNumberOfWhitelisted(_numOfWhiteListed);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      console.log(address, whitelistContract);
      const _joinedWhitelist = await whitelistContract.whiteListedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div className="">Thanks for joining the Whitelist!</div>;
      } else if (loading) {
        return <button>Loading...</button>;
      } else {
        return (
          <button
            className="bg-blue-500 py-2 px-5 rounded transition hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 shadow-sm text-gray-50"
            onClick={addAddressToWhitelist}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button
          className="bg-blue-500 py-2 px-5 rounded transition hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 shadow-sm text-gray-50 "
          onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        cacheProvider: true
        // disableInjectedProvider: false
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="w-4/5 m-auto flex justify-between items-center flex-col md:flex-row">
        <div className="">
          <h1 className="text-gray-800 font-bold text-3xl md:text-4xl font-roboto">
            Welcome To Crypto Devs
          </h1>
          <p className="text-gray-400  my-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt cupiditate aut nemo nobis,
            iure tempore qui illum ex? Consequatur sequi nesciunt in tenetur illo cupiditate
            assumenda. Beatae maxime vitae deserunt. <br />
            {numberOfWhitelisted} have already joined the Whitelist
          </p>
          {renderButton()}
        </div>
        <div className="">
          <Image src="/crypto-devs.svg" height={1400} width={1400} />
        </div>
      </div>
    </div>
  );
}
export default Home;
