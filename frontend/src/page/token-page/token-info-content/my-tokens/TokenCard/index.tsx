import {
  Box,
  Chip,
  ClickAwayListener,
  Collapse,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import metamask from "../../../../../assets/mt.svg";
import { DEAD_ADDRESS, NETWORK } from "../../../../../constant";
import {
  blue,
  blueGrey,
  green,
  grey,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useReadContracts } from "wagmi";
import custom_abi from "../../../../../smart_contract/customer_token.json";
import std_abi from "../../../../../smart_contract/std_token.json";
import custom_mint_abi from "../../../../../smart_contract/custom_mint_token.json";
import custom_liquidity_abi from "../../../../../smart_contract/custom_liquidity_token.json";
import { CreateTokenType } from "../../../../../types/generate";
import SettingsIcon from "@mui/icons-material/Settings";
import TokenManageDialog from "../TokenManage/TokenManageDialog";
import { useContractDialog } from "../../../../../context/useContractDialog";

type Props = {
  tokenAddress: string;
  creatorAddress: string;
  type: CreateTokenType["tokenType"];
  select: CreateTokenType["select"];
  balance: string;
};

const Root = styled(Box)(() => ({
  borderRadius: 6,
}));

type FeatureKeys = CreateTokenType["select"][number];

type FeaturesType = {
  [key in FeatureKeys]?: {
    color: string;
    title: string;
    volume: string;
  };
};

const featuresTemplate: FeaturesType = {
  mint: {
    color: green[100],
    title: "Increase Supply",
    volume: "",
  },
  burn: {
    color: red[100],
    title: "Burnable",
    volume: "",
  },
  liquidity: {
    color: blue[100],
    title: "Liquidity",
    volume: "",
  },
  fee: {
    color: yellow[100],
    title: "CreatorCommission",
    volume: "",
  },
  team: {
    color: purple[100],
    title: "Team Allocated",
    volume: "",
  },
};
const TokenCard = ({
  tokenAddress,
  creatorAddress,
  type,
  select,
  balance,
}: Props) => {
  const theme = useTheme();
  const [more, setMore] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openCopy, setOpenCopy] = useState<boolean>(false);
  const [manageAddress, setManageAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { updated } = useContractDialog();

  useEffect(() => {
    if (updated) {
      setRefetchTrigger((prev) => prev + 1);
    }
  }, [updated]);

  const [tokenType, setTokenType] = useState<
    "basic" | "custom" | "custom_mint" | "liq_mint"
  >("basic");
  let tempData;

  if (type === "basic") {
    const { data } = useReadContracts({
      allowFailure: false,
      scopeKey: refetchTrigger.toString(),
      contracts: [
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: std_abi,
          functionName: "owner",
        },
      ],
    });
    tempData = data;
  }
  if (type === "custom") {
    const { data } = useReadContracts({
      allowFailure: false,
      scopeKey: refetchTrigger.toString(),

      contracts: [
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "tradeBurnRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "tradeFeeRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_abi,
          functionName: "owner",
        },
      ],
    });
    tempData = data;
  }
  if (type === "custom_mint") {
    const { data } = useReadContracts({
      allowFailure: false,
      scopeKey: refetchTrigger.toString(),

      contracts: [
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "tradeBurnRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "tradeFeeRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_mint_abi,
          functionName: "owner",
        },
      ],
    });
    tempData = data;
  }
  if (type === "liq_mint") {
    const { data } = useReadContracts({
      allowFailure: false,
      scopeKey: refetchTrigger.toString(),

      contracts: [
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "decimals",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "symbol",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "name",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "totalSupply",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "balanceOf",
          args: [creatorAddress],
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "tradeBurnRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "tradeFeeRatio",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "teamAddress",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "teamAllocation",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "uniswapV2Pair",
        },
        {
          address: tokenAddress as any,
          abi: custom_liquidity_abi,
          functionName: "owner",
        },
      ],
    });
    tempData = data;
  }

  const features = useMemo(
    () => select.map((item) => featuresTemplate[item]),
    [select]
  );

  function abbreviateString(str: string, maxLength = 3) {
    if (str.length <= maxLength) {
      return str; //
    }
    const firstPart = str.substring(0, maxLength);
    const lastPart = str.substring(str.length - maxLength);
    return `${firstPart} ... ${lastPart}`;
  }

  function formatNumber(number: number) {
    if (number >= 1000000000000) {
      return (number / 1000000000000).toFixed(1) + "T";
    } else if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + "G";
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }
  function processBigint(number: bigint) {
    return (BigInt(number) / 1000000000000000000n).toString();
  }

  const handleTooltipClose = () => {
    setOpenCopy(false);
  };
  const handleCopyText = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setOpenCopy(true);
        console.log("Text copied successfully");
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
      });
  };

  const handleAddToken = async (
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenName: string
  ) => {
    //@ts-ignore
    if (window.ethereum && window.ethereum.request) {
      try {
        //@ts-ignore
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Currently, only ERC20 tokens are supported
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              name: tokenName,
              // image: tokenImage,
            },
          },
        });

        if (wasAdded) {
          console.log("Token added!");
        } else {
          console.log("Token addition cancelled.");
        }
      } catch (error) {
        console.error("Error adding token:", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  };

  const manageToken = (
    address: string,
    type: "basic" | "custom" | "custom_mint" | "liq_mint",
    name: string,
    symbol: string
  ) => {
    setOpen(true);
    setManageAddress(address);
    setTokenType(type);
    setName(name);
    setSymbol(symbol);
  };

  return (
    <Root>
      <Box
        position={"relative"}
        padding={2}
        bgcolor={theme.palette.mode === "dark" ? blueGrey[800] : blue[100]}
        borderRadius={"8px 8px 0px 0px"}
      >
        <Box display={"flex"} columnGap={1} alignItems={"center"}>
          <Typography
            variant="body2"
            component={"a"}
            href={`${NETWORK}token/${tokenAddress}`}
            target="_blank"
          >
            {abbreviateString(tokenAddress)}
          </Typography>
          <LaunchIcon
            sx={{ cursor: "pointer", width: 12 }}
            onClick={() => {
              window.open(`${NETWORK}token/${tokenAddress}`, "_blank");
            }}
          />
          <ClickAwayListener onClickAway={handleTooltipClose}>
            {/* <div> */}
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={openCopy}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              arrow
              placement="top"
              title="Address copied"
            >
              <ContentCopyIcon
                onClick={() => {
                  handleCopyText(tokenAddress);
                }}
                fontSize="small"
                sx={{ cursor: "pointer", width: 12 }}
              />
            </Tooltip>
            {/* </div> */}
          </ClickAwayListener>
          {tempData && (
            <Tooltip title="Add the token to metamask">
              <Box
                width={14}
                height={14}
                sx={{
                  backgroundImage: `url(${metamask})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleAddToken(
                    tokenAddress,
                    tempData[1],
                    tempData[0],
                    tempData[2]
                  );
                }}
              />
            </Tooltip>
          )}
          {tempData && (
            <Tooltip title="Manage Token">
              <SettingsIcon
                sx={{ cursor: "pointer", width: 12 }}
                onClick={() => {
                  manageToken(tokenAddress, type, tempData[2], tempData[1]);
                }}
              />
            </Tooltip>
          )}

          {tempData && tempData[tempData?.length - 1] == DEAD_ADDRESS && (
            <Tooltip title="the contract is renounced">
              <Chip color="success" label="ren" sx={{ height: "auto" }} />
            </Tooltip>
          )}
          {/* <img
            src={metamask}
            alt="metamask"
            width={14}
            style={{ cursor: "pointer" }}
          /> */}
        </Box>
        <Box mt={4}>
          <Grid container>
            <Grid item xs={6}>
              <Box>
                {tempData && tempData[1] ? (
                  <Typography variant="h4" noWrap>
                    {tempData[1] as string}
                  </Typography>
                ) : (
                  <Skeleton width={80} component={"h4"} />
                )}
                <Typography variant="caption">Token Symbol</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                {tempData && tempData[3] ? (
                  <Typography variant="h4">
                    {formatNumber(Number(processBigint(tempData[3] as bigint)))}
                  </Typography>
                ) : (
                  <Skeleton width={80} component={"h4"} />
                )}
                <Typography variant="caption">Total Supply</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          onClick={() => setMore(!more)}
          width={30}
          height={30}
          borderRadius={"50%"}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          left={"45%"}
          bottom={-16}
          sx={{ borderRadius: "50%", borderWidth: 1, cursor: "pointer" }}
          bgcolor={theme.palette.mode === "dark" ? blueGrey[800] : blue[50]}
          borderColor={theme.palette.mode === "light" ? "white" : grey[700]}
          zIndex={1000}
        >
          {more ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
      </Box>
      <Collapse in={more}>
        <Box
          p={4}
          bgcolor={theme.palette.mode === "dark" ? grey[700] : grey[100]}
          borderRadius={"0px 0px 8px 8px"}
          // sx={{ overflow: "scroll" }}
          height={450}
        >
          <Typography variant="caption">Token Name</Typography>
          {/*@ts-ignore*/}
          {tempData && tempData[2] ? (
            <Typography variant="subtitle1">
              {tempData[2].toString()}
            </Typography>
          ) : (
            <Skeleton variant="text" width={40} />
          )}

          <Box mt={1}>
            <Typography variant="caption">Created by</Typography>
            <Box display={"flex"} columnGap={1} alignItems={"center"}>
              <Typography variant="subtitle1">
                {/*@ts-ignore*/}
                {abbreviateString(creatorAddress ?? "0")}
              </Typography>
              <LaunchIcon
                sx={{ width: 12, cursor: "pointer" }}
                onClick={() => {
                  window.open(`${NETWORK}address/${creatorAddress}`, "_blank");
                }}
              />
              <ContentCopyIcon
                sx={{ width: 12, cursor: "pointer" }}
                onClick={() => {
                  handleCopyText(creatorAddress);
                }}
              />
            </Box>
          </Box>
          <Box mt={1}>
            <Typography variant="caption">Holders</Typography>
            <Box display={"flex"} columnGap={1} alignItems={"center"}>
              <Typography variant="subtitle1">Token Holders Chart</Typography>
              <LaunchIcon
                sx={{ width: 12, cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    `${NETWORK}token/tokenholderchart/${tokenAddress}`,
                    "_blank"
                  );
                }}
              />
            </Box>
          </Box>
          <Box mt={1}>
            <Typography variant="caption">Creator Balance</Typography>
            <Typography variant="subtitle1">
              {/*@ts-ignore*/}
              {tempData && tempData[4]
                ? processBigint(tempData[4] as bigint)
                : 0}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="caption">Special Features</Typography>
            <Grid container spacing={1}>
              {tempData &&
                features.map((item, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={`${item?.title} ${
                        item?.title == "Burnable"
                          ? ` - ${(Number(tempData[5]) / 100).toString()} %`
                          : item?.title == "CreatorCommission"
                          ? ` - ${(Number(tempData[6]) / 100).toString()} %`
                          : ""
                      }`}
                      sx={{ bgcolor: item?.color }}
                    />
                  </Grid>
                ))}
              {features.length === 0 && (
                <Grid item>
                  <Typography>None</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Collapse>
      {tempData && (
        <TokenManageDialog
          open={open}
          handleClose={() => {
            setOpen(false);
            setManageAddress("");
          }}
          tokenType={tokenType}
          manageAddress={manageAddress}
          name={name}
          symbol={symbol}
          burn={Number(tempData[5] ?? 0) / 100}
          feeRatio={Number(tempData[6] ?? 0) / 100}
          balance={Number(processBigint(tempData[4] as bigint)) ?? 0}
          totalSupply={Number(processBigint(tempData[3] as bigint)) ?? 0}
          liquidity={0}
          teamAllocation={
            tempData[8] ? Number(processBigint(tempData[8] as bigint)) : 0
          }
          pairAddress={tempData[9] ? (tempData[9] as string) : ""}
          owner={tempData[tempData.length - 1] as string}
          select={select}
          teamAddress={tempData[7] ? (tempData[7] as string) : ""}
          walletBalance={balance}
        />
      )}
    </Root>
  );
};

export default memo(TokenCard);
