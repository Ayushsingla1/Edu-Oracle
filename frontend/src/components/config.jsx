import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig,RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { darkTheme } from '@rainbow-me/rainbowkit';

const sonicBlaze = {
  id: 57_054,
  name: 'Sonic Blaze Testnet',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.blaze.soniclabs.com'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.sonicscan.org' },
  },
}

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sonicBlaze],
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