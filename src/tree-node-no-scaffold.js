import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import {InView} from "react-intersection-observer";
import classnames from './utils/classnames';
import './tree-node.css';

class TreeNodeNoScaffold extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
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
      ...otherProps
    } = this.props;

    const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;
    const self = this;

    return connectDropTarget(
      <div
        {...otherProps}
        className={classnames('rst__node', rowDirectionClass)}
      >
        {this.state.isVisible || loaderRenderer === null ?
            <div className="rst__nodeContent">
              {Children.map(children, child =>
                  cloneElement(child, {
                    isOver,
                    canDrop,
                    draggedNode,
                  })
              )}
            </div> :
            <InView
                root={null}
                rootMargin="500px"
                onChange={(inView) => {
                  if (inView && !self.state.isVisible) {
                    self.setState({
                      isVisible: true
                    });
                  }
                }}>
              {loaderRenderer(listIndex)}
            </InView>
        }
      </div>
    );
  }
}

TreeNodeNoScaffold.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  rowDirection: 'ltr',
  loaderRenderer: null
};

TreeNodeNoScaffold.propTypes = {
  loaderRenderer: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,

  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,

  // rtl support
  rowDirection: PropTypes.string,
};

export default TreeNodeNoScaffold;
