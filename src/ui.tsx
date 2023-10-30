import "!./output.css";
import { Container, render, useWindowResize } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

import {
  ResizeWindowHandler,
  UpdatePageDataHandler,
  PropertyTypeValues,
} from "./types";
import ValueDisplay from "./components/ValueDisplay";
import Footer from "./components/Footer";

function Plugin() {
  const [pageData, setPageData] = useState<PropertyTypeValues | null>(null);
  const [keyUsageCounts, setKeyUsageCounts] = useState<{
    [key: string]: number;
  }>({});

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
      Object.values(value.padding).forEach((propertyValue) => {
        count += propertyValue.count;
      });
      Object.values(value.gap).forEach((propertyValue) => {
        count += propertyValue.count;
      });
      keyCounts[key] = (keyCounts[key] || 0) + count;
    });
    setKeyUsageCounts(keyCounts);
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

  function isObjectEmpty(obj: object) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  return (
    <Container space="medium">
      <div className="flex flex-col mb-11">
        {Object.entries(pageData).map(([key, value]) => (
          <ValueDisplay
            key={key}
            propertyKey={key}
            totalCount={keyUsageCounts[key]}
            value={value}
          />
        ))}
      </div>
      <Footer />
    </Container>
  );
}

export default render(Plugin);
