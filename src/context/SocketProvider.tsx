import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getQuery, getPrice, postQuery } from '../apis/api';
import BitcoinIcon from '../assets/coingroup/bitcoin.svg';
import EthIcon from '../assets/coingroup/ethereum.svg';
import UsdtIcon from '../assets/coingroup/usdt.svg';
import UsdcIcon from '../assets/coingroup/usdc.svg';
import BnbIcon from '../assets/coingroup/bnb.svg';
import LtcIcon from '../assets/coingroup/litecoin.svg';
// import SolIcon from '../assets/coingroup/sol.svg';
import SolIcon from '../assets/coingroup/sol.png';
import TezosIcon from '../assets/coingroup/tezos.png';
import OptimismIcon from '../assets/coingroup/optimism.svg';
import NFTIcon from '../assets/coingroup/NFT_Icon.png';
import { array2object } from '../utils/helper';
import { TransactionMutateParams } from './types';

interface SocketContextType {
  loading: boolean;
  networkError: boolean;
  refetch: (query: string[]) => void;
  priceData: any;
  balanceData?: any;
  walletData?: any;
  walletArray?: any;
  tokenData?: any;
  netData?: any;
  transactionIsLoading?: boolean;
  transactionData?: any;
  transactionTotal?: number;
  transactionMutate?: any;
  errorResult?: Result;
  successResult?: Result;
  withdrawMutate?: any;
  withdrawIsLoading?: boolean;
  swapIsLoading?: boolean;
  swapMutate?: any;
}

const init_tokens = [
  {
    id: '1',
    name: 'BTC',
    icon: BitcoinIcon,
    balance: 1.2338,
    USD: 23598.15,
    EUR: 24549.63,
  },
  {
    id: '2',
    name: 'ETH',
    icon: EthIcon,
    balance: 2.5613,
    USD: 3418.34,
    EUR: 3555.75,
  },
  {
    id: '3',
    name: 'USDT',
    icon: UsdtIcon,
    balance: 39295,
    USD: 39293.36,
    EUR: 40872.95,
  },
  {
    id: '4',
    name: 'USDC',
    icon: UsdcIcon,
    balance: 39295,
    USD: 39295,
    EUR: 40886.45,
  },
  {
    id: '5',
    name: 'BNB',
    icon: BnbIcon,
    balance: 39.2462,
    USD: 10794.45,
    EUR: 11227.85,
  },
  {
    id: '6',
    name: 'LTC',
    icon: LtcIcon,
    balance: 323.003,
    USD: 17280.66,
    EUR: 17973.27,
  },
  {
    id: '7',
    name: 'SOL',
    icon: SolIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '8',
    name: 'XTZ',
    icon: TezosIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '9',
    name: 'OP',
    icon: OptimismIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '10',
    name: 'NFT',
    icon: NFTIcon,
  },
];

const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const useSocket = () => useContext(SocketContext);

type Result = {
  count: number;
  message: string;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [priceLoading, setPriceLoading] = useState<boolean>(true);
  const [priceData, setPriceData] = useState<any>(null);
  const [successResult, setSuccessResult] = useState<Result>();
  const [errorResult, setErrorResult] = useState<Result>();
  const [connection, setConnection] = useState<WebSocket>();
  const [networkError, setNetworkError] = useState<boolean>(false);

  // Access the client
  const queryClient = useQueryClient();
  const user = '1';

  // Queries
  const {
    status: tokenStatus,
    isLoading: tokenIsLoading,
    isError: tokenIsError,
    data: tokenData,
  } = useQuery(['/GetSupportedAssets'], getQuery);

  const {
    status: netStatus,
    isLoading: netIsLoading,
    isError: netIsError,
    data: netData,
  } = useQuery(['/GetSupportedNets'], getQuery);

  const {
    status: balanceStatus,
    isLoading: balanceIsLoading,
    isError: balanceIsError,
    data: balanceData,
  } = useQuery([`/ListAssets`, `?user=${user}`], getQuery);

  const {
    status: walletStatus,
    isLoading: walletIsLoading,
    isError: walletIsError,
    data: walletData,
  } = useQuery(['/ListWallets', `?user=${user}`], getQuery);

  const refetch = (query: string[]) => {
    queryClient.invalidateQueries();
  };

  const {
    status: transactionStatus,
    isLoading: transactionIsLoading,
    isError: transactionIsError,
    mutate: transactionMutate,
    data: transactionData,
  } = useMutation(
    (data: TransactionMutateParams) => {
      return postQuery('/ListTransactions', data);
    },
    {
      onError: (data: any) => {
        const { error } = data;
        setErrorResult((prev) => ({
          count: (prev?.count ?? 0) + 1,
          message: `Fetching Transactions failed due to server errors. ${error}`,
        }));
      },
    },
  );

  const {
    status: withdrawStatus,
    isLoading: withdrawIsLoading,
    isError: withdrawIsError,
    mutate: withdrawMutate,
    data: withdrawData,
  } = useMutation(
    (data) => {
      return postQuery('/WithdrawAsset', data);
    },
    {
      onSuccess: (data) => {
        if (data?.success) {
          const { withdrawal } = data;
          setSuccessResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `Your withdraw request of ${withdrawal.amount} ${
              tokenData?.find((a: any) => a.id === withdrawal.token_id)?.name
            } has been successful. Check your balance.`,
          }));
        } else {
          setErrorResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `${data?.message} Check your input is correct.`,
          }));
        }
      },
      onError: (data: any) => {
        const { error } = data;
        setErrorResult((prev) => ({
          count: (prev?.count ?? 0) + 1,
          message: `Your withdraw request of ${error.amount} ${
            tokenData?.find((a: any) => a.id === error.token_id)?.name
          } has been failed. Check if amount is less than 0.01 for test mode. Or please contact to the support team.`,
        }));
      },
      onSettled: () => {
        refetch(['ListAssets']);
      },
    },
  );

  const {
    status: swapStatus,
    isLoading: swapIsLoading,
    isError: swapIsError,
    mutate: swapMutate,
    data: swapData,
  } = useMutation(
    (data) => {
      return postQuery('/Swap', data);
    },
    {
      onSuccess: (data) => {
        if (data?.success) {
          const { swapData } = data;
          setSuccessResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `Your swap request from ${swapData.fromToken} to ${swapData.toToken} has been successful. Check your balance.`,
          }));
        } else {
          setErrorResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `${data?.message} Check your input is correct.`,
          }));
        }
      },
      onError: (data: any) => {
        const { error } = data;
        setErrorResult((prev) => ({
          count: (prev?.count ?? 0) + 1,
          message: `Your swap request from ${swapData.fromToken} to ${swapData.toToken} has been failed. Please contact to the support team.`,
        }));
      },
      onSettled: () => {
        refetch(['ListAssets']);
      },
    },
  );

  const loading =
    priceLoading ||
    !priceData ||
    balanceIsLoading ||
    walletIsLoading ||
    tokenIsLoading ||
    withdrawIsLoading ||
    networkError;

  useEffect(() => {
    getPrice().then((data) => data && setPriceData(array2object(data)));
  }, []);

  useEffect(() => {
    const connection_price = new WebSocket(
      'wss://eoul92hqui.execute-api.eu-west-1.amazonaws.com/production/',
    );

    connection_price.onopen = (socket) => {
      setPriceLoading(false);
      setNetworkError(false);
    };

    connection_price.onmessage = (message) => {
      const json = JSON.parse(message.data);

      const assetName = json.asset;
      const { price } = json;

      setPriceData((prev: any) => ({
        ...prev,
        [assetName]: price,
      }));
    };

    connection_price.onerror = (error) => {
      setNetworkError(true);
    };

    return () => connection_price?.close();
  }, []);

  useEffect(() => {
    if (successResult?.count ?? 0 > 0) {
      // chrome.runtime.sendMessage(successResult, function (response) {
      // });
      refetch(['ListAssets']);
    }
  }, [successResult]);

  useEffect(() => {
    if (errorResult?.count ?? 0 > 0) {
      // chrome.runtime.sendMessage(errorResult, function (response) {
      // });
    }
  }, [errorResult]);

  // useEffect(() => {
  //   const connection_deposit = new WebSocket(
  //     'wss://80halgu2p0.execute-api.eu-west-1.amazonaws.com/production/',
  //   );
  //   setConnection(connection_deposit);

  //   return () => connection_deposit.close();
  // }, []);

  useEffect(() => {
    if (connection && tokenData) {
      connection.onopen = (socket) => {
        setNetworkError(false);
      };

      connection.onmessage = (message) => {
        const json = JSON.parse(message.data);
        if (json?.status === 'confirmed') {
          setSuccessResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `${json?.amount} ${
              tokenData?.find((a: any) => a.id === json?.token_id)?.name
            } was successfully deposited and confirmed! Please check your balance now.`,
          }));
          queryClient.invalidateQueries(['ListAssets']);
        } else if (json?.status === 'not-confirmed') {
          setSuccessResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `Your deposit request was successful but not confirmed yet. Please wait for a while to confirm the transaction and notice your balance will be updated after that.`,
          }));
          queryClient.invalidateQueries(['ListAssets']);
        } else {
          setErrorResult((prev) => ({
            count: (prev?.count ?? 0) + 1,
            message: `Your deposit has been failed. Please check your transaction and contact us.`,
          }));
        }
      };
    }
  }, [connection, tokenData]);

  return (
    <SocketContext.Provider
      value={{
        loading,
        networkError,
        refetch,
        priceData,
        balanceData: array2object(
          balanceData && 'map' in balanceData
            ? balanceData?.map((a: any) => ({
                [a.token_id]: Math.floor(a.amount * 100000) / 100000,
              }))
            : [],
        ),
        walletData: array2object(
          walletData && 'map' in walletData
            ? walletData?.map((a: any) => ({ [a.net_id]: a.address }))
            : [],
        ),
        walletArray: walletData && 'map' in walletData ? walletData : [],
        tokenData:
          tokenData && 'sort' in tokenData
            ? tokenData
                ?.filter((token: any) => token.id !== '10')
                ?.sort((a: any, b: any) => a.id - b.id)
                .map((token: any) => ({
                  ...token,
                  icon: init_tokens?.find((tk) => tk.id === token.id)?.icon,
                }))
            : [],
        netData,
        errorResult,
        successResult,
        withdrawMutate,
        withdrawIsLoading,
        transactionIsLoading,
        transactionData: transactionData?.rows,
        transactionTotal: transactionData?.total ? transactionData?.total[0].Total : 0,
        transactionMutate,
        swapIsLoading,
        swapMutate,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
