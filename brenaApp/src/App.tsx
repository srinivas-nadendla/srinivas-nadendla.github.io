import "./App.scss";
import SUIChatBot from "./feature/ChatBot";
import SaveChartModal from "./sui-components/ReportSection/SaveChartModal/SaveChartModal";
import React, { useEffect } from "react";

const App = React.memo(() => {
 
  

  useEffect(()=> {
    console.log('Brena UI Rendered');
    const brenaEle: any = document.getElementsByClassName('common-widget-dlg');
    if (brenaEle?.length > 0) {
      document.body.removeChild(brenaEle[0]);
    }
  }, [])

  return (
    <>
      <div className="App">
        <header className="App-header">
          <SUIChatBot></SUIChatBot>
        </header>

        <SaveChartModal></SaveChartModal>
      </div>
    </>
  );
});

export default App;
