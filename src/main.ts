import { emit, on, showUI } from "@create-figma-plugin/utilities";
import {
  InspectPageHandler,
  ResizeWindowHandler,
  PropertyTypeValues,
  UpdatePageDataHandler,
  InspectSelectionHandler,
  PropertyType,
  ValueSelectHandler,
  GetVariablesHandler,
  GetVariableCollectionsHandler,
  IVariableCollection,
  IVariable,
  AssignVariableHandler,
} from "./types";

const processPropertyValue = (
  node: SceneNode,
  propValue: number | undefined,
  direction: string,
  type: PropertyType,
  sizingData: PropertyTypeValues
) => {
  if (propValue !== undefined && propValue > 0) {
    const key = propValue.toString();
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
    }
    if (!sizingData[key][type][direction]) {
      sizingData[key][type][direction] = { count: 0, nodes: [] };
    }
    sizingData[key][type][direction].count += 1;
    sizingData[key][type][direction].nodes.push(node);
  }
};

const propertyToBindableNodeField: { [key: string]: { [direction: string]: VariableBindableNodeField } } = {
  padding: {
    left: 'paddingLeft',
    right: 'paddingRight',
    top: 'paddingTop',
    bottom: 'paddingBottom',
  },
  radius: {
    'bottom-left': 'bottomLeftRadius',
    'bottom-right': 'bottomRightRadius',
    'top-left': 'topLeftRadius',
    'top-right': 'topRightRadius',
  },
  gap: {
    'HORIZONTAL': 'itemSpacing',
    'VERTICAL': 'itemSpacing'
  }
};


const processValues = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const isAutoLayout = "layoutMode" in node && node.layoutMode !== 'NONE' && node.primaryAxisAlignItems !== "SPACE_BETWEEN";
  const hasStroke = "strokes" in node && node.strokes.length > 0 && "strokeLeftWeight" in node;
  const hasCornerRadius = "cornerRadius" in node && "topLeftRadius" in node;

  if (isAutoLayout) {
    const { paddingLeft, paddingTop, paddingRight, paddingBottom, itemSpacing } = node;

    processPropertyValue(node, paddingLeft, "left", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingTop, "top", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingRight, "right", PropertyType.PADDING, sizingData);
    processPropertyValue(node, paddingBottom, "bottom", PropertyType.PADDING, sizingData);
    processPropertyValue(node, itemSpacing, node.layoutMode, PropertyType.GAP, sizingData);
  }

  if (hasStroke) {
    const { strokeLeftWeight, strokeRightWeight, strokeTopWeight, strokeBottomWeight } = node;

    processPropertyValue(node, strokeLeftWeight, "left", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeTopWeight, "top", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeRightWeight, "right", PropertyType.STROKE, sizingData);
    processPropertyValue(node, strokeBottomWeight, "bottom", PropertyType.STROKE, sizingData);
  }

  if (hasCornerRadius) {
    const { topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } = node;

    processPropertyValue(node, topLeftRadius, "top-left", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, topRightRadius, "top-right", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, bottomLeftRadius, "bottom-left", PropertyType.RADIUS, sizingData);
    processPropertyValue(node, bottomRightRadius, "bottom-right", PropertyType.RADIUS, sizingData);
  }
};

const updateSizingData = (
  nodeSizingData: PropertyTypeValues,
  sizingData: PropertyTypeValues
) => {
  Object.keys(nodeSizingData).forEach((key) => {
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
    }

    const updatePropertyData = (type: PropertyType) => {
      const propertyData = nodeSizingData[key][type];
      Object.keys(propertyData).forEach((direction) => {
        if (!sizingData[key][type][direction]) {
          sizingData[key][type][direction] = { count: 0, nodes: [] };
        }
        sizingData[key][type][direction].count += propertyData[direction].count;
        sizingData[key][type][direction].nodes.push(
          ...propertyData[direction].nodes
        );
      });
    };

    Object.values(PropertyType).map((type) => updatePropertyData(type))
  });
};

const getFloatVariables = (): IVariable[] => {
  return figma.variables.getLocalVariables('FLOAT').map((v) => {
    return {
      id: v.id,
      name: v.name,
      key: v.key,
      scopes: v.scopes,
      valuesByMode: v.valuesByMode,
      codeSyntax: v.codeSyntax,
      description: v.description,
      remote: v.remote,
      resolvedType: v.resolvedType,
      variableCollectionId: v.variableCollectionId,
    };
  });
};

const getVariableCollections = (): IVariableCollection[] => {
  return figma.variables.getLocalVariableCollections().map((col) => {
    return {
      id: col.id,
      defaultModeId: col.defaultModeId,
      hiddenFromPublishing: col.hiddenFromPublishing,
      key: col.key,
      modes: col.modes,
      name: col.name,
      variableIds: col.variableIds
    }
  })
}

const inspectNode = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const nodeSizingData: PropertyTypeValues = {};
  processValues(node, sizingData);
  updateSizingData(nodeSizingData, sizingData);

  if ("children" in node) {
    node.children.forEach((childNode) => {
      inspectNode(childNode, sizingData);
    });
  }
};

export default function (): void {
  on<ResizeWindowHandler>(
    "RESIZE_WINDOW",
    function (windowSize: { width: number; height: number }): void {
      const { width, height } = windowSize;
      figma.ui.resize(width, height);
    }
  );

  let properties: PropertyTypeValues = {};

  on<InspectPageHandler>("INSPECT_PAGE", function (): void {
    properties = {};
    const nodeData = figma.currentPage.children;
    const variables = getFloatVariables();
    const variableCollections = getVariableCollections()

    nodeData.forEach((node) => {
      inspectNode(node, properties);
    });

    figma.notify(`Inspected: ${figma.currentPage.name}`);
    emit<GetVariableCollectionsHandler>("GET_VARIABLE_COLLECTIONS", variableCollections)
    emit<GetVariablesHandler>("GET_VARIABLES", variables);
    emit<UpdatePageDataHandler>("UPDATE_PAGE_DATA", properties);
  });

  on<InspectSelectionHandler>("INSPECT_SELECTION", function (): void {
    const variables = getFloatVariables();
    properties = {};
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify("Select a node to start");
    } else {
      selectedNodes.forEach((node) => {
        inspectNode(node, properties);
      });
      figma.notify(
        `Inspected: ${selectedNodes.length} ${selectedNodes.length > 0 ? "nodes" : "node"
        }`
      );
    }

    emit<UpdatePageDataHandler>("UPDATE_PAGE_DATA", properties);
  });

  on<AssignVariableHandler>("ASSIGN_VARIABLE", (data): void => {
    const nodesArray: SceneNode[] = [];

    for (const dir of Object.keys(properties[data.key][data.type])) {
      console.log(dir)
      const nodesForDirection = properties[data.key][data.type][dir]?.nodes || [];
      nodesForDirection.forEach((nodeData) => {
        const node = figma.getNodeById(nodeData.id) as SceneNode;
        if (node) {
          nodesArray.push(node)
          node.setBoundVariable(propertyToBindableNodeField[data.type][dir], data.variableId);
        }
      });
    }
    figma.currentPage.selection = nodesArray
  })

  on<ValueSelectHandler>("VALUE_SELECT", (data): void => {
    const nodesArray = properties[data.key][data.type][data.direction].nodes
      .map((node) => {
        return figma.getNodeById(node.id);
      })
      .filter(Boolean) as SceneNode[];

    figma.currentPage.selection = nodesArray;
    figma.viewport.scrollAndZoomIntoView(nodesArray);
  });

  showUI({
    height: 512,
    width: 512,
  });
}
