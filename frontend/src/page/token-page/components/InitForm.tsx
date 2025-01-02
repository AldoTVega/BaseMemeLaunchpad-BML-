import { Controller, useFormContext } from "react-hook-form";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { GenerateParamType } from "../../../types/generate";
import AbcIcon from "@mui/icons-material/Abc";
import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";
import Looks3Icon from "@mui/icons-material/Looks3";
const InitForm = () => {
  const { control, formState } = useFormContext<Partial<GenerateParamType>>();
  const { errors } = formState;

  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <Typography variant="h6">Token Info</Typography>
      </div>
      <Controller
        name="name"
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
                Name
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                label="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                {...field}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <AbcIcon />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="symbol"
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
                Symbol
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                label="symbol"
                error={!!errors.symbol}
                helperText={errors?.symbol?.message}
                {...field}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <EuroSymbolIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        )}
      />
      <Controller
        name="decimal"
        defaultValue={18}
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
                Decimal
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Looks3Icon />
                    </InputAdornment>
                  ),
                }}
                type="number"
                label="decimal"
                error={!!errors.decimal}
                helperText={errors?.decimal?.message}
                {...field}
                fullWidth
                required
                onChange={(e) => onChange(Number(e.target.value))}
              />
            </Grid>
          </Grid>
        )}
      />
    </>
  );
};

export default InitForm;
