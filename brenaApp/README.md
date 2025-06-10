# Client Side Installation(Example of Desktop Application)
## Step-1 (Pre requisite)
This is a react project. This application build output folder need to place in some where in project which need to be added as script tag in application inorder to consume this UI.

 Example:
 
   In Desktop application as part of build script this ouput folder dynamicaly placed in this path
   
    node_modules/@smartapp/commonui/commonjs/brena

## Step-2 (Add a root div to render brena widget)

To consume UI need to create a div with id as "BRENDA-AI-ROOT" and append to application body

  Example:
  
    let brenaAi = document.createElement("div");
    brenaAi.setAttribute("id", "BRENDA-AI-ROOT");
    document.body.appendChild(brenaAi);
    
## Step-3 (Load Brena Script to render the widget)

 Load the brena  script tag , so that brena UI will appear 
 
 Example:
  
    let fileref=document.createElement('script');
    fileref.setAttribute("id", "BRENDA-AI-LIB");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", "node_modules/@smartapp/commonui/commonjs/brena/index.js");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    
## Step-4 (To destroy the Brena Widget)

To hide or destroy the widget , need to remove the div added in step-2 and unload the script add in Step-3

Example:

    document.getElementById("BRENDA-AI-ROOT");
    if (brenaAiRootDiv) {
        brenaAiRootDiv.remove();
    }

    let brenaAiFileScript = document.getElementById("BRENDA-AI-LIB");
    brenaAiFileScript.parentNode.removeChild(brenaAiFileScript);
    
    
 # Other dependent application
 
   Brena AI code availble here make sure this appliaction script should added as script to the application
   
   http://github.iqsmartapp.com/DEV/SAWebComp
   
# Desktop Application Helper Utilities

  For Desktop application integration we have a Helper wrapper CommonUtility.BrenaAIHelper which is availble in this repo.
  It is purely written for Desktop application.
  We can enhance or follow this while to integrate brena to some other application
  
  http://github.iqsmartapp.com/DEV/CommonUI.git
  
  
### Common functions(Can be re used from other application)

#### 1) Load Brena

     CommonUtility.BrenaAIHelper.startBrena({
          launchPoint:"",
                brenaPath:"https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/DesktopClientUI/AppZoneV2/main/node_modules/@smartapp/commonui/commonjs/brena/index.js"
        });
      
#### 2) Precahe Script

     CommonUtility.BrenaAIHelper.cacheLoadBrenaLibrary({
          launchPoint:"",
                brenaPath:"https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/DesktopClientUI/AppZoneV2/main/node_modules/@smartapp/commonui/commonjs/brena/index.js"
        });
 
 


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
