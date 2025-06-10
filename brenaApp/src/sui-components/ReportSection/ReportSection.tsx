import React from "react";
import { useAppSelector } from "../../store/hooks";
import PlotlyChat from "./PlotlyChat";

const ReportSection = React.memo((props: any) => {
  const reportData: any = useAppSelector(
    (state: any) => state.brena.reportData
  );

  return (
    <div className="report-section" id="brenaPlotlyChart">
      {reportData?.length > 0 &&
        (reportData || []).map((record: any, index: any) => {
          if (record?.layout && record.data?.length > 0) {
            return (
              <React.Fragment key={"report-plotly-chart-" + index}>
                <PlotlyChat plotData={record}></PlotlyChat>
              </React.Fragment>
            );
          } else {
            return (
              <img src={record.img} alt="report" key={"report-img" + index} />
            );
          }
        })}
    </div>
  );
});
export default ReportSection;
