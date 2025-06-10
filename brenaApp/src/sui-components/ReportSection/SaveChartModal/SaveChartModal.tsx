import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, InputLabel } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import "./SaveChartModal.scss";
import { updateOpenSaveReportModal, updateShowSnackbar } from "../../../store/brenaSlice";
import { getBaseUrl, isTabletApp } from "../../../utils/CommonUtil";
import html2canvas from "html2canvas";
import { useDetectDevice } from "../../../hooks/useDetectDevice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const SaveChartModal = () => {
  const [open, setOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [chatApiCalled, setChatApiCalled] = useState(false);
  const openSaveReportModal = useAppSelector(
    (state) => state.brena.openSaveReportModal
  );
  const reportData: any = useAppSelector(
    (state: any) => state.brena.reportData
  );
  const graphStorageData: any = useAppSelector(
    (state: any) => state.brena.graphStorageData
  );
  const breadCrumbsData = useAppSelector(
    (state: any) => state.brena.breadCrumbsData || []
  );

  const dispatch = useAppDispatch();
  const device = useDetectDevice();

  useEffect(() => {
    setOpen(openSaveReportModal);
  }, [openSaveReportModal]);

  const handleClose = () => {
    setOpen(false);
    dispatch(updateOpenSaveReportModal(false));
    setReportName('');
  };

  const showErrorMsg = ()=> {
    dispatch(
      updateShowSnackbar({
        open: true,
        msg: "Failed to save chart.",
      })
    );
    setTimeout(() => {
      dispatch(updateShowSnackbar({ open: false, msg: "" }));
    }, 3000);
  }

  const getBase64Img = async ()=> {
    let chartParentElem: any = document.getElementById("brenaPlotlyChart");
    if (chartParentElem) {
      let plotlyCHartEle: any =
        chartParentElem.querySelector(".js-plotly-plot");
      const canvas = await html2canvas(plotlyCHartEle);
      return canvas.toDataURL("image/png", 1.0);
    }
  }

  const getMappingOfArea = (areaName: any) => {
    if (areaName === "Time") {
      return "Time Log";
    } else if(areaName === 'Estimate') {
      return "Estimates";
    } else if(areaName === 'Forecast') {
      return "Forecasts";
    } else if (areaName === 'Current Board') {
      if (breadCrumbsData?.[1]?.type === 'board_dispatch') {
        return 'Dispatch Boards';
      } 
      return 'High Level Plan Boards';
    } else if (areaName === 'Schedule') {
      return "CPM Schedules"
    }
    return areaName;
  };

  const handleSave = async () => {
    let baseUrl = getBaseUrl();
    const endpoint = baseUrl + '/EnterpriseDesktop/Analytics/Dashboard.iapi/Chart';
    let ctxObj: any = {};
    if (device === 'brena-mobile' || isTabletApp()) {
      ctxObj = IQMobile?.BrenaAIHelper?.getAreaAndContext()?.ctx?.ui?.display || {};
    } else {
      ctxObj = CommonUtility?.BrenaAIHelper?.getAreaAndContext()?.ctx?.ui?.display || {};
    }
    
    const base64Img: any = await getBase64Img();
    let analyticsAreaName: any = ctxObj?.sub_type ? ctxObj.sub_type : ctxObj.type;
    let payload: any = {
      createdFrom: analyticsAreaName,
      name: reportName,
      type: 1,
      thumbnailStorage: base64Img,
     data: reportData || [],
      //data: reportData[0] || {},
      graphStorage: Array.isArray(graphStorageData?.data) ? graphStorageData.data: [graphStorageData.data]
    }
    if (analyticsAreaName?.includes(':')) {
      const splitArr = analyticsAreaName?.split(':');
      analyticsAreaName = splitArr[0];
      payload.createdFrom = analyticsAreaName;
      payload.launchHierarchy = JSON.stringify({
        id: ctxObj?.sub_type_id,
        name: splitArr[1],
      });
    }
    if (!analyticsAreaName) {
      if (breadCrumbsData?.length === 1) {
        analyticsAreaName = breadCrumbsData[0].name;
      } else if(breadCrumbsData?.length > 1) {
        analyticsAreaName = breadCrumbsData[1].name; 
      }
    }
    if (analyticsAreaName) {
      payload.createdFrom = getMappingOfArea(analyticsAreaName)
    }
    setChatApiCalled(true);
    
    fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    })
      .then((res: any) => res.json())
      .then((res) => {
        if (res.success) {
          handleClose();
          dispatch(
            updateShowSnackbar({
              open: true,
              msg: "Chart is saved & can be accessed from dashboard",
            })
          );
          setTimeout(() => {
            dispatch(updateShowSnackbar({ open: false, msg: "" }));
          }, 3000);
        } else {
          handleClose();
          showErrorMsg();
        }
      })
      .catch(()=> {
        handleClose();
        showErrorMsg();
      }).finally(()=> setChatApiCalled(false));
  };

  const handleOnChange = (e: any) => {
    setReportName(e.target.value);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        className="save-chart-modal"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <img alt="Chart" className="chart-brena-cls" src="data:image/png;base64,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" />
          <span className="save-chart-text">Save Chart</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <InputLabel>Chart Name</InputLabel>
          <img alt="Chart Name" className="chart-textfield-cls" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAABmJLR0QA/wD/AP+gvaeTAAABVklEQVQ4ja3UsUtbURTH8U/SDGqrdhIUQenSUah0sIPg0FXQReggBekfIQUDLp3ari6ORShdROik6FARBAX/AKWlaHUtUVKwpkNO4jXkUTU5cHjn/s6533PvebwHo+GtWBc+oB8q4a1YMRhb7QAOohSM8f8Be28BXIn9KzUhC9iJ71jDUAbsBa5wkdZkAReSXAlv0ZHk89iLfDG0zCsP4jz0jaTmCFNRMxfaD9W3/AD7WcBPoX2O9QQOktp1nEY8EzVvapxG4JjruQw3XHEWZ8meb8ihB7+aAfPYjfViaM8x73p+j/ERZTwL7X3KSYGvI/6Jh9F9J7RDTCcn7ovnU/xpBuzGScSvong2ydd8EyMJ+GtDvh68i+d2nOwRjpsAK7jEUkbDelDG35iZpMFd/cZiOWBPokFLwN/i94PVe8IqhWS4XzCAl5h0T8vVjtkuK6h+4G2zfwgzpuzXFhPcAAAAAElFTkSuQmCC" />
          <TextField
            fullWidth
            // InputProps={{
            //     startAdornment: (
            //         <InputAdornment position="start">
            //             <MonetizationOnRoundedIcon  />

            //         </InputAdornment>
            //     )
            // }}
            name="reportName"
            variant="standard"
            value={reportName}
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClose}
            className="save-chart-modal_cancel-btn"
          >
            CANCEL
          </Button>
          {(reportName?.length === 0 || chatApiCalled) ? (
            <Button
              disabled
              variant="contained"
              className="save-chart-modal_save-btn"
            >
              SAVE CHART
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSave}
              className="save-chart-modal_save-btn"
            >
              SAVE CHART
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default SaveChartModal;
