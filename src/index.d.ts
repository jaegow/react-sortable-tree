// Type definitions for react-sortable-tree 0.3
// Project: https://frontend-collective.github.io/react-sortable-tree
// Definitions by: Wouter Hardeman <https://github.com/wouterhardeman>
//                 Jovica Zoric <https://github.com/jzoric>
//                 Kevin Perrine <https://github.com/kevinsperrine>;
//                 Alex Maclean <https://github.com/acemac>
//                 Jan Dolezel <https://github.com/dolezel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import * as React from 'react';
import { ListProps, Index } from 'react-virtualized';
import { ConnectDragSource, ConnectDragPreview, ConnectDropTarget } from 'react-dnd';

export * from './utils/tree-data-utils';
export * from './utils/default-handlers';

export interface GetTreeItemChildren<T> {
  done: (children: TreeItem<T>[]) => void;
  node: TreeItem<T>;
  path: NumberOrStringArray;
  lowerSiblingCounts: number[];
  treeIndex: number;
}

export type GetTreeItemChildrenFn<T> = (data: GetTreeItemChildren<T>) => void;

export interface TreeItem<T> {
  id: number;
  itemRef: T;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  expanded?: boolean;
  children?: TreeItem<T>[] | GetTreeItemChildrenFn<T>;
  [x: string]: any;
}

export interface TreeNode<T> {
  node: TreeItem<T>;
}

export interface TreePath {
  path: NumberOrStringArray;
}

export interface TreeIndex {
  treeIndex: number;
}

export interface FullTree<T> {
  treeData: TreeItem<T>[];
}

export interface NodeData<T> extends TreeNode<T>, TreePath, TreeIndex {}

export interface FlatDataItem<T> extends TreeNode<T>, TreePath {
  lowerSiblingCounts: number[];
  parentNode: TreeItem<T>;
}

export interface SearchData<T> extends NodeData<T> {
  searchQuery: any;
}

export interface ExtendedNodeData<T> extends NodeData<T> {
  parentNode: TreeItem<T>;
  lowerSiblingCounts: number[];
  isSearchMatch: boolean;
  isSearchFocus: boolean;
}

export interface OnVisibilityToggleData<T> extends FullTree<T>, TreeNode<T> {
  expanded: boolean;
}

export interface OnDragStateChangedData<T> {
  isDragging: boolean;
  draggedNode: TreeItem<T>;
}

interface PreviousAndNextLocation {
  prevTreeIndex: number;
  prevPath: NumberOrStringArray;
  nextTreeIndex: number;
  nextPath: NumberOrStringArray;
}

export interface OnDragPreviousAndNextLocation<T> extends PreviousAndNextLocation {
  prevParent: TreeItem<T> | null;
  nextParent: TreeItem<T> | null;
}

export interface ShouldCopyData<T> {
  node: TreeNode<T>;
  prevPath: NumberOrStringArray;
  prevTreeIndex: number;
}

export interface OnMovePreviousAndNextLocation<T> extends PreviousAndNextLocation {
  nextParentNode: TreeItem<T> | null;
}

export type NodeRenderer<T> = React.ComponentType<NodeRendererProps<T>>;

export interface NodeRendererProps<T> {
  node: TreeItem<T>;
  path: NumberOrStringArray;
  treeIndex: number;
  isSearchMatch: boolean;
  isSearchFocus: boolean;
  canDrag: boolean;
  scaffoldBlockPxWidth: number;
  toggleChildrenVisibility?(data: NodeData<T>): void;
  buttons?: JSX.Element[];
  className?: string;
  style?: React.CSSProperties;
  title?: (data: NodeData<T>) => JSX.Element | JSX.Element;
  subtitle?: (data: NodeData<T>) => JSX.Element | JSX.Element;
  icons?: JSX.Element[];
  lowerSiblingCounts: number[];
  swapDepth?: number;
  swapFrom?: number;
  swapLength?: number;
  listIndex: number;
  treeId: string;
  rowDirection?: 'ltr' | 'rtl';

  connectDragPreview: ConnectDragPreview;
  connectDragSource: ConnectDragSource;
  parentNode?: TreeItem<T>;
  startDrag: any;
  endDrag: any;
  isDragging: boolean;
  didDrop: boolean;
  draggedNode?: TreeItem<T>;
  isOver: boolean;
  canDrop?: boolean;
}

export type PlaceholderRenderer<T> = React.ComponentType<PlaceholderRendererProps<T>>;

export interface PlaceholderRendererProps<T> {
  isOver: boolean;
  canDrop: boolean;
  draggedNode: TreeItem<T>;
}

type NumberOrStringArray = Array<string | number>;

export type TreeRenderer<T> = React.ComponentType<TreeRendererProps<T>>;

export interface TreeRendererProps<T> {
  treeIndex: number;
  treeId: string;
  swapFrom?: number;
  swapDepth?: number;
  swapLength?: number;
  scaffoldBlockPxWidth: number;
  lowerSiblingCounts: number[];
  rowDirection?: 'ltr' | 'rtl';

  listIndex: number;
  children: JSX.Element[];
  style?: React.CSSProperties;

  // Drop target
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop?: boolean;
  draggedNode?: TreeItem<T>;

  // used in dndManager
  getPrevRow: () => FlatDataItem<T> | null;
  node: TreeItem<T>;
  path: NumberOrStringArray;
}

interface ThemeTreeProps<T> {
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  reactVirtualizedListProps?: Partial<ListProps>;
  scaffoldBlockPxWidth?: number;
  slideRegionSize?: number;
  rowHeight?: ((info: NodeData<T> & Index) => number) | number;
  nodeContentRenderer?: NodeRenderer<T>;
  placeholderRenderer?: PlaceholderRenderer<T>;
}

export interface ThemeProps<T> extends ThemeTreeProps<T> {
  treeNodeRenderer?: TreeRenderer<T>;
}

export interface ReactSortableTreeProps<T> extends ThemeTreeProps<T> {
  treeData: TreeItem<T>[];
  onChange(treeData: TreeItem<T>[]): void;
  getNodeKey?(data: TreeNode<T> & TreeIndex): string | number;
  generateNodeProps?(data: ExtendedNodeData<T>): { [index: string]: any };
  onMoveNode?(data: NodeData<T> & FullTree<T> & OnMovePreviousAndNextLocation<T>): void;
  onVisibilityToggle?(data: OnVisibilityToggleData<T>): void;
  onDragStateChanged?(data: OnDragStateChangedData<T>): void;
  maxDepth?: number;
  rowDirection?: 'ltr' | 'rtl';
  canDrag?: ((data: ExtendedNodeData<T>) => boolean) | boolean;
  canDrop?(data: OnDragPreviousAndNextLocation<T> & NodeData<T>): boolean;
  canNodeHaveChildren?(node: TreeItem<T>): boolean;
  theme?: ThemeProps<T>;
  searchMethod?(data: SearchData<T>): boolean;
  searchQuery?: string | any;
  searchFocusOffset?: number;
  onlyExpandSearchedNodes?: boolean;
  searchFinishCallback?(matches: NodeData<T>[]): void;
  shouldCopyOnOutsideDrop?: boolean | ((data: ShouldCopyData<T>) => boolean);
  className?: string;
  loaderRenderer?: (index: number) => React.ReactNode;
  isVirtualized?: boolean;
  ignoreScaffold?: boolean;
  customRowHeight?: boolean;
  dragDnDType: string;
  dropDnDType: string[];
}

declare function SortableTree<T>(props: ReactSortableTreeProps<T>): React.ReactElement;

export function SortableTreeWithoutDndContext<T>(props: ReactSortableTreeProps<T>): React.ReactElement;

export default SortableTree;
