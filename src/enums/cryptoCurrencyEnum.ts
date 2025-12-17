export enum CryptoCurrency {
  ONEINCH = '1inch', // 1inch
  AAVE = 'aave', // Aave
  ADA = 'ada', // Cardano
  AGIX = 'agix', // SingularityNET
  AKT = 'akt', // Akash Network
  ALGO = 'algo', // Algorand
  AMP = 'amp', // Amp
  APE = 'ape', // ApeCoin
  APT = 'apt', // Aptos
  AR = 'ar', // Arweave
  ARB = 'arb', // Arbitrum
  ATOM = 'atom', // Cosmos
  AVAX = 'avax', // Avalanche
  AXS = 'axs', // Axie Infinity
  BAKE = 'bake', // BakeryToken
  BAT = 'bat', // Basic Attention Token
  BCH = 'bch', // Bitcoin Cash
  BNB = 'bnb', // Binance Coin
  BSV = 'bsv', // Bitcoin SV
  BSW = 'bsw', // Biswap
  BTC = 'btc', // Bitcoin
  BTCB = 'btcb', // Bitcoin BEP2
  BTG = 'btg', // Bitcoin Gold
  BTT = 'btt', // BitTorrent
  BUSD = 'busd', // Binance USD
  CAKE = 'cake', // PancakeSwap
  CELO = 'celo', // Celo
  CFX = 'cfx', // Conflux
  CHZ = 'chz', // Chiliz
  COMP = 'comp', // Compound
  CRO = 'cro', // Crypto.com Chain
  CRV = 'crv', // Curve DAO Token
  CSPR = 'cspr', // Casper
  CVX = 'cvx', // Convex Finance
  DAI = 'dai', // DAI
  DASH = 'dash', // Digital Cash
  DCR = 'dcr', // Decred
  DFI = 'dfi', // DfiStarter
  DOGE = 'doge', // Dogecoin
  DOT = 'dot', // Polkadot
  DYDX = 'dydx', // dYdX
  EGLD = 'egld', // Elrond
  ENJ = 'enj', // Enjin Coin
  EOS = 'eos', // EOS
  ETC = 'etc', // Ethereum Classic
  ETH = 'eth', // Ethereum
  FEI = 'fei', // Fei USD
  FIL = 'fil', // Filecoin
  FLOW = 'flow', // Flow
  FLR = 'flr', // FLARE
  FRAX = 'frax', // Frax
  FTT = 'ftt', // FarmaTrust
  GALA = 'gala', // Gala
  GNO = 'gno', // Gnosis
  GRT = 'grt', // The Graph
  GT = 'gt', // GateToken
  GUSD = 'gusd', // Gemini US Dollar
  HBAR = 'hbar', // Hedera
  HNT = 'hnt', // Helium
  HOT = 'hot', // Hydro Protocol
  HT = 'ht', // Huobi Token
  ICP = 'icp', // Internet Computer
  IMX = 'imx', // Immutable X
  INJ = 'inj', // Injective
  KAVA = 'kava', // Kava
  KCS = 'kcs', // Kucoin
  KDA = 'kda', // Kadena
  KLAY = 'klay', // Klaytn
  KNC = 'knc', // Kyber Network Crystals
  KSM = 'ksm', // Kusama
  LDO = 'ldo', // Lido DAO Token
  LEO = 'leo', // LEOcoin
  LINK = 'link', // Chainlink
  LRC = 'lrc', // Loopring
  LTC = 'ltc', // Litecoin
  LUNA = 'luna', // Terra
  MANA = 'mana', // Mana Coin Decentraland
  MBX = 'mbx', // MobieCoin
  MINA = 'mina', // Mina
  MKR = 'mkr', // Maker
  NEAR = 'near', // NEAR Protocol
  NEO = 'neo', // NEO
  NEXO = 'nexo', // NEXO
  NFT = 'nft', // NFT
  OKB = 'okb', // Okex
  ONE = 'one', // Menlo One
  OP = 'op', // Optimism
  PAXG = 'paxg', // PAX Gold
  QNT = 'qnt', // Quant
  QTUM = 'qtum', // QTUM
  RPL = 'rpl', // Rocket Pool
  RUNE = 'rune', // THORChain (ERC20)
  RVN = 'rvn', // Ravencoin
  SAND = 'sand', // The Sandbox
  SHIB = 'shib', // Shiba Inu
  SNX = 'snx', // Synthetix Network
  SOL = 'sol', // Solana
  SUI = 'sui', // Sui
  STX = 'stx', // Stacks
  SUSHI = 'sushi', // SushiSwap (if needed, add)
  TRX = 'trx', // TRON
  TUSD = 'tusd', // True USD
  TWT = 'twt', // Trust Wallet Token
  UNI = 'uni', // Uniswap
  USDC = 'usdc', // USDC
  USDT = 'usdt', // Tether
  WBTC = 'wbtc', // Wrapped Bitcoin (if needed)
  WAVES = 'waves', // Waves
  WEMIX = 'wemix', // WEMIX
  WOO = 'woo', // WOO Network
  XAG = 'xag', // Silver Ounce
  XAU = 'xau', // Gold Ounce
  XAUT = 'xaut', // Tether Gold
  XLM = 'xlm', // Stellar Lumen
  XMR = 'xmr', // Monero
  XRP = 'xrp', // Ripple
  XTZ = 'xtz', // Tezos
  YFI = 'yfi', // Yearn Finance (if needed)
  ZEC = 'zec', // ZCash
  ZIL = 'zil', // Zilliqa
}

export const cryptoCurrencyNames: Record<CryptoCurrency, string> = {
  [CryptoCurrency.ONEINCH]: '1inch',
  [CryptoCurrency.AAVE]: 'Aave',
  [CryptoCurrency.ADA]: 'Cardano',
  [CryptoCurrency.AGIX]: 'SingularityNET',
  [CryptoCurrency.AKT]: 'Akash Network',
  [CryptoCurrency.ALGO]: 'Algorand',
  [CryptoCurrency.AMP]: 'Amp',
  [CryptoCurrency.APE]: 'ApeCoin',
  [CryptoCurrency.APT]: 'Aptos',
  [CryptoCurrency.AR]: 'Arweave',
  [CryptoCurrency.ARB]: 'Arbitrum',
  [CryptoCurrency.ATOM]: 'Cosmos',
  [CryptoCurrency.AVAX]: 'Avalanche',
  [CryptoCurrency.AXS]: 'Axie Infinity',
  [CryptoCurrency.BAKE]: 'BakeryToken',
  [CryptoCurrency.BAT]: 'Basic Attention Token',
  [CryptoCurrency.BCH]: 'Bitcoin Cash',
  [CryptoCurrency.BNB]: 'Binance Coin',
  [CryptoCurrency.BSV]: 'Bitcoin SV',
  [CryptoCurrency.BSW]: 'Biswap',
  [CryptoCurrency.BTC]: 'Bitcoin',
  [CryptoCurrency.BTCB]: 'Bitcoin BEP2',
  [CryptoCurrency.BTG]: 'Bitcoin Gold',
  [CryptoCurrency.BTT]: 'BitTorrent',
  [CryptoCurrency.BUSD]: 'Binance USD',
  [CryptoCurrency.CAKE]: 'PancakeSwap',
  [CryptoCurrency.CELO]: 'Celo',
  [CryptoCurrency.CFX]: 'Conflux',
  [CryptoCurrency.CHZ]: 'Chiliz',
  [CryptoCurrency.COMP]: 'Compound',
  [CryptoCurrency.CRO]: 'Crypto.com Chain',
  [CryptoCurrency.CRV]: 'Curve DAO Token',
  [CryptoCurrency.CSPR]: 'Casper',
  [CryptoCurrency.CVX]: 'Convex Finance',
  [CryptoCurrency.DAI]: 'DAI',
  [CryptoCurrency.DASH]: 'Digital Cash',
  [CryptoCurrency.DCR]: 'Decred',
  [CryptoCurrency.DFI]: 'DfiStarter',
  [CryptoCurrency.DOGE]: 'Dogecoin',
  [CryptoCurrency.DOT]: 'Polkadot',
  [CryptoCurrency.DYDX]: 'dYdX',
  [CryptoCurrency.EGLD]: 'Elrond',
  [CryptoCurrency.ENJ]: 'Enjin Coin',
  [CryptoCurrency.EOS]: 'EOS',
  [CryptoCurrency.ETC]: 'Ethereum Classic',
  [CryptoCurrency.ETH]: 'Ethereum',
  [CryptoCurrency.FEI]: 'Fei USD',
  [CryptoCurrency.FIL]: 'Filecoin',
  [CryptoCurrency.FLOW]: 'Flow',
  [CryptoCurrency.FLR]: 'FLARE',
  [CryptoCurrency.FRAX]: 'Frax',
  [CryptoCurrency.FTT]: 'FarmaTrust',
  [CryptoCurrency.GALA]: 'Gala',
  [CryptoCurrency.GNO]: 'Gnosis',
  [CryptoCurrency.GRT]: 'The Graph',
  [CryptoCurrency.GT]: 'GateToken',
  [CryptoCurrency.GUSD]: 'Gemini US Dollar',
  [CryptoCurrency.HBAR]: 'Hedera',
  [CryptoCurrency.HNT]: 'Helium',
  [CryptoCurrency.HOT]: 'Hydro Protocol',
  [CryptoCurrency.HT]: 'Huobi Token',
  [CryptoCurrency.ICP]: 'Internet Computer',
  [CryptoCurrency.IMX]: 'Immutable X',
  [CryptoCurrency.INJ]: 'Injective',
  [CryptoCurrency.KAVA]: 'Kava',
  [CryptoCurrency.KCS]: 'Kucoin',
  [CryptoCurrency.KDA]: 'Kadena',
  [CryptoCurrency.KLAY]: 'Klaytn',
  [CryptoCurrency.KNC]: 'Kyber Network Crystals',
  [CryptoCurrency.KSM]: 'Kusama',
  [CryptoCurrency.LDO]: 'Lido DAO Token',
  [CryptoCurrency.LEO]: 'LEOcoin',
  [CryptoCurrency.LINK]: 'Chainlink',
  [CryptoCurrency.LRC]: 'Loopring',
  [CryptoCurrency.LTC]: 'Litecoin',
  [CryptoCurrency.LUNA]: 'Terra',
  [CryptoCurrency.MANA]: 'Mana Coin Decentraland',
  [CryptoCurrency.MBX]: 'MobieCoin',
  [CryptoCurrency.MINA]: 'Mina',
  [CryptoCurrency.MKR]: 'Maker',
  [CryptoCurrency.NEAR]: 'NEAR Protocol',
  [CryptoCurrency.NEO]: 'NEO',
  [CryptoCurrency.NEXO]: 'NEXO',
  [CryptoCurrency.NFT]: 'NFT',
  [CryptoCurrency.OKB]: 'Okex',
  [CryptoCurrency.ONE]: 'Menlo One',
  [CryptoCurrency.OP]: 'Optimism',
  [CryptoCurrency.PAXG]: 'PAX Gold',
  [CryptoCurrency.QNT]: 'Quant',
  [CryptoCurrency.QTUM]: 'QTUM',
  [CryptoCurrency.RPL]: 'Rocket Pool',
  [CryptoCurrency.RUNE]: 'THORChain (ERC20)',
  [CryptoCurrency.RVN]: 'Ravencoin',
  [CryptoCurrency.SAND]: 'The Sandbox',
  [CryptoCurrency.SHIB]: 'Shiba Inu',
  [CryptoCurrency.SNX]: 'Synthetix Network',
  [CryptoCurrency.SOL]: 'Solana',
  [CryptoCurrency.SUI]: 'Sui',
  [CryptoCurrency.STX]: 'Stacks',
  [CryptoCurrency.SUSHI]: 'SushiSwap',
  [CryptoCurrency.TRX]: 'TRON',
  [CryptoCurrency.TUSD]: 'True USD',
  [CryptoCurrency.TWT]: 'Trust Wallet Token',
  [CryptoCurrency.UNI]: 'Uniswap',
  [CryptoCurrency.USDC]: 'USDC',
  [CryptoCurrency.USDT]: 'Tether',
  [CryptoCurrency.WBTC]: 'Wrapped Bitcoin',
  [CryptoCurrency.WAVES]: 'Waves',
  [CryptoCurrency.WEMIX]: 'WEMIX',
  [CryptoCurrency.WOO]: 'WOO Network',
  [CryptoCurrency.XAG]: 'Silver Ounce',
  [CryptoCurrency.XAU]: 'Gold Ounce',
  [CryptoCurrency.XAUT]: 'Tether Gold',
  [CryptoCurrency.XLM]: 'Stellar Lumen',
  [CryptoCurrency.XMR]: 'Monero',
  [CryptoCurrency.XRP]: 'Ripple',
  [CryptoCurrency.XTZ]: 'Tezos',
  [CryptoCurrency.YFI]: 'Yearn Finance',
  [CryptoCurrency.ZEC]: 'ZCash',
  [CryptoCurrency.ZIL]: 'Zilliqa',
}
