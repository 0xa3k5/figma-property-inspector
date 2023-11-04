import '!./output.css';
import { Toggle, Container, render, useWindowResize, Text } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import {
  ResizeWindowHandler,
  UpdatePageDataHandler,
  PropertyTypeValues,
  PropertyType,
  GetVariablesHandler,
  GetVariableCollectionsHandler,
  IVariable,
  IVariableCollection,
} from './types';
import ValueDisplay from './components/ValueDisplay';
import Footer from './components/Footer';
import BarChart from './components/BarChart';

function Plugin() {
  const [pageData, setPageData] = useState<PropertyTypeValues | null>(null);
  const [variables, setVariables] = useState<IVariable[]>([]);
  const [keyUsageCounts, setKeyUsageCounts] = useState<{ [key: string]: number }>({});
  const [variableCollections, setVariableCollections] = useState<IVariableCollection[]>([]);

  const [propertyVisibility, setPropertyVisibility] = useState(
    Object.fromEntries(Object.values(PropertyType).map((type) => [type, true]))
  );

  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize);
  }
  useWindowResize(onWindowResize, {
    maxHeight: 720,
    maxWidth: 720,
    minHeight: 320,
    minWidth: 320,
    resizeBehaviorOnDoubleClick: 'minimize',
  });

  useEffect(() => {
    function handleUpdatePageData(properties: PropertyTypeValues) {
      setPageData(properties);
      countKeyUsage(properties);
    }
    function handleGetVariables(data: IVariable[]) {
      setVariables(data);
      console.log(data);
    }

    function handleGetVariableCollections(data: IVariableCollection[]) {
      console.log('collections:', data);
      setVariableCollections(data);
    }

    on<UpdatePageDataHandler>('UPDATE_PAGE_DATA', handleUpdatePageData);
    on<GetVariablesHandler>('GET_VARIABLES', handleGetVariables);
    on<GetVariableCollectionsHandler>('GET_VARIABLE_COLLECTIONS', handleGetVariableCollections);
  }, []);

  const countKeyUsage = (data: PropertyTypeValues) => {
    const keyCounts: { [key: string]: number } = {};
    Object.entries(data).forEach(([key, value]) => {
      let count = 0;
      Object.values(PropertyType).forEach((type) => {
        Object.values(value[type]).forEach((propertyValue) => {
          count += propertyValue.count;
        });
      });
      keyCounts[key] = (keyCounts[key] || 0) + count;
    });
    setKeyUsageCounts(keyCounts);
  };

  const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  if (!pageData || isObjectEmpty(pageData)) {
    return (
      <div className="">
        <div className="flex h-full w-full items-center justify-center">null</div>
        <Footer />
      </div>
    );
  }

  return (
    <Container space="medium">
      <div
        className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 p-4"
        style={{
          borderBottom: '1px solid var(--figma-color-border)',
          backgroundColor: 'var(--figma-color-bg)',
        }}
      >
        {Object.values(PropertyType).map((type) => (
          <Toggle
            key={type}
            value={propertyVisibility[type]}
            onChange={() => {
              setPropertyVisibility((prevVisibility) => ({
                ...prevVisibility,
                [type]: !prevVisibility[type],
              }));
            }}
          >
            <Text>{type}</Text>
          </Toggle>
        ))}
      </div>
      <div className="my-12">
        <BarChart pageData={pageData} rawData={keyUsageCounts} title="" />
        {Object.entries(pageData).map(([key, value]) => {
          return (
            <div key={key}>
              <ValueDisplay
                propertyKey={key}
                totalCount={keyUsageCounts[key]}
                value={value}
                visibleProperties={propertyVisibility}
                variables={variables}
                collections={variableCollections}
              />
            </div>
          );
        })}
      </div>
      <Footer />
    </Container>
  );
}

export default render(Plugin);
