import React, { Children, cloneElement, Component } from 'react';

type OwnProps = {
    connectDropTarget: (...args: any[]) => any;
    isOver: boolean;
    canDrop?: boolean;
    draggedNode?: {};
    treeId: string;
    drop: (...args: any[]) => any;
};

type Props = OwnProps & typeof TreePlaceholder.defaultProps;

class TreePlaceholder extends Component<Props> {
static defaultProps = {
    canDrop: false,
    draggedNode: null,
};

  render() {
    const {
      children,
      connectDropTarget,
      treeId,
      drop,
      // @ts-expect-error ts-migrate(2700) FIXME: Rest types may only be created from object types.
      ...otherProps
    } = this.props;
    // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
    return connectDropTarget(
      // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div>
        {Children.map(children, (child) =>
          cloneElement(child, {
            ...otherProps,
          })
        )}
      </div>
    );
  }
}

export default TreePlaceholder;
