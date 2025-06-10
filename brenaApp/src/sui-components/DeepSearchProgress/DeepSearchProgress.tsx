import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./DeepSearchProgress.scss";
import { brenaAnimPlain } from '../../utils/Base64Files';
import BrenaDeepSearchTm from '../../img/BrenaDeepSearchTm.png';
import { useAppSelector } from "../../store/hooks";

const DeepSearchProgress = (props: any) => {
  const deepSearchProgress: any = useAppSelector(
    (state: any) => state.brena.deepSearchProgress
  );

  return (
    <>
      {deepSearchProgress && deepSearchProgress.Message && (
        <div className="brena-ds-container">
          <div className="brena-ds-icons">
            <img
              src={brenaAnimPlain}
              alt="brena-icon"
              draggable={false}
              className="brena-ds-anim-img"
            />
            <img src={BrenaDeepSearchTm} alt="deep search" draggable={false} className="brena-deep-search-img" />
          </div>
          <div className="brena-ds-label">{deepSearchProgress?.Message}</div>
          <div className="brena-ds-progress-wrapper">
            <CircularProgress
              variant="determinate"
              sx={() => ({
                color: "#4599FF",
                opacity: "0.2",
              })}
              size={100}
              thickness={3}
              value={100}
            />
            <CircularProgress
              variant="determinate"
              sx={(theme: any) => ({
                color: "#1a90ff",
                animationDuration: "550ms",
                position: "absolute",
                left: 0,
              })}
              value={deepSearchProgress?.percentage}
              thickness={3}
              size={100}
            />
            <div className="brena-ds-percentage">{`${Math.round(
              deepSearchProgress?.percentage
            )}%`}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeepSearchProgress;
