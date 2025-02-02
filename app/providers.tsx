'use client';

import { useEffect, useState } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { EnokiFlowProvider } from '@mysten/enoki/react';
import {
    createNetworkConfig,
    SuiClientProvider,
    WalletProvider,
} from "@mysten/dapp-kit";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";
import Loading from '@/components/Loading';
import { registerStashedWallet } from "@mysten/zksend";
import AccountProvider from "../contexts/account"

const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});

const sessionStorageAdapter = {
    getItem: async (key: any) => {
        return sessionStorage.getItem(key);
    },
    setItem: async (key: any, value: any) => {
        sessionStorage.setItem(key, value);
    },
    removeItem: async (key: any) => {
        sessionStorage.removeItem(key);
    },
};

registerStashedWallet("BackHack.dev", {});

const queryClient = new QueryClient();


export function Providers({ children }: any) {

    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);

    useEffect(() => {

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider
                    networks={networkConfig}
                    defaultNetwork={"testnet"}
                >
                    <WalletProvider
                        autoConnect
                        stashedWallet={{
                            name: "BackHack.dev",
                        }}
                        storage={sessionStorageAdapter}
                    >
                        <EnokiFlowProvider apiKey={process.env.ENOKI_API_KEY || ""}>
                            <AccountProvider>
                                {/* screen loader  */}
                                {showLoader && (
                                    <Loading />
                                )}
                                {children}
                            </AccountProvider>
                        </EnokiFlowProvider>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </>
    );
}

