import { emit, on, once, showUI } from '@create-figma-plugin/utilities'
import { SizingValues, AnalysePageHandler, ResizeWindowHandler, UpdatePageDataHandler, SizingValue, AnalyseSelectionHandler } from './types'

const countPaddings = (node: BaseNode): SizingValues => {
  const paddingValues: SizingValue = {};
  const gapValues: SizingValue = {};

  const mapSizeValues = (node: BaseNode) => {
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
      const { paddingTop, paddingBottom, paddingLeft, paddingRight, itemSpacing } = node;
      [paddingTop, paddingBottom, paddingLeft, paddingRight].forEach(padding => {
        if (padding !== undefined && padding > 0) {
          const key = padding.toString();
          paddingValues[key] = (paddingValues[key] || 0) + 1;
        }
      });
      if (itemSpacing !== undefined && itemSpacing > 0) {
        const key = itemSpacing.toString();
        gapValues[key] = (gapValues[key] || 0) + 1;
      }
    }
    if ('children' in node) {
      node.children.forEach(mapSizeValues);
    }
  };

  mapSizeValues(node);
  return { paddings: paddingValues, gaps: gapValues };
}

export default function () {
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    function (windowSize: { width: number; height: number }) {
      const { width, height } = windowSize
      figma.ui.resize(width, height)
    }
  )

  once<AnalysePageHandler>('ANALYSE_PAGE', function () {
    const frameData = figma.currentPage.children.filter(node => node.type === 'FRAME' || node.type === 'SECTION');
    
    const allSizingValues = frameData.map(countPaddings).reduce<SizingValues>((acc, counts) => {
      Object.keys(counts.paddings).forEach(key => {
        acc.paddings[key] = (acc.paddings[key] || 0) + counts.paddings[key];
      });
      Object.keys(counts.gaps).forEach(key => {
        acc.gaps[key] = (acc.gaps[key] || 0) + counts.gaps[key];
      });
      return acc;
    }, {
      paddings: {},
      gaps: {}
    });
    
    emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', allSizingValues);
  });  
  
  on<AnalyseSelectionHandler>('ANALYSE_SELECTION', function () {
    const selectedNodes = figma.currentPage.selection;
    
    if (selectedNodes.length === 0) {
      figma.notify('Select a frame')
      return;
    }
    figma.notify(`Analyzed ${selectedNodes.length} frames`)

    const allPaddingAndGapCounts = selectedNodes.map(countPaddings).reduce<SizingValues>((acc, counts) => {
      Object.keys(counts.paddings).forEach(key => {
        acc.paddings[key] = (acc.paddings[key] || 0) + counts.paddings[key];
      });
      Object.keys(counts.gaps).forEach(key => {
        acc.gaps[key] = (acc.gaps[key] || 0) + counts.gaps[key];
      });
      return acc;
    }, {
      paddings: {},
      gaps: {}
    });
    
    emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', allPaddingAndGapCounts);
  });

  showUI({
    height: 512,
    width: 512
  })
}
