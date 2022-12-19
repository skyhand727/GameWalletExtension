import { Network } from 'alchemy-sdk';
export const PRICE_API_URL = 'https://min-api.cryptocompare.com/data';
export const TZSTATS_API_URL = 'https://api.tzstats.com/explorer';
export const MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2';
export const SOLSCAN_API_URL = 'https://public-api.solscan.io';
export const TRON_API_URL = 'https://api.shasta.trongrid.io/v1';

export const COMPARE_API_KEY = '6803283f235d04d3b9b89a06282ba6f4281458b2d5f1175ed17a186d8588df81';
export const MORALIS_API_KEY = '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl';
export const ALCHEMY_API_KEY_MAIN: Record<string, string> = {
  [Network.ETH_MAINNET]: '9-J-aZYHVIY5CStkUtKvX9VtA2lq0RAb',
  [Network.ARB_MAINNET]: '1-JwojwPD2Y-YMFs-J9wOCbUMsG2dQYd',
  [Network.MATIC_MAINNET]: 'FXmYqWJOb_4zDHbAM2ZSpoE6FeeMdzKu',
  [Network.OPT_MAINNET]: 'kPiaxwIV1fZqGTmE3dBwmqKH0033Wik5',
};
export const ALCHEMY_API_KEY_TEST = {
  [Network.ETH_MAINNET]: 'AoIXzbEuxWnRx70DnisXLVgz8thpY1Kp',
  [Network.ARB_MAINNET]: 'FDd94ewwsxBIf-sElD-latFk5bkDE8YM',
  [Network.MATIC_MAINNET]: 'kO8USWVJVzBhahZwj8wfPnoDXsW_BAWJ',
  [Network.OPT_MAINNET]: '3iu34Tr7pRAEClLem56sdx6O9hj2OLDV',
};
export const BSCSCAN_API_KEY = 'WS2RR69RBEZN8TWKYX2U212YGNG5YUKAAJ';
