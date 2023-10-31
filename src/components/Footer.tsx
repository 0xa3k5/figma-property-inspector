import { Button } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback } from "react";
import { InspectPageHandler, InspectSelectionHandler } from "../types";

export default function Footer(): JSX.Element {
  const handleInspectPageClick = useCallback(function () {
    emit<InspectPageHandler>("INSPECT_PAGE");
  }, []);

  const handleInspectSelectionClick = useCallback(function () {
    emit<InspectSelectionHandler>("INSPECT_SELECTION");
  }, []);

  return (
    <div
      className="flex z-10 fixed px-2 py-4 justify-between items-center bottom-0 left-0 right-0"
      style={{
        borderTop: "1px solid var(--figma-color-border)",
        backgroundColor: "var(--figma-color-bg)",
      }}
    >
      <Button secondary fullWidth onClick={handleInspectSelectionClick}>
        Inspect Selecion
      </Button>
      <Button fullWidth onClick={handleInspectPageClick}>
        Inspect Full Page
      </Button>
    </div>
  );
}
