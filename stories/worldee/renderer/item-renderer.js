import React, { Component } from 'react';
import './item-renderer.css';
import { isDescendant } from '../../../src';
import classnames from '../../../src/utils/classnames';

class TreeItemRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      buttons,
      className,
      style,
      didDrop,
      treeId,
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      itemRenderer,
      draggableItemRenderer,
      customPlaceholderClass,
      ...otherProps
    } = this.props;
    const rowDirectionClass = rowDirection === 'rst__rtl' ? 'rst__rtl' : null;

    const draggingElement = (element) => {
      return connectDragSource(
        <div>
          <div
            onContextMenu={(event) => {
              event.stopPropagation();
              event.preventDefault();
              return false;
            }}
          >
            {element}
          </div>
        </div>,
        {
          dropEffect: 'copy',
        },
      );
    };

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);

    const content = (handle) => {
      const isDraggingMe = draggedNode === node;
      return (
        <div className={classnames('rstRowWrapper', 'rowDirectionClass')}>
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(
            <div
              className={classnames(
                'rstRow',
                isDraggingMe && 'rstRowLandingPad',
                isDraggingMe && !canDrop && 'rstRowCancelPad',
                isSearchMatch && 'rstRowSearchMatch',
                isSearchFocus && 'rstRowSearchFocus',
                rowDirectionClass,
                customPlaceholderClass,
                className,
              )}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              {itemRenderer(isDragging, handle)}
            </div>,
          )}
        </div>
      );
    };

    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
          <div className="rstLoadingHandle">
            <div className="rstLoadingCircle">
              {[...new Array(12)].map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={classnames('rstLoadingCirclePoint', 'rowDirectionClass')}
                />
              ))}
            </div>
          </div>
        );
      } else if (draggableItemRenderer) {
        // Show the handle used to initiate a drag-and-drop
        handle = draggingElement(draggableItemRenderer());
      }
    }

    return (
      <div className="disableSelection" style={{ height: '100%' }} {...otherProps}>
        {draggableItemRenderer ? content(handle) : draggingElement(content(handle))}
      </div>
    );
  }
}

export default TreeItemRenderer;
