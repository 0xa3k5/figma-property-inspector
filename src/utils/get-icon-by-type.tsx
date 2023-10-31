import { h } from "preact";
import {
  PaddingTopIcon,
  PaddingBottomIcon,
  PaddingLeftIcon,
  PaddingRightIcon,
  GapVerticalIcon,
  GapHorizontalIcon,
  StrokeLeftIcon,
  StrokeTopIcon,
  StrokeRightIcon,
  StrokeBottomIcon,
  RadiusTopLeftIcon,
  RadiusTopRightIcon,
  RadiusBottomLeftIcon,
  RadiusBottomRightIcon,
} from "../icons";
import { PropertyType } from "../types";

export const getIcon = (type: PropertyType, direction: string) => {
  if (type === "padding") {
    switch (direction) {
      case "top":
        return <PaddingTopIcon />;
      case "bottom":
        return <PaddingBottomIcon />;
      case "left":
        return <PaddingLeftIcon />;
      case "right":
        return <PaddingRightIcon />;

      default:
        break;
    }
  } else if (type === "gap") {
    switch (direction) {
      case "vertical":
        return <GapVerticalIcon />;
      case "horizontal":
        return <GapHorizontalIcon />;
      default:
        break;
    }
  } else if (type === "stroke") {
    switch (direction) {
      case "left":
        return <StrokeLeftIcon />;
      case "top":
        return <StrokeTopIcon />;
      case "right":
        return <StrokeRightIcon />;
      case "bottom":
        return <StrokeBottomIcon />;
    }
  } else if (type === "radius") {
    switch (direction) {
      case "top-left":
        return <RadiusTopLeftIcon />;
      case "top-right":
        return <RadiusTopRightIcon />;
      case "bottom-left":
        return <RadiusBottomLeftIcon />;
      case "bottom-right":
        return <RadiusBottomRightIcon />;
    }
  }
};
