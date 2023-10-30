import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  InspectPageHandler,
  ResizeWindowHandler,
  PropertyTypeValues,
  UpdatePageDataHandler,
  ValueSelectHandler,
  InspectSelectionHandler,
  PropertyType,
} from './types';

const findProperties = (node: BaseNode, sizingData: PropertyTypeValues = {}): PropertyTypeValues => {
  const processValue = (
    value: number | undefined,
    direction: string,
    type: PropertyType
  ) => {
    if (value !== undefined && value > 0) {
      const key = value.toString();
      if (!sizingData[key]) {
        sizingData[key] = { padding: {}, gap: {} };
      }
      if (!sizingData[key][type][direction]) {
        sizingData[key][type][direction] = { count: 0, nodes: [] };
      }
      sizingData[key][type][direction].count += 1;
      sizingData[key][type][direction].nodes.push(node);
    }
  };

  if ('layoutMode' in node && node.layoutMode !== 'NONE' && node.primaryAxisAlignItems !== 'SPACE_BETWEEN') {
    const { paddingTop, paddingBottom, paddingLeft, paddingRight, itemSpacing } = node;

    processValue(paddingLeft, 'left', 'padding');
    processValue(paddingTop, 'top', 'padding');
    processValue(paddingRight, 'right', 'padding');
    processValue(paddingBottom, 'bottom', 'padding');
    processValue(itemSpacing, node.layoutMode, 'gap');
  }

  if ('children' in node) {
    node.children.forEach((childNode) => {
     findProperties(childNode, sizingData)
    });
  }

  return sizingData;
};


export default function (): void {
  on<ResizeWindowHandler>('RESIZE_WINDOW', function (windowSize: { width: number; height: number }): void {
    const { width, height } = windowSize;
    figma.ui.resize(width, height);
  });
  
  let sizingData: PropertyTypeValues = {};

  on<InspectPageHandler>('INSPECT_PAGE', function (): void {
    sizingData = {}
    const nodeData = figma.currentPage.children

    nodeData.forEach((node) => {
      const nodeSizingData = findProperties(node);

      Object.keys(nodeSizingData).forEach((key) => {
        
        if (!sizingData[key]) {
          sizingData[key] = { padding: {}, gap: {} };
        }

        const paddingData = nodeSizingData[key].padding;

        Object.keys(paddingData).forEach((direction) => {
          if (!sizingData[key].padding[direction]) {
            sizingData[key].padding[direction] = { count: 0, nodes: [] };
          }
          sizingData[key].padding[direction].count += paddingData[direction].count;
          sizingData[key].padding[direction].nodes.push(...paddingData[direction].nodes);
        });
        const gapData = nodeSizingData[key].gap;

        Object.keys(gapData).forEach((direction) => {
          if (!sizingData[key].gap[direction]) {
            sizingData[key].gap[direction] = { count: 0, nodes: [] };
          }
          sizingData[key].gap[direction].count += gapData[direction].count;
          sizingData[key].gap[direction].nodes.push(...gapData[direction].nodes);
        });
      });
    });

    figma.notify(`Inpected: ${figma.currentPage.name}`)

    emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', sizingData);
  });

  on<InspectSelectionHandler>('INSPECT_SELECTION', function (): void {
    sizingData = {}
    const selectedNodes = figma.currentPage.selection

    if (selectedNodes.length === 0) {
      figma.notify('select a node to start')
    } else {
      selectedNodes.forEach((node) => {
        const nodeSizingData = findProperties(node);
  
        Object.keys(nodeSizingData).forEach((key) => {
          if (!sizingData[key]) {
            sizingData[key] = { padding: {}, gap: {} };
          }

          const paddingData = nodeSizingData[key].padding;
  
          Object.keys(paddingData).forEach((direction) => {
            if (!sizingData[key].padding[direction]) {
              sizingData[key].padding[direction] = { count: 0, nodes: [] };
            }
            sizingData[key].padding[direction].count += paddingData[direction].count;
            sizingData[key].padding[direction].nodes.push(...paddingData[direction].nodes);
          });
          const gapData = nodeSizingData[key].gap;
  
          Object.keys(gapData).forEach((direction) => {
            if (!sizingData[key].gap[direction]) {
              sizingData[key].gap[direction] = { count: 0, nodes: [] };
            }
            sizingData[key].gap[direction].count += gapData[direction].count;
            sizingData[key].gap[direction].nodes.push(...gapData[direction].nodes);
          });
        });
      });
      figma.notify(`Inspected: ${selectedNodes.length} ${selectedNodes.length > 0 ? 'nodes' : 'node'}`)
    }

    emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', sizingData);
    
  });

  on<ValueSelectHandler>('VALUE_SELECT', (data): void => {
    const nodesArray = sizingData[data.key][data.type][data.direction].nodes.map((node) => {
      const sceneNode = figma.getNodeById(node.id);
      if (sceneNode) {
        if (sceneNode.type === 'FRAME' || sceneNode.type === 'SECTION') {
          return sceneNode;
        }
      }
      return sceneNode
    }).filter(Boolean) as SceneNode[];

    figma.currentPage.selection = nodesArray;
    figma.viewport.scrollAndZoomIntoView(nodesArray);
  });

  showUI({
    height: 512,
    width: 512,
  });
}