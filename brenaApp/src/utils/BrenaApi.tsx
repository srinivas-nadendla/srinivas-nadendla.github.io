
  import { getDeviceName, isTabletApp } from "./CommonUtil";

  declare global {
    var GBL: any;
  }

export const fetchSpecBookPages = async (payload: any) => {
    const device = getDeviceName();
	let response;
	let appInfo: any = {
        uniqueId: '',
        sessionId: '',
        hostUrl: ''
    };
    if (window?.location?.host) {
      appInfo.hostUrl = window.location.protocol + "//" + window.location.host;
    } else {
      try {
        appInfo.hostUrl = getIQMobileApp()?.GetServerRootUrl();
      } catch (err) {}
    }
    if (device === "brena-mobile" || isTabletApp()) {
      try {
        appInfo.sessionId = getIQMobileApp()?.GetCurrentSessionId();
        appInfo.uniqueId = getIQMobileApp().GetCurrentProject()?.projectUId;

      } catch (err) {}
    } else {
      if (GBL && GBL.dashman && GBL.dashman.getSessionId()) {
        appInfo.sessionId = GBL.dashman.getSessionId();
      }
      if (GBL && GBL.config?.currentProjectInfo?.projectUniqueId) {
        appInfo.uniqueId = GBL.config.currentProjectInfo.projectUniqueId;
      }
    }
        
    response = await fetch(
        `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/specbook/pages/${payload.id}?sessionId=${appInfo?.sessionId}`
    );
    if(!response.ok) {
        const message = `API Request Error in Brena ${response.status}`;
        throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.pages || [];
};