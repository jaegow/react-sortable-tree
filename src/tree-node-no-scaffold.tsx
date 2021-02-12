import React, { Component, Children, cloneElement } from 'react';
import { InView } from 'react-intersection-observer';
import classnames from './utils/classnames';
import './tree-node.css';

type OwnProps = {
  loaderRenderer?: (...args: any[]) => any;
  treeIndex: number;
  treeId: string;
  swapFrom?: number;
  swapDepth?: number;
  swapLength?: number;
  scaffoldBlockPxWidth: number;
  lowerSiblingCounts: number[];
  listIndex: number;
  connectDropTarget: (...args: any[]) => any;
  isOver: boolean;
  canDrop?: boolean;
  draggedNode?: {};
  getPrevRow: (...args: any[]) => any;
  node: {};
  path: (string | number)[];
  rowDirection?: string;
};

type State = any;

type Props = OwnProps & typeof TreeNodeNoScaffold.defaultProps;

class TreeNodeNoScaffold extends Component<Props, State> {
  static defaultProps = {
    swapFrom: null,
    swapDepth: null,
    swapLength: null,
    canDrop: false,
    draggedNode: null,
    rowDirection: 'ltr',
    loaderRenderer: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isVisible: false,
    };
  }

  render() {
    const {
      children,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      treeId, // Delete from otherProps
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      rowDirection,
      loaderRenderer,
      // @ts-expect-error ts-migrate(2700) FIXME: Rest types may only be created from object types.
      ...otherProps
    } = this.props;

    const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;
    const self = this;

    // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
    return connectDropTarget(
      //
      <div {...otherProps} className={classnames('rst__node', rowDirectionClass)}>
        {this.state.isVisible || loaderRenderer === null ? (
          //
          <div className="rst__nodeContent">
            {Children.map(children, (child) =>
              cloneElement(child, {
                isOver,
                canDrop,
                draggedNode,
              }),
            )}
          </div>
        ) : (
          //
          <InView
            root={null}
            rootMargin="500px"
            onChange={(inView) => {
              if (inView && !self.state.isVisible) {
                self.setState({
                  isVisible: true,
                });
              }
            }}
          >
            {/* @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable. */}
            {loaderRenderer(listIndex)}
          </InView>
        )}
      </div>,
    );
  }
}

export default TreeNodeNoScaffold;
