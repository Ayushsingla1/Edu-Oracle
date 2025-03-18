import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig,RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { darkTheme } from '@rainbow-me/rainbowkit';


const eduChainTestnet = {
  id: 656476,
  name: 'EDU Chain Testnet',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Educhain', symbol: 'EDU', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
  },
  blockExplorers: {
    default: {  url: 'https://edu-chain-testnet.blockscout.com' },
  },
}

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [eduChainTestnet],
    ssr: false,
});

const queryClient = new QueryClient();
const Config = ({children}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
      accentColor: '#34D399',
      accentColorForeground: 'white',
      borderRadius: 'large',
      fontStack: 'system',
      overlayBlur: 'small',
    })}>
            {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Config;