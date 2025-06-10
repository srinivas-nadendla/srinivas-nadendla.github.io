import React, { useState, useEffect } from "react";

import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const PlotlyChat = (props: any) => {
  const [plotData, setPlotData] = useState<any>({});

  useEffect(() => {
    setPlotData(JSON.parse(JSON.stringify(props.plotData)));
  }, [props.plotData]);

  const getPlot = () => {
    return <Plot data={plotData?.data} layout={plotData?.layout || {}} />;
  };

  return <>{plotData?.data?.length && getPlot()}</>;
};
export default PlotlyChat;
