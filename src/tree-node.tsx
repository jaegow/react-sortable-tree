import React, { Component, Children, cloneElement } from 'react';
import classnames from './utils/classnames';
import './tree-node.css';
type OwnProps = {
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
type Props = OwnProps & typeof TreeNode.defaultProps;
class TreeNode extends Component<Props> {
    static defaultProps = {
        swapFrom: null,
        swapDepth: null,
        swapLength: null,
        canDrop: false,
        draggedNode: null,
        rowDirection: 'ltr',
    };
    render() {
        const { children, listIndex, swapFrom, swapLength, swapDepth, scaffoldBlockPxWidth, lowerSiblingCounts, connectDropTarget, isOver, draggedNode, canDrop, treeIndex, treeId, // Delete from otherProps
        getPrevRow, // Delete from otherProps
        node, // Delete from otherProps
        path, // Delete from otherProps
        // @ts-expect-error ts-migrate(2700) FIXME: Rest types may only be created from object types.
        rowDirection, loaderRenderer, ...otherProps } = this.props;
        const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;
        // Construct the scaffold representing the structure of the tree
        const scaffoldBlockCount = (lowerSiblingCounts as any).length;
        const scaffold: any = [];
        (lowerSiblingCounts as any).forEach((lowerSiblingCount: any, i: any) => {
            let lineClass = '';
            if (lowerSiblingCount > 0) {
                // At this level in the tree, the nodes had sibling nodes further down
                if (listIndex === 0) {
                    // Top-left corner of the tree
                    // +-----+
                    // |     |
                    // |  +--+
                    // |  |  |
                    // +--+--+
                    lineClass =
                        'rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom';
                }
                else if (i === scaffoldBlockCount - 1) {
                    // Last scaffold block in the row, right before the row content
                    // +--+--+
                    // |  |  |
                    // |  +--+
                    // |  |  |
                    // +--+--+
                    lineClass = 'rst__lineHalfHorizontalRight rst__lineFullVertical';
                }
                else {
                    // Simply connecting the line extending down to the next sibling on this level
                    // +--+--+
                    // |  |  |
                    // |  |  |
                    // |  |  |
                    // +--+--+
                    lineClass = 'rst__lineFullVertical';
                }
            }
            else if (listIndex === 0) {
                // Top-left corner of the tree, but has no siblings
                // +-----+
                // |     |
                // |  +--+
                // |     |
                // +-----+
                lineClass = 'rst__lineHalfHorizontalRight';
            }
            else if (i === scaffoldBlockCount - 1) {
                // The last or only node in this level of the tree
                // +--+--+
                // |  |  |
                // |  +--+
                // |     |
                // +-----+
                lineClass = 'rst__lineHalfVerticalTop rst__lineHalfHorizontalRight';
            }
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            scaffold.push(<div key={`pre_${1 + i}`} style={{ width: scaffoldBlockPxWidth }} className={classnames('rst__lineBlock', lineClass, rowDirectionClass)}/>);
            if (treeIndex !== listIndex && i === swapDepth) {
                // This row has been shifted, and is at the depth of
                // the line pointing to the new destination
                let highlightLineClass = '';
                if (listIndex === swapFrom + swapLength - 1) {
                    // This block is on the bottom (target) line
                    // This block points at the target block (where the row will go when released)
                    highlightLineClass = 'rst__highlightBottomLeftCorner';
                }
                else if (treeIndex === swapFrom) {
                    // This block is on the top (source) line
                    highlightLineClass = 'rst__highlightTopLeftCorner';
                }
                else {
                    // This block is between the bottom and top
                    highlightLineClass = 'rst__highlightLineVertical';
                }
                let style;
                if (rowDirection === 'rtl') {
                    style = {
                        width: scaffoldBlockPxWidth,
                        right: scaffoldBlockPxWidth * i,
                    };
                }
                else {
                    // Default ltr
                    style = {
                        width: scaffoldBlockPxWidth,
                        left: scaffoldBlockPxWidth * i,
                    };
                }
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                scaffold.push(<div 
                // eslint-disable-next-line react/no-array-index-key
                key={i} style={style} className={classnames('rst__absoluteLineBlock', highlightLineClass, rowDirectionClass)}/>);
            }
        });
        let style;
        if (rowDirection === 'rtl') {
            style = { right: scaffoldBlockPxWidth * scaffoldBlockCount };
        }
        else {
            // Default ltr
            style = { left: scaffoldBlockPxWidth * scaffoldBlockCount };
        }
        // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
        return connectDropTarget(<div {...otherProps} className={classnames('rst__node', rowDirectionClass)}>
        {scaffold}

        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <div className="rst__nodeContent" style={style}>
          {Children.map(children, (child) => cloneElement(child, {
            isOver,
            canDrop,
            draggedNode,
        }))}
        </div>
      </div>);
    }
}
export default TreeNode;
