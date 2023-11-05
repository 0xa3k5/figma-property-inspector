import { h } from 'preact';
import {
  PaddingTopIcon,
  PaddingBottomIcon,
  PaddingLeftIcon,
  PaddingRightIcon,
  StrokeLeftIcon,
  StrokeTopIcon,
  StrokeRightIcon,
  StrokeBottomIcon,
  RadiusTopLeftIcon,
  RadiusTopRightIcon,
  RadiusBottomLeftIcon,
  RadiusBottomRightIcon,
  RadiusAllIcon,
} from '../icons';
import { PropertyType } from '../types';
import {
  IconCornerRadius32,
  IconPaddingHorizontal32,
  IconPaddingVertical32,
  IconSpacingHorizontal32,
  IconSpacingVertical32,
} from '@create-figma-plugin/ui';

export const getIcon = (type: PropertyType, direction: string) => {
  if (type === 'padding') {
    switch (direction) {
      case 'top':
        return <PaddingTopIcon />;
      case 'bottom':
        return <PaddingBottomIcon />;
      case 'left':
        return <PaddingLeftIcon />;
      case 'right':
        return <PaddingRightIcon />;
      case 'vertical':
        return <IconPaddingVertical32 width={24} height={24} />;
      case 'horizontal':
        return <IconPaddingHorizontal32 width={24} height={24} />;

      default:
        break;
    }
  } else if (type === 'gap') {
    switch (direction) {
      case 'vertical':
        return <IconSpacingVertical32 width={24} height={24} />;
      case 'horizontal':
        return <IconSpacingHorizontal32 width={24} height={24} />;
      default:
        break;
    }
  } else if (type === 'stroke') {
    switch (direction) {
      case 'left':
        return <StrokeLeftIcon />;
      case 'top':
        return <StrokeTopIcon />;
      case 'right':
        return <StrokeRightIcon />;
      case 'bottom':
        return <StrokeBottomIcon />;
    }
  } else if (type === 'radius') {
    switch (direction) {
      case 'top-left':
        return <RadiusTopLeftIcon />;
      case 'top-right':
        return <RadiusTopRightIcon />;
      case 'bottom-left':
        return <RadiusBottomLeftIcon />;
      case 'bottom-right':
        return <RadiusBottomRightIcon />;
      case 'all':
        return <RadiusAllIcon />;
    }
  }
};
