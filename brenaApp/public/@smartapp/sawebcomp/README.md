# Run locally

Install dependencies and generate output files (/dist). 

Open a command prompt:
```Batchfile
npm install
npx webpack
```

Open one of the test pages, located in the test folder


# Publishing

Install dependencies and generate output files (/dist). 

Open a command prompt:
```Batchfile
npm install
npx webpack
npx browserslist@latest --update-db
npm version patch
npm publish
```

Then push (git)


# Client

The client library can be referenced as a static include or used as module in a `node`/`browserify` build.

As static include:
```HTML
<script src="dist/sketch/index.js"></script>
```

# APIs


## UserLocations

#### UserLocations constructor

```JavaScript
    // NOTE: only create one instance of UserLocations in page
    const userLocationAPI = new saWebComp.anlyticsTagNs.UserLocations();
```

#### UserLocations configuration

```JavaScript
    userLocationAPI.config(projectInfo, sessionJwt, zoneUrl);
    
    //**************************************************
    // examples:

    // projectInfo: object with
    //     projectId: long, the Project Folder Id (ProjectSmartFolderBase object) and not the PMO.
    let projectInfo = {projectId: 2329871};

    // zoneUrl: protocol and domain name
    // https://1a9d0c29d3b54c879c1158509005e7ea.smartappbeta.com
    let zoneUrl = IQLiveLinkRealTimeHelper.getSiteOriginUrl();

    // example function, as used in enterprisedesktop
    function sessionJwt(callBack) {
        const requestUrl = Ext.String.format("{0}/Enterprisedesktop/RealTime/IQEditor/GenerateRTAPIJwtToken", zoneUrl);
        IQLiveLinkRealTimeHelper.generateRequestByUrl(requestUrl, 'GET', {}, function (token) {
            callBack(token);
        }, function () {
            callBack(null);
        });
    }

    userLocationAPI.config(projectInfo, sessionJwt, zoneUrl);
```

#### `getHoverMarkupData`


```JavaScript
    userLocationAPI.getHoverMarkupData(userLongId, userGlobalId).then((analyticsData)=>{ ... });

    //**************************************************
    // examples:
    // user globalid (guid), for users w\o globalid, either omit userGlobalId param OR send an empty guid "00000000-0000-0000-0000-000000000000"
    let userGlobalId = "99db2dbd-3970-4816-a765-3c5707647ada";
    // user zone id (big int)
    let userLongId = 1054;

    // fetch data for the user analytics hover (tooltip)
    userLocationAPI.getHoverMarkupData(userLongId, userGlobalId).then((analyticsData)=>{
        let strData = JSON.stringify(analyticsData);

        let parentElem;  

        const analyticsDOMElm = document.createElement("sa-user-analytics-tag");
        analyticsDOMElm.setAttribute('data-json', strData);

        // There are 4 ways to render the hover:
        //  1- show as dialog, passing top/left coordinates
        //  2- show as dialog, relative to another element
        //  3- appending directly to DOM
        //  4- as html string


        // 1- show as dialog, passing top/left coordinates
        analyticsDOMElm.showAt({top: 200, left: 600});
        // can also pass optional config and get notified when dialog closes
        analyticsDOMElm.showAt({top: 300, left: 800}, {onClose:function(){/* ... */}});


        // 2- show as dialog, relative to anchor elem
        analyticsDOMElm.showAt(anchorElem);


        // 3- appending directly to DOM 
        parentElem = document.querySelector(".hover-container");  
        parentElem.appendChild(analyticsDOMElm);


        //  4- as html string
        parentElem = document.querySelector(".hover-container");  
        parentElem.innerHtml = "<sa-user-analytics-tag data-json='" + htmlEncode(strData) + "'>"

    });
```




## ItemLocations

#### ItemLocations constructor

```JavaScript
    // NOTE: only create one instance of ItemLocations in page
    const itemLocationAPI = new saWebComp.anlyticsTagNs.ItemLocations();
```

#### ItemLocations configuration

Call after page loads, do not wait until functionality is 'enabled' by the user in UI.
Normally called once (similar to constructor), unless `dispose` is first called.
This method is use to cache data in backend, no data is loaded into UI until its needed.

```JavaScript
    itemLocationAPI.config(projectInfo, rootLocationId, sessionJwt, zoneUrl, dataType)

    //**************************************************
    // examples:

    // projectInfo: object with
    //     projectId: long, the Project Folder Id (ProjectSmartFolderBase object) and not the PMO.
    //     startDate/finishDate:
    //          The startDate should be the date the project was created, finishDate = createdDate + 1year.
    //          Should be a local date (local to the project time zone).
    //          If sent as string, formatted as:  "2008-10-31T01:00:00"
    //             Example generating string date in c#: date.ToString("s")
    let projectInfo = {projectId: 2329871, startDate:"2021-07-01T08:00:00", finishDate: "2023-12-01T17:00:00"};

    // main location id (long) for the file/drawing (example: "floor" location for skech, "building" for BIM)
    let rootLocationId = 3;

    // example function, as used in sketch
    const sessionJwt = (callBack)=>{
        IQEditorRealTimeManager.generateRTAPIJwt(false, callBack);
    };

    // zoneUrl: protocol and domain name   
    let zoneUrl = "https://1a9d0c29d3b54c879c1158509005e7ea.smartappbeta.com/";

    // type of data to display (optional)
    let dataType = "item" //  "item" OR "rtls", can also be set/changed with setDataType()

    itemLocationAPI.config(projectInfo, rootLocationId, sessionJwt, zoneUrl, dataType);
```

#### `change` event

The `change` event callback is invoked with one parameter: an object of ids of the changed locations (along with the new percent value).
The event only fires after the `getPercentByLocation` is called (at least once) and only if there are changes to the percent values of the locations. 


```JavaScript
    // change event handler
    itemLocationAPI.on('change', onChangeHandler);
```

#### `getPercentByLocation`

Call to get percentages for all locations in the file/drawing.

```JavaScript
    itemLocationAPI.getPercentByLocation(locationIds)

    //**************************************************
    // examples:

    // locationIds is optional
    let locationIds = [2,3,4]; // all location ids in file/drawing 
    itemLocationAPI.getPercentByLocation(locationIds).then((percentByLocation)=>{
        let loc1PercentVal = percentByLocation[2];
        let loc2PercentVal = percentByLocation[3];
        ...
    });
```


#### `getHoverMarkupData`


```JavaScript
    itemLocationAPI.getHoverMarkupData(locationId).then((analyticsData)=>{ ... });

    //**************************************************
    // examples:

    // location long id (typically the room or the floor id)
    let locationId = 4; 

    // fetch the data used by the item analytics hover (tooltip)
    itemLocationAPI.getHoverMarkupData(locationId).then((analyticsData)=>{
        let strData = JSON.stringify(analyticsData);

        let parentElem;  

        const analyticsDOMElm = document.createElement("sa-analytics-tag");
        analyticsDOMElm.setAttribute('data-json', strData);

        // There are 4 ways to render the hover:
        //  1- show as dialog, passing top/left coordinates
        //  2- show as dialog, relative to another element
        //  3- appending directly to DOM
        //  4- as html string


        // 1- show as dialog, passing top/left coordinates
        analyticsDOMElm.showAt({top: 200, left: 600});
        // can also pass optional config and get notified when dialog closes
        analyticsDOMElm.showAt({top: 300, left: 800}, {onClose:function(){/* ... */}});

        // 2- show as dialog, relative to anchor elem
        analyticsDOMElm.showAt(anchorElem);


        // 3- appending directly to DOM 
        parentElem = document.querySelector(".hover-container");  
        parentElem.appendChild(analyticsDOMElm);


        //  4- as html string
        parentElem = document.querySelector(".hover-container");  
        parentElem.innerHtml = "<sa-analytics-tag data-json='" + htmlEncode(strData) + "'>"
    });
```

#### `setOptions` percentType and filters 

After calling `setOptions`, both `getPercentByLocation` and `getHoverMarkupData` will return the "filtered" results.


```JavaScript
    itemLocationAPI.setOptions(percentType, filterSettings)

	//**************************************************
	// examples:

    let percentType = "earnedvalue"; // "earnedvalue" OR "work"
    // pass in ids array all selected filter menu items (id as returned by getFilterOptions)
    let filterSettings = {"ids": ["usersFilter.015908fd-f1b3-4e0e-b602-5b032e6a3911", "tradeFilter.unassignedtrade_id", "statusFilter.verified"]};

    itemLocationAPI.setOptions(percentType, filterSettings);

```


#### `getFilterOptions`

Fetch the filter menu (sub menu) items.

```JavaScript
    itemLocationAPI.getFilterOptions()

    //**************************************************
    // examples:

    itemLocationAPI.getFilterOptions().then(function(result) {
        // build filter menus (ui)
    });

    // example "result" object
    //  NOTE:
    //   the "status" result has a "spacer" menu item, with id of "-"	
    {
        "users": {
          "all": [
            {"id": "usersFilter.unassigned_id", "name": "Unassigned", "color": "#b39999"},
            {"id": "usersFilter.470ccdd2-e3ec-4c39-8704-c1be9d53d9e7", "name": "Chamorro,Jaime", "color": "#FF0000" },
            {"id": "usersFilter.116b4790-a038-4e38-ba05-232606ad2c15", "name": "Sam,Spade", "color": "#1B5E20" }
          ]
        },
        "companies": {
          "all": [
            {"id": "companiesFilter.unassignedcompany_id", "name": "Unassigned", "color": "#b39999"},
            {"id": "companiesFilter.89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "#21042f"},
            {"id": "companiesFilter.0d688a6b-bc90-4fc8-8016-0e185c897663", "name": "No Company", "color": "#FF0000"},
            {"id": "companiesFilter.03304ee2-b151-4f74-aa40-6422ef214a64", "name": "Smartapp", "color": "#FF0000"}
          ]
        },
        "trades": {
          "all": [
            {"id": "tradeFilter.unassignedtrade_id", "name": "Unassigned", "color": "#b39999"},
            {"id": "tradeFilter.32584fbf-e4c1-47e6-adc4-910378c75869", "name": "Architectural", "color": "#2E7D32"},
            {"id": "tradeFilter.5fe230a5-a0a2-4387-b7fb-33863475b0a8", "name": "Carpentry", "color": "#51927E"},
            {"id": "tradeFilter.c1bcd4ec-bc5d-4979-8acc-c062d7ce10bf", "name": "Pipefitter", "color": "#FFFAC8"}
          ]
        },
        "status": {
          "all": [
            {"id": "statusFilter.inPlanning", "name": "In Planning"},
            {"id": "statusFilter.notStarted", "name": "Not Started"},
            {"id": "statusFilter.needsAttention", "name": "Needs Attention"},
            {"id": "-","name": "-"},
            {"id": "statusFilter.overdue", "name": "Overdue"},
            {"id": "statusFilter.duetoday", "name": "Due today"}
          ]
        },
        "rollups": {
          "all": [
            {"id": 'rollupFilter.unset_id', "name": 'None'},
            {"id": 'rollupFilter.a2ca7a34-8630-4c74-8050-544875199550', "name": 'rollup1'},
            {"id": 'rollupFilter.23a0f080-94f3-4801-8d09-5645d7735678', "name": 'rollup tag2'}
          ]
        }
    }
```


#### `setDataType`

Set the type of data to display (item OR rtls).
If `setDataType` is not called, ItemLocationAPI dataType defaults to "item".
dataType can also be set in the [config method](#itemLocations-configuration) (optionally).

```JavaScript
    itemLocationAPI.setDataType(dataType);

    //**************************************************
    // examples:
    // type of data to display
    let dataType = "item" //  "item" OR "rtls"
    itemLocationAPI.setDataType(dataType);
```


#### `getLinearLocationItems`

Fetch items in linear location (matching filterArgs)

```JavaScript
    itemLocationAPI.getLinearLocationItems(locationId, filterArgs);

    //**************************************************
    // examples:

    // set locationId to the linear segment name.
    let locationId = "segmentA";

    // filterArgs ids array contains select filter menus (the id is returned in getFilterOptions)
    let filterArgs = {ids: ["tradeFilter.unassignedtrade_id", ...]};

    itemLocationAPI.getLinearLocationItems(locationId,filterArgs).then((result)=>{

    });
```


#### `dispose`

Closes server connections, unload data and unregisters event listeners.

```JavaScript
    itemLocationAPI.dispose();

    //**************************************************
    // examples:
    itemLocationAPI.dispose();
```




### Security


#### Authorization

A JWT token is used to authorize web requests.
It can be a function a url or a string.

As a function (recommended):
```JavaScript
    let sessionJwt = function(clb){
        // Call server and fetch the user JWT token.
        // Typically the web server uses a session (cookie) to determine the current user and generate the token.
        clb('eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...');
    } 


    itemLocationAPI.config(projectInfo, rootLocationId, sessionJwt, zoneUrl, dataType);
```
