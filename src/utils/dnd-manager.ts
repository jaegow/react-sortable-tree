import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { findDOMNode } from 'react-dom';
import { getDepth } from './tree-data-utils';
import { memoizedInsertNode } from './memoized-tree-data-utils';

export default class DndManager {
  lastMove: any;

  rafId: any;

  treeRef: any;

  constructor(treeRef: any) {
    this.treeRef = treeRef;
    this.lastMove = {
      draggingId: null,
      hoveredId: null,
    };
  }

  get startDrag() {
    return this.treeRef.startDrag;
  }

  get dragHover() {
    return this.treeRef.dragHover;
  }

  get endDrag() {
    return this.treeRef.endDrag;
  }

  get drop() {
    return this.treeRef.drop;
  }

  get treeId() {
    return this.treeRef.treeId;
  }

  get dragDnDType() {
    return this.treeRef.dragDnDType;
  }

  get dropDnDType() {
    return this.treeRef.dropDnDType;
  }

  get treeData() {
    return this.treeRef.state.draggingTreeData || this.treeRef.props.treeData;
  }

  get getNodeKey() {
    return this.treeRef.props.getNodeKey;
  }

  get customCanDrop() {
    return this.treeRef.props.canDrop;
  }

  get maxDepth() {
    return this.treeRef.props.maxDepth;
  }

  resetLastMove() {
    this.lastMove = {
      draggingId: null,
      hoveredId: null,
    };
  }

  getTargetDepth(dropTargetProps: any, monitor: any, component: any) {
    let dropTargetDepth = 0;

    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
      let { path } = rowAbove;
      const aboveNodeCannotHaveChildren = !this.treeRef.canNodeHaveChildren(
        rowAbove.node
      );
      if (aboveNodeCannotHaveChildren) {
        path = path.slice(0, path.length - 1);
      }

      // Limit the length of the path to the deepest possible
      dropTargetDepth = Math.min(path.length, dropTargetProps.path.length);
    }

    let blocksOffset;
    let dragSourceInitialDepth = (monitor.getItem().path || []).length;

    // When adding node from external source
    if (monitor.getItem().treeId !== this.treeId) {
      // Ignore the tree depth of the source, if it had any to begin with
      dragSourceInitialDepth = 0;

      if (component) {
        const relativePosition = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node
        const leftShift =
          monitor.getSourceClientOffset().x - relativePosition.left;
        blocksOffset = Math.round(
          leftShift / dropTargetProps.scaffoldBlockPxWidth
        );
      } else {
        blocksOffset = dropTargetProps.path.length;
      }
    } else {
      // handle row direction support
      const direction = dropTargetProps.rowDirection === 'rtl' ? -1 : 1;

      blocksOffset = Math.round(
        (direction * monitor.getDifferenceFromInitialOffset().x) /
          dropTargetProps.scaffoldBlockPxWidth
      );
    }

    let targetDepth = Math.min(
      dropTargetDepth,
      Math.max(0, dragSourceInitialDepth + blocksOffset - 1)
    );

    // If a maxDepth is defined, constrain the target depth
    if (typeof this.maxDepth !== 'undefined' && this.maxDepth !== null) {
      const draggedNode = monitor.getItem().node;
      const draggedChildDepth = getDepth(draggedNode);

      targetDepth = Math.max(
        0,
        Math.min(targetDepth, this.maxDepth - draggedChildDepth - 1)
      );
    }

    return targetDepth;
  }

  canDrop(dropTargetProps: any, monitor: any) {
    if (!monitor.isOver()) {
      return false;
    }

    const rowAbove = dropTargetProps.getPrevRow();
    const abovePath = rowAbove ? rowAbove.path : [];
    const aboveNode = rowAbove ? rowAbove.node : {};
    const targetDepth = this.getTargetDepth(dropTargetProps, monitor, null);

    // Cannot drop if we're adding to the children of the row above and
    //  the row above is a function
    if (
      targetDepth >= abovePath.length &&
      typeof aboveNode.children === 'function'
    ) {
      return false;
    }

    if (typeof this.customCanDrop === 'function') {
      const { node } = monitor.getItem();
      const addedResult = memoizedInsertNode({
        treeData: this.treeData,
        newNode: node,
        depth: targetDepth,
        getNodeKey: this.getNodeKey,
        minimumTreeIndex: dropTargetProps.listIndex,
        expandParent: true,
      });

      return this.customCanDrop({
        node,
        prevPath: monitor.getItem().path,
        prevParent: monitor.getItem().parentNode,
        prevTreeIndex: monitor.getItem().treeIndex, // Equals -1 when dragged from external tree
        nextPath: addedResult.path,
        nextParent: addedResult.parentNode,
        nextTreeIndex: addedResult.treeIndex,
      });
    }

    return true;
  }

  wrapSource(el: any) {
    const nodeDragSource = {
      beginDrag: (props: any) => {
        this.startDrag(props);

        return {
          node: props.node,
          parentNode: props.parentNode,
          path: props.path,
          treeIndex: props.treeIndex,
          treeId: props.treeId,
        };
      },

      endDrag: (props: any, monitor: any) => {
        this.endDrag(monitor.getDropResult());
      },

      isDragging: (props: any, monitor: any) => {
        const dropTargetNode = monitor.getItem().node;
        const draggedNode = props.node;

        return draggedNode === dropTargetNode;
      },
    };

    function nodeDragSourcePropInjection(connect: any, monitor: any) {
      return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        didDrop: monitor.didDrop(),
      };
    }

    return dragSource(
      this.dragDnDType,
      nodeDragSource,
      nodeDragSourcePropInjection
    )(el);
  }

  wrapTarget(el: any) {
    const nodeDropTarget = {
      drop: (dropTargetProps: any, monitor: any, component: any) => {
        const result = {
          node: monitor.getItem().node,
          path: monitor.getItem().path,
          treeIndex: monitor.getItem().treeIndex,
          treeId: this.treeId,
          minimumTreeIndex: dropTargetProps.treeIndex,
          depth: this.getTargetDepth(dropTargetProps, monitor, component),
        };

        this.drop(result);

        return result;
      },

      hover: (dropTargetProps: any, monitor: any, component: any) => {
        const targetDepth = this.getTargetDepth(
          dropTargetProps,
          monitor,
          component
        );
        const draggedNode = monitor.getItem().node;
        const needsRedraw =
          // Redraw if hovered above different nodes
          dropTargetProps.node !== draggedNode ||
          // Or hovered above the same node but at a different depth
          targetDepth !== dropTargetProps.path.length - 1;

        if (draggedNode.id === dropTargetProps.node.id) {
          this.resetLastMove();
        }

        if (!needsRedraw) {
          return;
        }

        if (
          draggedNode.id === this.lastMove.draggingId &&
          dropTargetProps.node.id === this.lastMove.hoveredId
        ) {
          return;
        }

        this.lastMove = {
          draggingId: draggedNode.id,
          hoveredId: dropTargetProps.node.id,
        };

        // throttle `dragHover` work to available animation frames
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          this.dragHover({
            node: draggedNode,
            path: monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.listIndex,
            depth: targetDepth,
          });
        });
      },

      canDrop: this.canDrop.bind(this),
    };

    function nodeDropTargetPropInjection(connect: any, monitor: any) {
      const dragged = monitor.getItem();
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : null,
      };
    }

    return dropTarget(
      this.dropDnDType,
      nodeDropTarget,
      nodeDropTargetPropInjection
    )(el);
  }

  wrapPlaceholder(el: any) {
    const placeholderDropTarget = {
      drop: (dropTargetProps: any, monitor: any) => {
        const { node, path, treeIndex } = monitor.getItem();
        const result = {
          node,
          path,
          treeIndex,
          treeId: this.treeId,
          minimumTreeIndex: 0,
          depth: 0,
        };

        this.drop(result);

        return result;
      },
    };

    function placeholderPropInjection(connect: any, monitor: any) {
      const dragged = monitor.getItem();
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : null,
      };
    }

    return dropTarget(
      this.dropDnDType,
      placeholderDropTarget,
      placeholderPropInjection
    )(el);
  }
}
