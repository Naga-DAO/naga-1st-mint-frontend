import Web3 from 'web3'

const blockchainNetworkConfig = {
  chainId: Web3.utils.toHex(137),
  chainName: 'Polygon',
  nativeCurrency: {
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC'
  },
  rpcUrls: ['https://rpc-mainnet.matic.network'],
  blockExplorerUrls: ['https://polygonscan.com']
}

async function addBlockchainNetwork () {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [blockchainNetworkConfig]
    })

    return true
  } catch (error) {
    return false
  }
}

export {
  addBlockchainNetwork
}
