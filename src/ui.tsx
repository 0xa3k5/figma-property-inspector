import {
  Button,
  Container,
  render,
  Stack,
  useWindowResize,
  Tabs,
  TabsOption,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { JSX, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import {
  AnalysePageHandler,
  AnalyseSelectionHandler,
  ResizeWindowHandler,
  UpdatePageDataHandler,
  SizingValues,
} from "./types";
import TabContent from "./components/TabContent";

function Plugin() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [pageData, setPageData] = useState<SizingValues | null>(null);
  const [currentTab, setCurrentTab] = useState<"Paddings" | "Gaps">("Paddings");

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
    function handleUpdatePageData(event: SizingValues) {
      setPageData(event);
    }
    on<UpdatePageDataHandler>("UPDATE_PAGE_DATA", handleUpdatePageData);
  }, []);

  const handleAnalysePageClick = useCallback(function () {
    emit<AnalysePageHandler>("ANALYSE_PAGE");
  }, []);

  const handleAnalyseSelectionClick = useCallback(function () {
    emit<AnalyseSelectionHandler>("ANALYSE_SELECTION");
  }, []);

  const { paddings, gaps } = pageData || { paddings: null, gaps: null };

  const tabOptions: Array<TabsOption> = [
    {
      children: <TabContent data={paddings} tabTitle={currentTab} />,
      value: "Paddings",
    },
    {
      children: <TabContent data={gaps} tabTitle={currentTab} />,
      value: "Gaps",
    },
  ];

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value as typeof currentTab;
    setCurrentTab(newValue);
  };

  console.log(paddings);
  console.log(gaps);

  return (
    <Container space="medium">
      <Stack space="medium">
        <Tabs
          onChange={(e) => handleChange(e)}
          options={tabOptions}
          value={currentTab}
        />
        <div
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            position: "fixed",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--figma-color-border)",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "var(--figma-color-bg)",
          }}
        >
          <Button secondary fullWidth onClick={handleAnalyseSelectionClick}>
            Analyse Selecion
          </Button>
          <Button fullWidth onClick={handleAnalysePageClick}>
            Analyse Full Page
          </Button>
        </div>
      </Stack>
    </Container>
  );
}

export default render(Plugin);
