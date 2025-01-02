import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { GenerateParamType } from "../../../types/generate";
import TeamAllocationForm from "./TeamAllocationForm";
import LpForm from "./LpForm";

type Props = {};

const TokenomicsForm = (_props: Props) => {
  const { control, formState, watch } =
    useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  const mintable = watch("mintable");

  const theme = useTheme();
  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <Typography variant="h6">Tokenomics</Typography>
      </div>
      <Controller
        name="supply"
        defaultValue={1000000}
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
                Initial Supply
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="supply"
                error={!!errors.supply}
                helperText={errors?.supply?.message}
                {...field}
                fullWidth
                required
                onChange={(e) => onChange(Number(e.target.value))}
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="maxBuy"
        defaultValue={1000000}
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
                Max Transaction Amount
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="max buy"
                error={!!errors.maxBuy}
                helperText={errors?.maxBuy?.message}
                {...field}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      />
      {/* <Controller
        name="initialLP"
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
                Initial LP
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                type="number"
                label="Initial LP"
                error={!!errors.initialLP}
                helperText={errors?.initialLP?.message}
                {...field}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}
      /> */}
      <Controller
        name="mintable"
        defaultValue={true}
        control={control}
        render={({ field }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="mintable"
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}></Grid>
          </Grid>
        )}
      />
      {mintable && (
        <>
          <Controller
            name="totalSupply"
            control={control}
            defaultValue={1000000}
            render={({ field }) => (
              <Grid
                className="mt-6"
                container
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Grid item md={3} sm={12} xs={12}>
                  <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                    Total Supply
                  </Typography>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    type="number"
                    label="Total Supply"
                    error={!!errors.totalSupply}
                    helperText={errors?.totalSupply?.message}
                    {...field}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            )}
          />
        </>
      )}
      <Divider textAlign="left">Taxes & Fees </Divider>
      <Box
        sx={{
          padding: 6,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 6,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            px: 2,
            background: theme.palette.background.paper,
            top: -14,
            left: 30,
          }}
        >
          <Typography>Buy</Typography>
        </Box>
        <Controller
          name="buyMarketingFee"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, ...field } }) => (
            <Grid
              className="mt-6"
              container
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Grid item md={3} sm={12} xs={12}>
                <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                  Marketing Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Marketing Fee(%)"
                  error={!!errors.buyMarketingFee}
                  helperText={errors?.buyMarketingFee?.message}
                  {...field}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
        <Controller
          name="buyDevelopmentFee"
          defaultValue={0}
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
                  Development Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Development Fee(%)"
                  error={!!errors.buyDevelopmentFee}
                  helperText={errors?.buyDevelopmentFee?.message}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  {...field}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
        <Controller
          name="buyLiquidityFee"
          defaultValue={0}
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
                  Liquidity Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Liquidity Fee(%)"
                  error={!!errors.buyLiquidityFee}
                  helperText={errors?.buyLiquidityFee?.message}
                  {...field}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
      </Box>
      <Box
        sx={{
          padding: 6,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 12,
          position: "relative",
        }}
      >
        {" "}
        <Box
          sx={{
            position: "absolute",
            px: 2,
            background: theme.palette.background.paper,
            top: -14,
            left: 30,
          }}
        >
          <Typography>Sell</Typography>
        </Box>
        <Controller
          name="sellMarketingFee"
          defaultValue={0}
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
                  Marketing Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Marketing Fee(%)"
                  error={!!errors.sellMarketingFee}
                  helperText={errors?.sellMarketingFee?.message}
                  {...field}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
        <Controller
          name="sellDevelopmentFee"
          defaultValue={0}
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
                  Development Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Development Fee(%)"
                  error={!!errors.sellDevelopmentFee}
                  helperText={errors?.sellDevelopmentFee?.message}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  {...field}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
        <Controller
          name="sellLiquidityFee"
          defaultValue={0}
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
                  Liquidity Fee(%)
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  type="number"
                  label="Liquidity Fee(%)"
                  error={!!errors.sellLiquidityFee}
                  helperText={errors?.sellLiquidityFee?.message}
                  onChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                  {...field}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        />
      </Box>
      <TeamAllocationForm />
      <LpForm />
    </>
  );
};

export default TokenomicsForm;
