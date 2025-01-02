import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import abi from "../../../smart_contract/template.json";
//@ts-ignore
import _, { result } from "lodash";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import MyTokens from "./my-tokens";
import { createContract, getTokens } from "../../../services/api";
import { CreateTokenResponseType } from "../../../types/generate";
import { CONTRACT_ADDRESS, NETWORK, SERVICE_FEE } from "../../../constant";
import successImg from "../../../assets/icons8-bot.gif";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";

type Props = {};

interface IData {
  name?: string;
  symbol: string;
  decimals?: number;
  supply: number;
  burnRate?: number;
  tradingFee?: number;
  teamAddress?: string;
  teamAllocationPercentage?: number;
  duration?: number;
  liquidityAllocation?: number;
}

const Root = styled(Box)(() => ({
  maxWidth: 450,
  padding: 8,
}));

const BoxRoot = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: 16,
  background: theme.palette.mode === "light" ? grey[100] : grey[800],
  marginTop: 12,
}));

const PercentageText = styled(TextField)(({ theme }) => ({
  width: "16ch",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const FormRoot = styled(Paper)(() => ({
  padding: 30,
  borderRadius: 10,
  marginTop: 50,
  // display: "flex",
  // justifyContent: "center",
  // backgroundColor: theme.palette.primary.main,
  // color: "white",
}));

const max = 10;

const TokenInfoContent = (_props: Props) => {
  const { data: hash, writeContract, error } = useWriteContract();
  const { address } = useAccount();
  const [burn, setBurn] = useState<boolean>(false);
  const [fee, setFee] = useState<boolean>(false);
  const [mint, setMint] = useState<boolean>(false);
  const [team, setTeam] = useState<boolean>(false);
  const [liq, setLiq] = useState<boolean>(false);
  const [type, setType] = useState<
    "basic" | "custom" | "custom_mint" | "liq_mint"
  >("basic");
  const [schema, setSchema] = useState(
    z.object({
      supply: z.number(),
      symbol: z.string().nonempty("You must enter token symbol"),
      name: z.string().optional(),
      decimals: z.number().optional(),
      burnRate: z.number().optional(),
      tradingFee: z.number().optional(),
      teamAddress: z.string().optional(),
      teamAllocationPercentage: z.number().optional(),
      duration: z.number().optional(),
      liquidityAllocation: z.number().optional(),
    })
  );
  const [tokens, setTokens] = useState<CreateTokenResponseType[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  // Update the schema when checkbox states change
  useEffect(() => {
    const newSchema = z.object({
      supply: z.number(),
      symbol: z.string().nonempty("You must enter token symbol"),
      name: z.string().optional(),
      decimals: z.number().optional(),
      burnRate: burn ? z.number() : z.number().optional(),
      tradingFee: fee ? z.number() : z.number().optional(),
      teamAddress: z.string().optional(),
      teamAllocationPercentage: z.number().optional(),
      duration: z.number().optional(),
      liquidityAllocation: z.number().optional(),
    });
    setSchema(newSchema as any);
  }, [burn, fee, team]);

  const methods = useForm<IData>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      supply: NaN,
      burnRate: 0,
      tradingFee: 0,
      teamAddress: "",
      teamAllocationPercentage: 0,
      duration: 0,
      liquidityAllocation: 0,
    },
  });

  const { handleSubmit, control, formState, setValue, reset } = methods;
  const { dirtyFields, isValid } = formState;

  const onSubmit = async (data: IData) => {
    if (burn && fee && mint) {
      if (liq || team) {
        let durationTime =
          Number(data.duration ? data.duration : 0) * 60 * 60 * 24;
        setType("liq_mint");
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createCustomLiquidityERC20",
          args: [
            data.supply.toString(),
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            data.teamAddress ? data.teamAddress : address,
            [
              (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
              (data.tradingFee
                ? Math.round(data.tradingFee * 100)
                : 0
              ).toString(),
              (data.teamAllocationPercentage
                ? data.teamAllocationPercentage
                : 0
              ).toString(),
              durationTime,
              (data.liquidityAllocation
                ? data.liquidityAllocation
                : 0
              ).toString(),
            ],
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      } else {
        console.log("custome_mint");
        setType("custom_mint");
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createCustomMintableERC20",
          args: [
            data.supply.toString(), // totalSupply: 100 million tokens
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
            (data.tradingFee
              ? Math.round(data.tradingFee * 100)
              : 0
            ).toString(),

            // decimals: typically 18, like Ethereum
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      }
    } else if (!burn && !fee && !mint) {
      if (liq || team) {
        let durationTime =
          Number(data.duration ? data.duration : 0) * 60 * 60 * 24;
        setType("liq_mint");
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createCustomLiquidityERC20",
          args: [
            data.supply.toString(),
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            data.teamAddress ? data.teamAddress : address,
            [
              (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
              (data.tradingFee
                ? Math.round(data.tradingFee * 100)
                : 0
              ).toString(),
              (data.teamAllocationPercentage
                ? data.teamAllocationPercentage
                : 0
              ).toString(),
              durationTime,
              (data.liquidityAllocation
                ? data.liquidityAllocation
                : 0
              ).toString(),
            ],
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      } else {
        setType("basic");
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createStdERC20",
          args: [
            parseEther(data.supply.toString()), // TODO: totalSupply:remove parseEther
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            // decimals: typically 18, like Ethereum
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      }
    } else {
      if (liq || team) {
        let durationTime =
          Number(data.duration ? data.duration : 0) * 60 * 60 * 24;
        setType("liq_mint");
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createCustomLiquidityERC20",
          args: [
            data.supply.toString(),
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            data.teamAddress ? data.teamAddress : address,
            [
              (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
              (data.tradingFee
                ? Math.round(data.tradingFee * 100)
                : 0
              ).toString(),
              (data.teamAllocationPercentage
                ? data.teamAllocationPercentage
                : 0
              ).toString(),
              durationTime,
              (data.liquidityAllocation
                ? data.liquidityAllocation
                : 0
              ).toString(),
            ],
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      } else {
        if (mint) {
          console.log("createCustomMintableERC20");
          setType("custom_mint");
          writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: "createCustomMintableERC20",
            args: [
              data.supply.toString(), // totalSupply: 100 million tokens
              data.name ? data.name : data.symbol, // name: 'ExampleToken'
              data.symbol, // symbol: 'EXM'
              data.decimals?.toString(),
              (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
              (data.tradingFee
                ? Math.round(data.tradingFee * 100)
                : 0
              ).toString(),

              // decimals: typically 18, like Ethereum
            ],
            value: parseEther(SERVICE_FEE),
          });
          return 0;
        }
        console.log("createCustomERC20");
        setType("custom");

        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "createCustomERC20",
          args: [
            data.supply.toString(), // totalSupply: 100 million tokens
            data.name ? data.name : data.symbol, // name: 'ExampleToken'
            data.symbol, // symbol: 'EXM'
            data.decimals?.toString(),
            (data.burnRate ? Math.round(data.burnRate * 100) : 0).toString(),
            (data.tradingFee
              ? Math.round(data.tradingFee * 100)
              : 0
            ).toString(),

            // decimals: typically 18, like Ethereum
          ],
          value: parseEther(SERVICE_FEE),
        });
        return 0;
      }
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const getSelectArray = () => {
    const selectArray = [];
    if (burn) selectArray.push("burn");
    if (fee) selectArray.push("fee");
    if (mint) selectArray.push("mint");
    if (team) selectArray.push("team");
    if (liq) selectArray.push("liquidity");
    return selectArray;
  };
  useEffect(() => {
    const fetchData = async () => {
      if (data?.logs[0].address && isConfirmed && success && address) {
        try {
          await createContract({
            tokenAddress: data.logs[0].address as string,
            creatorAddress: address as string,
            tokenType: type,
            select: getSelectArray() as any,
          });
          reset();
          setBurn(false);
          setFee(false);
          setMint(false);
          setTeam(false);
          setLiq(false);
          setType("basic");
          //@ts-ignore
          setTokens([
            ...tokens,
            {
              token_type: type,
              tokenAddress: data.logs[0].address,
              creatorAddress: address,
              select: getSelectArray() as any,
            },
          ]);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData(); // Call the async function immediately
  }, [
    data?.logs[0]?.address,
    isConfirmed,
    type,
    address,
    reset,
    burn,
    fee,
    mint,
    team,
    liq,
    success,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        getUserTokens(address);
      } else {
        setTokens([]);
      }
    };
    fetchData();
  }, [address]);
  useEffect(() => {
    if (isConfirmed) {
      setSuccess(true);
    }
  }, [isConfirmed]);

  const getUserTokens = async (address: string) => {
    try {
      let res = await getTokens(address);
      setTokens(res.data as CreateTokenResponseType[]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <FormRoot>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Root>
                {error && <Alert severity="error">{error.message}</Alert>}
                <Typography variant="h6">Enter Token Parameters</Typography>
                <Typography sx={{ mt: 2 }}>Token Symbol</Typography>

                <Controller
                  name="symbol"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={{ mt: 1 }}
                      placeholder="1-16 Characters"
                    />
                  )}
                />
                <Typography sx={{ mt: 2 }}>Token Supply</Typography>

                <Controller
                  name="supply"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <TextField
                      type="number"
                      {...field}
                      fullWidth
                      sx={{ mt: 1 }}
                      onChange={(e) => {
                        const value = e.target.value;
                        // If the input is empty, set it to an empty string
                        onChange(value === "" ? NaN : Number(value));
                      }}
                      placeholder="0-99,999,999,999,999,999"
                    />
                  )}
                />
                {/* <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                sx={{ cursor: "pointer" }}
                onClick={() => setMore(!more)}
              >
                <Typography>More</Typography>
                {more ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Box> */}
                {/* <Collapse in={more}> */}
                <Typography sx={{ mt: 2 }}>Token Name</Typography>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={{ mt: 1 }}
                      placeholder="1-64 Characters"
                    />
                  )}
                />
                <Typography sx={{ mt: 2 }}>Decimals</Typography>
                <Controller
                  name="decimals"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <TextField
                      onChange={(e) => {
                        const value = e.target.value;
                        // If the input is empty, set it to an empty string
                        onChange(value === "" ? NaN : Number(value));
                      }}
                      type="number"
                      {...field}
                      fullWidth
                      sx={{ mt: 1 }}
                      placeholder="number"
                    />
                  )}
                />
                {/* </Collapse> */}

                <Box mt={4}>
                  <Typography variant="h6">Special Features</Typography>
                  <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={burn}
                          onChange={(e) => {
                            e.target.checked
                              ? setValue("burnRate", 0.01)
                              : setValue("burnRate", 0);
                            setBurn(e.target.checked);
                          }}
                        />
                      }
                      label="Burn"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={fee}
                          onChange={(e) => {
                            e.target.checked
                              ? setValue("tradingFee", 0.01)
                              : setValue("tradingFee", 0);
                            setFee(e.target.checked);
                          }}
                        />
                      }
                      label="Creator Commissions"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={mint}
                          onChange={(e) => setMint(e.target.checked)}
                        />
                      }
                      label="Supports Supply Increase"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={team}
                          onChange={(e) => setTeam(e.target.checked)}
                        />
                      }
                      label="Team Allocation"
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={liq}
                          onChange={(e) => setLiq(e.target.checked)}
                        />
                      }
                      label="Liquidity feature"
                    /> */}
                  </FormGroup>
                  {/* {burn ? ( */}
                  <Collapse in={burn}>
                    <BoxRoot>
                      <Grid container alignItems={"center"}>
                        <Grid item xs>
                          <Typography>Burn:</Typography>
                          <Typography variant="caption">
                            This function enables the creator to burn tokens and
                            set a burn percentage on DEX trades and on chain
                            transfers. (max:10%)
                          </Typography>
                        </Grid>
                        <Grid item xs="auto">
                          <Controller
                            name="burnRate"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                              <PercentageText
                                type="number"
                                onChange={(e) => {
                                  let value = e.target.value.trim();
                                  if (value === "") {
                                    onChange("");
                                  } else {
                                    let number_value: number = Number(value);
                                    if (number_value > max) number_value = max;
                                    onChange(
                                      isNaN(number_value) ? NaN : number_value
                                    );
                                  }
                                }}
                                {...field}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                inputProps={{ max }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </BoxRoot>
                  </Collapse>

                  <Collapse in={fee}>
                    <BoxRoot>
                      <Grid container alignItems={"center"}>
                        <Grid item xs>
                          <Typography>Creator Commissions:</Typography>
                          <Typography variant="caption">
                            Specify the percentage sent to creator commissions
                            wallet on any transfer function, including DEX
                            swaps. (max:10%)
                          </Typography>
                        </Grid>
                        <Grid item xs="auto">
                          <Controller
                            name="tradingFee"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                              <PercentageText
                                type="number"
                                onChange={(e) => {
                                  let value = e.target.value.trim();
                                  if (value === "") {
                                    onChange("");
                                  } else {
                                    let number_value: number = Number(value);
                                    if (number_value > max) number_value = max;
                                    onChange(
                                      isNaN(number_value) ? NaN : number_value
                                    );
                                  }
                                }}
                                {...field}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                inputProps={{ max }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </BoxRoot>
                  </Collapse>

                  <Collapse in={mint}>
                    <BoxRoot>
                      <Grid container alignItems={"center"}>
                        <Grid item xs>
                          <Typography>Supports Supply Increase:</Typography>
                          <Typography variant="caption">
                            Allows the creator to issue additional tokens after
                            the token creation
                          </Typography>
                        </Grid>
                        <Grid item xs="auto">
                          {/* <TextField
                sx={{ width: "16ch" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              /> */}
                        </Grid>
                      </Grid>
                    </BoxRoot>
                  </Collapse>
                  <Collapse in={team}>
                    <BoxRoot>
                      <Grid container alignItems={"center"}>
                        <Grid item xs={12}>
                          <Typography>Team Allocation:</Typography>
                          <Typography variant="caption">
                            A percentage of tokens will be allocated to Team
                            Wallet
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container flexDirection={"column"} rowGap={2}>
                            <Controller
                              name="teamAddress"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    fullWidth
                                    label="Team Wallet address"
                                    placeholder={
                                      address || "0x1234567890abcdefghigklmn"
                                    }
                                    {...field}
                                  />
                                </>
                              )}
                            />
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Controller
                                  name="teamAllocationPercentage"
                                  control={control}
                                  render={({
                                    field: { onChange, ...field },
                                  }) => (
                                    <TextField
                                      type="number"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // If the input is empty, set it to an empty string
                                        onChange(
                                          value === "" ? NaN : Number(value)
                                        );
                                      }}
                                      {...field}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            %
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Controller
                                  name="duration"
                                  control={control}
                                  render={({
                                    field: { onChange, ...field },
                                  }) => (
                                    <TextField
                                      type="number"
                                      label="Vesting Duration"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // If the input is empty, set it to an empty string
                                        onChange(
                                          value === "" ? NaN : Number(value)
                                        );
                                      }}
                                      {...field}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            days
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </BoxRoot>
                  </Collapse>
                  <Collapse in={liq}>
                    <BoxRoot>
                      <Grid container alignItems={"center"}>
                        <Grid item xs>
                          <Typography>Liquidity Management Option</Typography>
                          <Typography variant="caption">
                            You can add and remove liquidity with ETH for your
                            token
                          </Typography>
                        </Grid>
                        {/* <Grid item xs="auto">
                          <Controller
                            name="liquidityAllocation"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                              <PercentageText
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // If the input is empty, set it to an empty string
                                  onChange(value === "" ? NaN : Number(value));
                                }}
                                {...field}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid> */}
                      </Grid>
                    </BoxRoot>
                  </Collapse>
                </Box>
              </Root>
            </div>
            <Divider sx={{ my: 4 }} />
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"}>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    minWidth: "10px",
                    display: "inline-block",
                  }}
                  variant="body2"
                >
                  {" "}
                  Service Fees {SERVICE_FEE} ETH
                </Typography>
              </Box>

              <Button
                sx={{ float: "right", minWidth: 160 }}
                variant="contained"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid || isConfirming}
              >
                {" "}
                {isConfirming && (
                  <CircularProgress
                    color="inherit"
                    sx={{
                      width: "20px !important",
                      height: "20px !important",
                      mr: 1,
                    }}
                  />
                )}
                Create a token
              </Button>
            </Box>
          </form>
        </FormRoot>
        {tokens.length > 0 && <MyTokens tokens={tokens} />}
      </FormProvider>
      <Dialog
        open={success && isConfirmed}
        maxWidth="xs"
        onClose={() => setSuccess(false)}
        PaperProps={{
          sx: {
            p: 3,
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 4, right: 4 }}
          onClick={() => setSuccess(false)}
        >
          <CloseIcon />
        </IconButton>
        <img src={successImg} width={160} />
        <Grid container justifyContent={"center"}>
          <Typography textAlign={"center"} mt={2} variant="subtitle1">
            Your token has been successfully created. To view and manage it,
            simply click gear icon <SettingsIcon htmlColor="grey" /> on your
            token in the My Token List section
          </Typography>

          <Typography
            mt={2}
            textAlign={"center"}
            component={"a"}
            href={`${NETWORK}tx/${hash}`}
            target="_blank"
            sx={{ textDecoration: "underline", color: "blue" }}
          >
            Transaction
          </Typography>
        </Grid>
      </Dialog>
      {/* <TransactionDialog /> */}
    </>
  );
};

export default TokenInfoContent;
