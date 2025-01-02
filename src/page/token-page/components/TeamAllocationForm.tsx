import { Controller, useFormContext } from "react-hook-form";
import { GenerateParamType } from "../../../types/generate";
import { Divider, Grid, TextField, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
type Props = {};

const TeamAllocationForm = (_props: Props) => {
  const { control, formState } = useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  return (
    <>
      <Divider textAlign="left">Team & Marketing</Divider>
      <Controller
        name="teamWalletAddress"
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Team Wallet Address
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                label="Team Wallet Address"
                error={!!errors.teamWalletAddress}
                helperText={errors?.teamWalletAddress?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        defaultValue={0}
        name="teamDistributionPercentage"
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Distribution Percentage(%)
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Distribution Percentage"
                error={!!errors.teamDistributionPercentage}
                helperText={errors?.teamDistributionPercentage?.message}
                {...field}
                onChange={(e) => Number(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="unlockTime"
        defaultValue={dayjs(dayjs().format("YYYY-MM-DDTHH:mm"))}
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Unlock Time
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    {...field}
                    onChange={(e: any) => onChange(e)}
                    label="Basic date time picker"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
      />
    </>
  );
};

export default TeamAllocationForm;
