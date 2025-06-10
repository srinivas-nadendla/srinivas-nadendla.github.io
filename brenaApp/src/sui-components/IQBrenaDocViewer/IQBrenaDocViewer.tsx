import { useEffect, memo, useRef } from "react";
import "./IQBrenaDocViewer.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSketchIns,
  setSketchMarkup,
  setSketchPageInfo,
} from "../../store/brenaSlice";

declare global {
  var IQSketchLiteManager: any;
}
interface IQBaseWindowProps {
  imageUrl?: string;
  docViewElementId?: string;
  showToolbar?: boolean;
  sketchData?: any;
  stopFocus?:boolean;
  defaultPageToNavigate?:number;
}

const IQBrenaDocViewer = ({
  imageUrl,
  docViewElementId = "canvasWrapperBrena",
  showToolbar = false,
  sketchData,
  stopFocus = false,
  defaultPageToNavigate = 1
}: IQBaseWindowProps) => {
  const selectedPageNumber: any = useAppSelector((state: any)=> state.brena.selectedPageNumber);
  const sketchPageInfo: any = useAppSelector((state: any)=> state.brena.sketchPageInfo);
  const dispatch = useAppDispatch();
  const docViewRef: any = useRef<any>();
  const isInitial = useRef<any>(false);

  useEffect(() => {
    if (sketchData) {
      renderViewer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sketchData]);

  const renderViewer = () => {
    var wrapperDiv = document.getElementById(docViewElementId);
    if (wrapperDiv?.getAttribute("hasInit")) {
      return;
    }
    wrapperDiv?.setAttribute("hasInit", "true");
    docViewRef.current = new IQSketchLiteManager({
      domElementId: docViewElementId,
      initialconfig: {
        callback: function (eventName: any, args: any) {
          console.log(
            "****IQSketchLiteManager***** - has fired the following event",
            eventName,
            args,
            new Date()
          );
          switch (eventName) {
            case "markupPlaced":
              dispatch(setSketchMarkup(args));
              break;
            case "getMarkupsByPage":
              dispatch(setSketchPageInfo(args));
              break;
          }
        },
        showToolbar: showToolbar,
        appId: "84baee6482c14663ad5efd136e06287e",
        imageUrl: imageUrl,
        currentPage: 1,
        totalCount: sketchData?.length,
        pages: sketchData,
        stopFocus: stopFocus
      }
    });
    dispatch(setSketchIns(docViewRef.current));
    setTimeout(() => {
      docViewRef.current.navigateToPage(selectedPageNumber || 1);
      isInitial.current = true;
    }, 2000);
  };

  useEffect(()=> {
    if (docViewRef?.current && selectedPageNumber && isInitial.current === true) {
      if (sketchPageInfo?.currentPage !== selectedPageNumber) {
        docViewRef.current.navigateToPage(selectedPageNumber);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageNumber])

  return (
    <div className="iq-brena-doc-viewer">
      <div id={docViewElementId} className="canvas-wrapper-cls"></div>
    </div>
  );
};

export default memo(IQBrenaDocViewer);
