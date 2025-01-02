import { Checkbox, Divider, Grid, Typography } from "@mui/material";
import { GenerateParamType } from "../../../types/generate";
import { Controller, useFormContext } from "react-hook-form";

type Props = {};

const LpForm = (_props: Props) => {
  const { control } = useFormContext<Partial<GenerateParamType>>();

  // const add = watch("liquidityAdd");

  return (
    <>
      <Divider textAlign="left">LP option</Divider>
      <Controller
        name="liquidityAdd"
        defaultValue={true}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <Grid
            className="mt-6"
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item md={3} sm={12} xs={12}>
              <Typography sx={{ textAlign: { md: "right", sm: "left" } }}>
                Liquidity Add
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Checkbox
                // defaultChecked
                checked={value}
                {...field}
                value={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            </Grid>
          </Grid>
        )}
      />
    </>
  );
};

export default LpForm;
