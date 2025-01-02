import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { parseEther } from "viem";
import { useChainId, useSendTransaction, useSwitchChain } from "wagmi";
import { generateContract } from "../../../../services/api";
import { GenerateParamType } from "../../../../types/generate";
import { useCallback } from "react";

type Props = {
  url: string;
  title: string;
  chainId: number;
  info: Partial<GenerateParamType>;
  handleError: () => void;
  handleSuccess: (url: string) => void;
  handlePaymentError: (err: string) => void;
  handleLoading: () => void;
};

const CryptoSelect = ({
  url,
  title,
  chainId,
  info,
  handleError,
  handleSuccess,
  handleLoading,
  handlePaymentError,
}: Props) => {
  const { error, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const currChainId = useChainId();

  const handleChain = async (chainId: number) => {
    await switchChain({ chainId });
  };

  const handlePayment = useCallback(async () => {
    // try {
    sendTransaction(
      {
        to:
          import.meta.env.VITE_ADMIN_ADDRESS ||
          "0x9aB08c071B90602afdBA07AC59e8fdF55b7be8B1",
        value: parseEther("0.0001"),

        // chainId: baseSepolia.id,
      },
      {
        onSuccess: handleGenerate,
        onError: (e) => {
          handlePaymentError(e.message), handleError();
        },
      }
    );
    // setPay(true);
    //   console.log("errorhandple===", data, error);
    //   if (error) {
    //     handleError();
    //     handlePaymentError(error.message);
    //     return;
    //   } else {
    //     handleLoading();
    //   }
    //   //   const res = await generateContract(info as GenerateParamType);
    //   //   handleSuccess(res.data.url);
    // } catch (error) {
    //   handleError();
    //   console.error("err", error);
    // }
  }, [error]);

  const handleGenerate = async () => {
    try {
      handleLoading();
      const res = await generateContract(info as GenerateParamType);
      handleSuccess(res.data.url);
    } catch (error) {
      handleError();
      console.error("err", error);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <CardHeader title={title} />
      {/* <img src={url} width={10} /> */}
      <CardMedia component={"img"} src={url} height={10} width={30} />
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {chainId === currChainId ? (
          <Button
            onClick={() => {
              handlePayment();
            }}
            variant="outlined"
          >
            Send
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleChain(chainId)}>
            ChangeNetwork
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CryptoSelect;
