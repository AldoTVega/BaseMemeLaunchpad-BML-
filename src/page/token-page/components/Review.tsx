import { Divider, Grid, Typography } from "@mui/material";
import { GenerateParamType } from "../../../types/generate";

type Props = {
  data: Partial<GenerateParamType>;
};

const Review = ({ data }: Props) => {
  function abbreviateString(str: string, maxLength = 5) {
    if (str.length <= maxLength) {
      return str; //
    }
    const firstPart = str.substring(0, maxLength);
    const lastPart = str.substring(str.length - maxLength);
    return `${firstPart} ... ${lastPart}`;
  }
  return (
    <Grid container justifyContent={"center"}>
      <Grid item md={4} sm={10} xs={10}>
        {Object.keys(data).map((item: any, index) => (
          <>
            <Grid
              key={index}
              container
              justifyContent={"space-between"}
              mt={4}
              alignItems={"center"}
            >
              <Typography variant="h6" textTransform={"capitalize"}>
                {item}
              </Typography>
              <Typography variant="h6">
                {item === "owner"
                  ? abbreviateString(
                      data[item as Partial<keyof GenerateParamType>] as string
                    )
                  : (data[item as Partial<keyof GenerateParamType>] as any)}
              </Typography>
            </Grid>
            <Divider />
          </>
        ))}

        {/* <Grid
          container
          justifyContent={"space-between"}
          mt={4}
          alignItems={"center"}
        >
          <Typography>Owner</Typography>
          <Typography>
            {data.owner ? abbreviateString(data.owner) : ""}
          </Typography>
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default Review;
