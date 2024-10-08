import {
  Connection,
  ConnectType,
  useConnectedWallet,
  useWallet,
  WalletStatus,
} from "@xpla/wallet-provider";
import { useEffect, useState } from "react";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { selectConnection } from "./ConnectModal";
import { truncate } from "@xpla.kitchen/utils";
import "../../App.css";
import { Extension } from "@xpla/xpla.js";
import useLoginSession from "../../zustand/useLoginSession";
import { getBaseurl } from "../../util/getBaseurl";
import axios from "axios";

let timerId: any = undefined;

export default function Connect() {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const {loginSession, setLoginSession} = useLoginSession();

  const wallet =
    useWallet();
  const { status, availableConnections, connect, disconnect, wallets, recheckStatus} = wallet;
  const isDesktop = useMediaQuery("(min-width:768px)");
  const connectedWallet = useConnectedWallet();

  const clickConnect = async () => {
    try {
      const available: Connection[] = availableConnections.filter(
        (connection) =>
          connection.type === ConnectType.EXTENSION
      );

      available.map((a) => {
        if (a.icon === 'https://assets.xpla.io/icon/extension/icon-c2xvault.png') {
          return { type: 'EXTENSION', name: 'XPLA Vault Wallet', icon: 'https://assets.xpla.io/icon/extension/icon.png', identifier: 'xplavault' };
        } else {
          return a
        }
      })

      if (
        isDesktop &&
        available.filter((c) => c.name === "XPLA Vault Wallet").length === 0
      ) {
        available.unshift({
          type: ConnectType.READONLY,
          name: "XPLA Vault Wallet",
          icon: "https://assets.xpla.io/icon/extension/icon.png",
          identifier: "https://download-vault.xpla.io",
        } as Connection);
      }
      if (
        isDesktop &&
        available.filter((c) => c.name === "XPLA GAMES Wallet").length === 0
      ) {
        available.splice(1, 0, {
          type: ConnectType.READONLY,
          name: "XPLA GAMES Wallet",
          icon: "https://assets.xpla.io/icon/extension/icon.png",
          identifier: "https://xpla.games/download",
        } as Connection);
      }

      const selected = await selectConnection(
        isDesktop
          ? available.filter((connection) => {
            if (connection.name === "XPLA GAMES Wallet") {
              connection.icon = "https://xpla.events/img/xplagames.svg";
              return connection;
            } else {
              return connection;
            }
          })
          : [
            {
              type: "WALLETCONNECT",
              name: "XPLA Vault Wallet",
              icon: "https://assets.xpla.io/icon/extension/icon.png",
              identifier: undefined,
            } as Connection
          ]
      );

      if (!selected) {
        return;
      } else {
        const type = selected[0];
        const identifier = selected[1] || "";
        if (isDesktop && type === ConnectType.READONLY) {
          window.open(identifier);
          return;
        }

        if (identifier === "xplagames") {
          await connect(type, undefined, true);
        } else {
          await connect(type, identifier);
        }
      }
    } catch (e) { }
  };


  const walletDisconnect = () => {
    disconnect();
    setLoginSession(undefined);
  }

  useEffect(() => {
    if (connectedWallet) {
      connectedWallet.signBytes(Buffer.from("ChatPostSignMessage")).then((signresult) => {
        setLoginSession(signresult);
        console.log(signresult)
      }).catch((e) => {
        walletDisconnect()
      })
    }
  }, [connectedWallet])

  const handleBlurContainer = () => {
    setTimeout(() => {
      setShowTooltip(false);
    }, 200);
  };

  return (
    <>
      {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ? (
        <div
          onBlur={handleBlurContainer}
          onMouseOut={() => {
            if (window.navigator.platform === "iPhone") {
              handleBlurContainer();
            }
          }}
          className="connectwalletshadow relative flex justify-center items-center"
        >
          <button
            className="flex md:min-w-[327px] w-full md:leading-[38px] leading-[25px] z-10 items-center justify-center md:gap-[10px] md:mb-[0px] mb-[10px] px-[45px] py-[10px] rounded-[100px] hover:cursor-pointer bg-gradient-to-r to-[#0080FF] from-[#00AAFF]"
            onClick={() => setShowTooltip(true)}
          >
            {truncate(wallets[0].xplaAddress, [5, 4])}
          </button>
          {showTooltip && (
            <div className="font-pretendard absolute tooltip md:text-[28px] text-[24px] md:leading-[33px] leading-[28px] hover:cursor-default">
              {truncate(wallets[0].xplaAddress, [5, 4])}
              <div
                className="font-pretendard border-solid border-[1px] border-[#000080] text-[#000080] md:px-[28px] px-[4px] py-[8px] font-medium md:text-[22px] text-[19px] md:leading-[26px] leading-[22px] rounded-[8px] hover:cursor-pointer mt-[10px]"
                onClick={() => {
                  walletDisconnect();
                }}
              >
                Disconnect Wallet
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            setShowTooltip(false);
            clickConnect();
          }}
          className="connectwalletshadow flex md:min-w-[327px] md:leading-[38px] leading-[25px] z-10 items-center justify-center gap-[10px] px-[45px] py-[10px] rounded-[100px] hover:cursor-pointer bg-gradient-to-r to-[#0080FF] from-[#00AAFF]"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}
