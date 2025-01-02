import { useRef, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import { Grid, Typography } from "@mui/material";
type Props = {
  liquidity: number;
  owner: number;
  total: number;
  teamAllocation: number;
};

function Chart({ liquidity, owner, teamAllocation, total }: Props) {
  const chartRef = useRef(null) as any;

  // Creates the chart, this code only runs one time
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        // textType:"curcular",
      })
    );

    var data = [
      {
        country: "Liquidity",
        sales: liquidity,
      },
      {
        country: "Creator",
        sales: owner,
      },
      {
        country: "Team",
        sales: teamAllocation,
      },
      {
        country: "Other",
        sales: total - liquidity - owner - teamAllocation,
      },
    ];
    var filteredData = data.filter((item) => item.sales !== 0);

    // Create series
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "sales",
        categoryField: "country",
        alignLabels: false,
      })
    );

    series.data.setAll(filteredData);

    series.labels.template.setAll({
      fontSize: 12,
      text: "{category}",
      textType: "circular",
      inside: true,
      radius: 10,
      fill: am5.color(0xffffff),
    });
    // // Add legend
    // let legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.percent(50),
    //     x: am5.percent(50),
    //     layout: root.horizontalLayout,
    //   })
    // );

    // legend.data.setAll(series.dataItems);

    chartRef.current = chart;

    return () => {
      root.dispose();
    };
  }, [liquidity, owner, teamAllocation, total]);

  // When the paddingRight prop changes it will update the chart
  //   useLayoutEffect(() => {
  //     chartRef.current.set("paddingRight", props.paddingRight);
  //   }, [props.paddingRight]);

  return (
    <Grid container justifyContent={"center"} mt={4}>
      <Typography variant="subtitle1">Tokenomics</Typography>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography>Creator:</Typography>
        </Grid>
        <Grid item>
          <Typography>{owner}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography>Liquidity:</Typography>
        </Grid>
        <Grid item>
          <Typography>{liquidity}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography>Team:</Typography>
        </Grid>
        <Grid item>
          <Typography>{teamAllocation}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography>Other:</Typography>
        </Grid>
        <Grid item>
          <Typography>{total - liquidity - owner - teamAllocation}</Typography>
        </Grid>
      </Grid>
      <div id="chartdiv" style={{ width: "300px", height: "300px" }}></div>
    </Grid>
  );
}
export default Chart;
