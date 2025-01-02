import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import InitForm from "./InitForm";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  StepButton,
  Switch,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenerateParamType } from "../../../types/generate";
import { useAccount } from "wagmi";
import TokenomicsForm from "./TokenomicsForm";
import Review from "./Review";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNext from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import RocketIcon from "@mui/icons-material/Rocket";
import MintingDialog from "./MintingDialog";
import SuccessDialog from "./SuccessDialog";
import PaymentForm from "./payment-form/PaymentForm";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background:
        "linear-gradient(94deg, rgba(9,12,155,1) 0%, rgba(48,102,190,1) 38%)",
      // backgroundImage:
      //   "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background:
        "linear-gradient(94deg, rgba(9,12,155,1) 0%, rgba(48,102,190,1) 38%)",
      // backgroundImage:
      //   "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 10,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // backgroundColor: "#3066be",
    background:
      "linear-gradient(180deg, rgba(9,12,155,1) 0%, rgba(48,102,190,1) 61%, rgba(180,197,228,1) 100%)",
    // backgroundImage:
    //   "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    // backgroundColor: "#3066be",
    background:
      "linear-gradient(180deg, rgba(9,12,155,1) 0%, rgba(48,102,190,1) 61%, rgba(180,197,228,1) 100%)",
    // backgroundImage:
    //   "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [payment, setPayment] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<Partial<GenerateParamType>>({
    name: "",
    symbol: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const { address } = useAccount();
  const [mode, setMode] = React.useState<"basic" | "advance">("basic");

  const steps = React.useMemo(() => {
    if (mode === "advance") {
      return ["Basic", "Advance", "Review"];
    } else {
      return ["Basic", "Review"];
    }
  }, [mode]);
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((_step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  // const defaultValues: Partial<GenerateParamType> = {
  //   name: "",
  //   symbol: "",
  //   decimal: 18,
  //   supply: 1000,
  //   maxBuy: 1000,
  //   initialLP: 1000,
  //   mintable: false,
  //   totalSupply: 1000000,
  //   redistributionTax: 0,
  //   liquidityFee: 0,
  //   charityFee: 0,
  //   marketingFee: 0,
  //   burnFee: 0,
  //   teamWalletAddress: "",
  //   teamDistributionPercentage: 0,
  //   unlockTime: dayjs(dayjs().format("YYYY-MM-DDTHH:mm")),
  //   // liquidity
  // };
  const schema = z.object({
    name: z.string().nonempty("You must enter token name"),
    symbol: z.string().nonempty("You must enter token symbol"),
  });
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      liquidityAdd: true,
      mintable: false,
    },
    resolver: zodResolver(schema),
  });
  const { handleSubmit, watch, reset } = methods;
  const form = watch();
  const onSubmit = async (data: Partial<GenerateParamType>) => {
    //@ts-ignore
    if (form?.unlockTime) {
      //@ts-ignore
      form.unlockTime = form.unlockTime.toDate().toLocaleString();
    }
    let temp: any = form;

    temp.owner = address ? address : "";

    data.owner = address ? address : "";
    setInfo(temp);
    if (completedSteps() === totalSteps() - 1) {
      try {
        temp.mode = mode;
        setInfo(temp);
        setPayment(true);
        // const res = await generateContract(temp as GenerateParamType);
        // setLoading(false);
        // setUrl(res.data.url);
        // setOpen(true);
      } catch (error) {
        setLoading(false);
        setError("Deploy failed");
      }
    } else {
      handleComplete();
    }
  };
  const handleSuccess = (url: string) => {
    setLoading(false);
    setUrl(url);
    setOpen(true);
  };
  const handleError = () => {
    setLoading(false);
    setError("Deploy failed");
  };
  const handleLoading = () => {
    setLoading(true);
  };

  // const handleGenerate = async() => {
  //   try {

  //   } catch (error) {

  //   }
  // }
  // const { errors } = formState;
  return (
    <>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <FormControlLabel
          control={
            <Switch
              onChange={() => {
                setCompleted({});
                setActiveStep(0);
                reset();
                setMode((m) => (m === "advance" ? "basic" : "advance"));
              }}
            />
          }
          label="Mode"
        />
        <Stepper
          alternativeLabel
          nonLinear
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {/* {label} */}
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <Stack spacing={4} mt={4}>
        <Grid container justifyContent="center">
          {!address && (
            <Alert severity="error">
              <Typography>Please connect your wallet</Typography>
            </Alert>
          )}
          {error && (
            <Alert severity="error">
              <Typography>{error}</Typography>
            </Alert>
          )}
        </Grid>
        <FormProvider {...methods}>
          {mode === "advance" ? (
            <>
              {activeStep === 0 && <InitForm />}
              {activeStep === 1 && <TokenomicsForm />}
              {activeStep === 2 && <Review data={info} />}
            </>
          ) : (
            <>
              {activeStep === 0 && <InitForm />}

              {activeStep === 1 && <Review data={info} />}
            </>
          )}

          {/* <Grid container justifyContent={"center"} className="mt-6">
            <Button variant="contained">Next</Button>
          </Grid> */}
          <div>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography> */}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    variant="contained"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    startIcon={<ChevronLeftIcon />}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                    endIcon={<NavigateNext />}
                  >
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        sx={{ display: "inline-block" }}
                      >
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : completedSteps() === totalSteps() - 1 ? (
                      <Button
                        startIcon={<RocketIcon />}
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Launch
                      </Button>
                    ) : (
                      <Button
                        startIcon={<CheckCircleIcon />}
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Complete
                      </Button>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </FormProvider>
      </Stack>
      <MintingDialog open={loading} />
      <SuccessDialog open={open} handleClose={() => setOpen(false)} url={url} />
      <PaymentForm
        handleLoading={handleLoading}
        handleError={handleError}
        handleSuccess={handleSuccess}
        info={info}
        handleClose={() => setPayment(false)}
        open={payment}
      />
    </>
  );
}
