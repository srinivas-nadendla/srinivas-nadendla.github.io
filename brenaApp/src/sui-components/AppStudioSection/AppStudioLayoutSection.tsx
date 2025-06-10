import React, { useState, useEffect } from 'react';

import { Box, Typography, Checkbox, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ControlsIcons from '../../img/controls.svg';
import RolesIcon from '../../img/roles.svg';
import WorkflowIcon from '../../img/workflow.svg';
import DataTypesIcon from '../../img/data-type.svg';
import StagesIcon from '../../img/stages.svg';

import { useAppSelector } from '../../store/hooks';
import './AppStudioLayoutSection.scss';
import AppStudiWorkflowDiagram from './AppStudioWorkflowDiagram/AppStudioWorkflowDiagram';

const SortableItem = (props: any) => {
  return (
    <div className="field-item">
      {/* <Checkbox checked></Checkbox> */}
      <Typography variant="subtitle1" className="field-label">{props.field.Label}</Typography>
      <Typography variant="body2" className="field-desc">{props.field.Description}</Typography>
      <div className='field-item_type'><img src={DataTypesIcon} className='field-item_type-img' /> {props.field.Type}</div>
    </div>
  );
};

const AppStudioLayoutSection = () => {
  const appStudioData = useAppSelector((state: any) => state.brena.appStudioData);
  const [collections, setCollections] = useState([]);
  const [roles, setRoles] = useState([]);
  const [eventDefinitionActivities, setEventDefinitionActivities] = useState([]);
  const [uiControlsCount, setUiControlsCount] = useState(0);
  const [stages, setStages] = useState([]);
   const [activeTab, setActiveTab] = React.useState(0);

  useEffect(()=> {
    if (appStudioData?.data?.AppDefinition?.length>0) {
      setCollections(appStudioData?.data?.AppDefinition[0].RecordTypes?.[0]?.MetadataCollections);
      setRoles(appStudioData.data?.AppDefinition[0].ApplicationRoles);
      setEventDefinitionActivities(appStudioData?.data?.AppDefinition[0].RecordTypes?.[0]?.EventDefinitions?.[0]?.WorkflowModel?.[0]?.Activities || []);
      setStages(appStudioData.data.AppDefinition[0].RecordTypes?.[0]?.Stages);
    }
  }, [appStudioData])

  useEffect(()=> {
    let count = 0;
    if (collections?.length > 0) {
      collections.forEach((col: any) => {
        count += col.Fields?.length;
      });
    }
    setUiControlsCount(count)
  },[collections])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="brena-app-studio-metadata-container">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        className="brena-app-studio-tabs"
      >
        <Tab
          icon={<img src={ControlsIcons} width={20} height={20} />}
          aria-label="fields"
        />
        <Tab
          icon={<img src={RolesIcon} width={20} height={20} />}
          aria-label="roles"
        />
        <Tab
          icon={<img src={WorkflowIcon} width={20} height={20} />}
          aria-label="workflow"
        />
        <Tab
          icon={<img src={StagesIcon} width={20} height={20} />}
          aria-label="stages"
        />
      </Tabs>

      {activeTab === 0 && (
        <>
          <div className="brena-app-studio-metadata-container_count-title">
            Suggested {uiControlsCount} UI Controls.
          </div>

          {collections.map((collection: any, idx: any) => (
            <Box key={collection.Id} className="collection-section">
              <div className="collection-section_header">
                <div className="collection-section_header-left">
                  {/* <Checkbox checked></Checkbox> */}
                  <Typography variant="h6" className="collection-title">
                    {collection.Name}
                  </Typography>
                </div>
                <Tooltip
                  title={collection.Description || ""}
                  id="brenaMinimizeBtnTooltip"
                  className="brena-action-btns-tooltip"
                >
                  <InfoIcon color="disabled"></InfoIcon>
                </Tooltip>
              </div>

              <Box className="fields-container">
                {collection.Fields.map((field: any) => (
                  <SortableItem key={field.Id} field={field} />
                ))}
              </Box>
            </Box>
          ))}
        </>
      )}
      {activeTab === 1 && (
        <>
          <div className="brena-app-studio-metadata-container_count-title">
            Suggested {roles.length} Roles.
          </div>
          <div className="brena-app-studio-role-item">
            <div className="brena-app-studio-role-item_title">
              Recommended Roles from the Project
            </div>
          </div>
          {roles.map((role: any) => {
            return (
              <div className="brena-app-studio-role-item" key={role.name}>
                <div className="brena-app-studio-role-item_name">
                  {role.name}
                </div>
              </div>
            );
          })}
        </>
      )}
      {activeTab == 2 && (
        <>
          <AppStudiWorkflowDiagram activities={eventDefinitionActivities} />
        </>
      )}

      {activeTab === 3 && (
        <>        <div className="brena-app-studio-metadata-container_count-title">
          Suggested {stages?.length} Stage{stages?.length === 1 ? "" : "s"}.
        </div>
        {stages.map((stage: any) => {
        return (
          <div className="brena-app-studio-stage-item" key={stage.Id}>
            <div className="brena-app-studio-stage-item_name">{stage.Name}</div>
            <div
              className="brena-app-studio-stage-item_color"
              style={{ backgroundColor: `#${stage.StageColor}` }}
            ></div>
          </div>
        );
      }
      
      )}
      </>
      )}

      
    </Box>
  );
};

export default AppStudioLayoutSection;
