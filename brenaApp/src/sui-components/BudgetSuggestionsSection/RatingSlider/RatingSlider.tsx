import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateBudgetSuggestionsData } from "../../../store/brenaSlice";

const RatingSlider = (props: any) => {
  const [stepperPos, setStepperPos] = useState<any>(0);
  const sliderRef: any = useRef();
  const marks = [
    {
      value: 0,
      label: 1,
    },
    {
      value: 25,
      label: 2,
    },
    {
      value: 50,
      label: 3,
    },
    {
      value: 75,
      label: 4,
    },
    {
      value: 100,
      label: 5,
    },
  ];
  const dispatch = useAppDispatch();
  const influencersData = useAppSelector(
    (state: any) => state.brena.budgetSuggestionData?.influencers
  );
  const budgetSuggestionData = useAppSelector(
    (state: any) => state.brena.budgetSuggestionData
  );

  useEffect(() => {
    setStepperPos((influencersData[props.sliderKey] - 1) * 25);
  }, [influencersData, props.sliderKey]);

  const onSliderChange = (e: any, value: any) => {
    setStepperPos(value);
    dispatch(
      updateBudgetSuggestionsData({
        ...budgetSuggestionData,
        influencers: {
          ...influencersData,
          [props.sliderKey]: value / 25 + 1,
        },
      })
    );
  };

  useEffect(() => {
    if (sliderRef?.current) {
      const activeLabels = sliderRef?.current.querySelectorAll(
        ".MuiSlider-markLabelActive"
      );
      if (activeLabels?.length > 0) {
        for (let i = 0; i < activeLabels?.length - 1; i++) {
          activeLabels[i]?.classList?.remove("is-active");
        }
        activeLabels[activeLabels.length - 1]?.classList?.add("is-active");
      }
    }
  }, [stepperPos]);

  return (
    <Box sx={{ width: 200 }}>
      <Slider
        ref={sliderRef}
        aria-label="SLider"
        value={stepperPos}
        defaultValue={stepperPos}
        step={25}
        marks={marks}
        onChange={(e: any, value: any) => onSliderChange(e, value)}
      />
    </Box>
  );
};

export default RatingSlider;
