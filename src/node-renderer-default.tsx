import React, { Component } from 'react';
import { isDescendant } from './utils/tree-data-utils';
import classnames from './utils/classnames';
import './node-renderer-default.css';
type OwnProps = {
  node: {};
  title?: ((...args: never[]) => any) | React.ReactNode;
  subtitle?: ((...args: never[]) => any) | React.ReactNode;
  path: (string | number)[];
  treeIndex: number;
  treeId: string;
  isSearchMatch?: boolean;
  isSearchFocus?: boolean;
  canDrag?: boolean;
  scaffoldBlockPxWidth: number;
  toggleChildrenVisibility?: (...args: any[]) => any;
  buttons?: React.ReactNode[];
  className?: string;
  style?: {};
  connectDragPreview: (...args: any[]) => any;
  connectDragSource: (...args: any[]) => any;
  parentNode?: {};
  isDragging: boolean;
  didDrop: boolean;
  draggedNode?: {};
  isOver: boolean;
  canDrop?: boolean;
  rowDirection?: string;
};
type Props = OwnProps & typeof NodeRendererDefault.defaultProps;
class NodeRendererDefault extends Component<Props> {
  static defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: null,
    buttons: [],
    className: '',
    style: {},
    parentNode: null,
    draggedNode: null,
    canDrop: false,
    title: null,
    subtitle: null,
    rowDirection: 'ltr',
  };
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
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;
    const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;
    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        //
        handle = (
          <div className="rst__loadingHandle">
            <div className="rst__loadingCircle">
              {[...new Array(12)].map((_, index) => (
                <div key={index} className={classnames('rst__loadingCirclePoint', rowDirectionClass)} />
              ))}
            </div>
          </div>
        );
      } else {
        // Show the handle used to initiate a drag-and-drop
        // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
        handle = connectDragSource(<div className="rst__moveHandle" />, {
          dropEffect: 'copy',
        });
      }
    }
    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;
    let buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };
    if (rowDirection === 'rtl') {
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ right: number; }' is not assignable to typ... Remove this comment to see the full error message
      buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
    }
    //
    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          //
          (node.children.length > 0 || typeof node.children === 'function') && (
            <div>
              <button
                type="button"
                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                className={classnames(node.expanded ? 'rst__collapseButton' : 'rst__expandButton', rowDirectionClass)}
                style={buttonStyle}
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              />

              {node.expanded && !isDragging && (
                <div
                  style={{ width: scaffoldBlockPxWidth }}
                  className={classnames('rst__lineChildren', rowDirectionClass)}
                />
              )}
            </div>
          )}

        <div className={classnames('rst__rowWrapper', rowDirectionClass)}>
          {/* @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable. */}
          {connectDragPreview(
            <div
              className={classnames(
                'rst__row',
                isLandingPadActive && 'rst__rowLandingPad',
                isLandingPadActive && !canDrop && 'rst__rowCancelPad',
                isSearchMatch && 'rst__rowSearchMatch',
                isSearchFocus && 'rst__rowSearchFocus',
                rowDirectionClass,
                className,
              )}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
                ...style,
              }}
            >
              {handle}

              <div
                className={classnames(
                  'rst__rowContents',
                  !canDrag && 'rst__rowContentsDragDisabled',
                  rowDirectionClass,
                )}
              >
                <div className={classnames('rst__rowLabel', rowDirectionClass)}>
                  <span className={classnames('rst__rowTitle', node.subtitle && 'rst__rowTitleWithSubtitle')}>
                    {typeof nodeTitle === 'function'
                      ? // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
                        nodeTitle({
                          node,
                          path,
                          treeIndex,
                        })
                      : nodeTitle}
                  </span>

                  {nodeSubtitle && (
                    <span className="rst__rowSubtitle">
                      {typeof nodeSubtitle === 'function'
                        ? // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
                          nodeSubtitle({
                            node,
                            path,
                            treeIndex,
                          })
                        : nodeSubtitle}
                    </span>
                  )}
                </div>

                <div className="rst__rowToolbar">
                  {buttons.map((btn: any, index: any) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className="rst__toolbarButton"
                    >
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>,
          )}
        </div>
      </div>
    );
  }
}
export default NodeRendererDefault;
