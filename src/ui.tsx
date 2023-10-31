import "!./output.css";
import {
  Toggle,
  Container,
  render,
  useWindowResize,
  Text,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

import {
  ResizeWindowHandler,
  UpdatePageDataHandler,
  PropertyTypeValues,
  PropertyType,
} from "./types";
import ValueDisplay from "./components/ValueDisplay";
import Footer from "./components/Footer";

function Plugin() {
  const [pageData, setPageData] = useState<PropertyTypeValues | null>(null);
  const [keyUsageCounts, setKeyUsageCounts] = useState<{
    [key: string]: number;
  }>({});

  const [propertyVisibility, setPropertyVisibility] = useState(
    Object.fromEntries(Object.values(PropertyType).map((type) => [type, true]))
  );

  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>("RESIZE_WINDOW", windowSize);
  }
  useWindowResize(onWindowResize, {
    maxHeight: 720,
    maxWidth: 720,
    minHeight: 320,
    minWidth: 320,
    resizeBehaviorOnDoubleClick: "minimize",
  });

  useEffect(() => {
    function handleUpdatePageData(event: PropertyTypeValues) {
      setPageData(event);
      countKeyUsage(event);
    }
    on<UpdatePageDataHandler>("UPDATE_PAGE_DATA", handleUpdatePageData);
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
        <div className="flex w-full h-full items-center justify-center">
          null
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <Container space="medium">
      <div
        className="flex gap-4 py-4 items-center w-full"
        style={{ borderBottom: "1px solid var(--figma-color-border)" }}
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
      <div className="mb-12">
        {Object.entries(pageData).map(([key, value]) => {
          return (
            <div key={key}>
              <ValueDisplay
                propertyKey={key}
                totalCount={keyUsageCounts[key]}
                value={value}
                visibleProperties={propertyVisibility}
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
