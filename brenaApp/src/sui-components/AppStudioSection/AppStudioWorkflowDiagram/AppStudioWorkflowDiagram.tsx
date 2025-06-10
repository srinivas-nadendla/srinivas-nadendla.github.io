import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  EdgeLabelRenderer,
  BaseEdge,
  getBezierPath
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { AppStudioWorkflowIcons, getBaseUrl } from '../../../utils/CommonUtil';

const nodeWidth = 150;
const nodeHeight = 40;
const placeholderNodeColor = '#f5f5f5';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getIconPath = (iconType: any) => {
  return getBaseUrl() + AppStudioWorkflowIcons[iconType];
};

const getLayoutedElements = (activities: any) => {
  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 100,
    marginx: 25,
    marginy: 25,
  });

  const nodesMap: any = new Map();
  const edges: any[] = [];
  const placeholderNodes: any[] = [];
  const transitionCountMap = new Map();

  // Counting how many transitions exist from a source to a target
  activities.forEach((activity: any) => {
    (activity.Transitions || []).forEach((transition: any) => {
      const key = `${activity.Id}_${transition.LinkedActivityId}`;
      const count = transitionCountMap.get(key) || 0;
      transitionCountMap.set(key, count + 1);
    });
  });

  //  Building nodes and placeholder nodes
  activities.forEach((activity: any) => {
    dagreGraph.setNode(activity.Id, { width: nodeWidth, height: nodeHeight });

    const nodeData = {
      id: activity.Id,
      data: {
        label: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={getIconPath(activity.Type)} alt="" width={20} height={20} />
            <div style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center',
              padding: '0.5rem',
              fontSize: '10px'
            }}>
              {activity.Name}
            </div>
          </div>
        ),
      },
      position: { x: 0, y: 0 },
      style: {
        minWidth: nodeWidth,
        minHeight: nodeHeight,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#059cdf',
        padding: '8px',
      },
      type: 'default',
      draggable: false,
    };

    nodesMap.set(activity.Id, nodeData);
  });

  // Add edges, and create placeholder nodes for duplicates
  const transitionCounterPerTarget: any = {};

  activities.forEach((activity: any) => {
    (activity.Transitions || []).forEach((transition: any) => {
      const baseKey = `${activity.Id}_${transition.LinkedActivityId}`;
      transitionCounterPerTarget[baseKey] = (transitionCounterPerTarget[baseKey] || 0) + 1;

      const isFirst = transitionCounterPerTarget[baseKey] === 1;
      const edgeId = `${activity.Id}-${transition.LinkedActivityId}-${transitionCounterPerTarget[baseKey]}`;

      let targetId = transition.LinkedActivityId;

      if (!isFirst) {
        // Create placeholder
        targetId = `${transition.LinkedActivityId}__placeholder__${activity.Id}__${transitionCounterPerTarget[baseKey]}`;
        dagreGraph.setNode(targetId, { width: nodeWidth, height: nodeHeight });

        placeholderNodes.push({
          id: targetId,
          data: {
            label: nodesMap.get(transition.LinkedActivityId)?.data.label,
          },
          position: { x: 0, y: 0 },
          style: {
            ...nodesMap.get(transition.LinkedActivityId)?.style,
            backgroundColor: placeholderNodeColor,
            border: '1px dashed #ccc',
          },
          type: 'default',
          draggable: false,
        });
      }

      dagreGraph.setEdge(activity.Id, targetId);

      edges.push({
        id: edgeId,
        source: activity.Id,
        target: targetId,
        type: 'custom',
        data: {
          outcome: transition.Outcome,
          stageName: transition.StageName,
        },
        animated: true,
        style: { stroke: '#555' },
       markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#333'
      }
      });
    });
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = [...nodesMap.values(), ...placeholderNodes].map((node: any) => {
    const { x, y } = dagreGraph.node(node.id);
    return { ...node, position: { x, y } };
  });
  console.log("Final edges:", edges);

  return { nodes: layoutedNodes, edges };
};


const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data, markerEnd }: any) => {
  const midY = sourceY + 40; // vertical down from source
  const edgePath = `M ${sourceX},${sourceY}
                    L ${sourceX},${midY}
                    L ${targetX},${midY}
                    L ${targetX},${targetY}`;

  const labelX = targetX;
  const labelY = midY;
  console.log('srini', data, edgePath)

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'none',
            textAlign: 'center',
            background: 'transparent'
          }}
        >
            <div style={{ fontSize: 12, color: '#000', marginBottom: 15, background: 'white', padding: '2px 4px' }}>{data?.outcome}</div>
          <div style={{ fontSize: 10, color: '#ED7532', background: 'white', padding: '2px 4px' }}>{data?.stageName}</div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};


const edgeTypes = {
  custom: CustomEdge
};

const AppStudiWorkflowDiagram = ({ activities }: any) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(activities),
    [activities]
  );

  const [nodes] = useNodesState(layoutedNodes);
  const [edges] = useEdgesState(layoutedEdges);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll
        zoomOnDoubleClick={false}
        selectionOnDrag={false}
      >
        <Background gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default AppStudiWorkflowDiagram;
