import React from 'react';
import classnames from './utils/classnames';
import './placeholder-renderer-default.css';

type OwnProps = {
    isOver?: boolean;
    canDrop?: boolean;
};

// @ts-expect-error ts-migrate(2456) FIXME: Type alias 'Props' circularly references itself.
type Props = OwnProps & typeof PlaceholderRendererDefault.defaultProps;

// @ts-expect-error ts-migrate(7022) FIXME: 'PlaceholderRendererDefault' implicitly has type '... Remove this comment to see the full error message
const PlaceholderRendererDefault = ({ isOver, canDrop }: Props) => (
  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <div
    className={classnames(
      'rst__placeholder',
      canDrop && 'rst__placeholderLandingPad',
      canDrop && !isOver && 'rst__placeholderCancelPad'
    )}
  />
);

PlaceholderRendererDefault.defaultProps = {
  isOver: false,
  canDrop: false,
};

export default PlaceholderRendererDefault;
