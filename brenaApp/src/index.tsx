import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "../src/store/store";


//document.addEventListener('renderBrenaWidget', () => {
  const root = document.getElementById("BRENDA-AI-ROOT") && ReactDOM.createRoot(
    document.getElementById("BRENDA-AI-ROOT") as HTMLElement
  );
  root ? root.render(
    <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
    </React.StrictMode>
  ): console.log('BRENDA-AI-ROOT is not available in the dom');
//})

