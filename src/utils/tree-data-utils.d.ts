import { FullTree, TreePath, TreeItem, TreeIndex, SearchData, NodeData, TreeNode, FlatDataItem } from '..';

export type GetNodeKeyFunction<T> = (data: TreeIndex & TreeNode<T>) => string | number;
export type WalkAndMapFunctionParameters<T> = FullTree<T> & {getNodeKey: GetNodeKeyFunction<T>, callback: Function, ignoreCollapsed?: boolean, maxLength?: number};

export function getDescendantCount<T>(data: TreeNode<T> & {ignoreCollapsed?: boolean}): number;
export function getVisibleNodeCount<T>(data: FullTree<T>): number;
export function getVisibleNodeInfoAtIndex<T>(
    data: FullTree<T> & {
        index: number,
        getNodeKey: GetNodeKeyFunction<T>,
    }): TreeNode<T> & TreePath & {lowerSiblingsCounts: number[]} | null;
export function walk<T>(data: WalkAndMapFunctionParameters<T>): void;
export function map<T>(data: WalkAndMapFunctionParameters<T>): TreeItem<T>[];
export function toggleExpandedForAll<T>(
    data: FullTree<T> & {
        expanded?: boolean,
    },
): TreeItem<T>[];
export function changeNodeAtPath<T>(
    data: FullTree<T> & TreePath & {
        newNode: Function | any,
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
    },
): TreeItem<T>[];
export function removeNodeAtPath<T>(
    data: FullTree<T> & TreePath & {
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
    },
): TreeItem<T>[];
export function removeNode<T>(
    data: FullTree<T> & TreePath & {
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
    },
): (FullTree<T> & TreeNode<T> & TreeIndex) | null;
export function getNodeAtPath<T>(
    data: FullTree<T> & TreePath & {
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
    },
): (TreeNode<T> & TreeIndex) | null;
export function addNodeUnderParent<T>(
    data: FullTree<T> & {
        newNode: TreeItem<T>,
        parentKey?: number | string,
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
        expandParent?: boolean,
        addAsFirstChild?: boolean,
    },
): FullTree<T> & TreeIndex;
export function insertNode<T>(
    data: FullTree<T> & {
        depth: number,
        newNode: TreeItem<T>,
        minimumTreeIndex: number,
        ignoreCollapsed?: boolean,
        expandParent?: boolean,
        getNodeKey: GetNodeKeyFunction<T>,
    },
): FullTree<T> & TreeIndex & TreePath & {parentNode: TreeItem<T>};
export function getFlatDataFromTree<T>(
    data: FullTree<T> & {
        getNodeKey: GetNodeKeyFunction<T>,
        ignoreCollapsed?: boolean,
    },
): FlatDataItem<T>[];
export function getTreeFromFlatData<T, K extends keyof T, P extends keyof T, I extends string | number>(
    data: {
        flatData: T[] | I extends string ? { [key: string]: T } : { [key: number]: T },
        // tslint:disable-next-line:no-unnecessary-generics
        getKey?: (item: T) => T[K],
        // tslint:disable-next-line:no-unnecessary-generics
        getParentKey?: (item: T) => T[P],
        rootKey?: I,
    },
): TreeItem<T>[];
export function isDescendant<T>(older: TreeItem<T>, younger: TreeItem<T>): boolean;
export function getDepth<T>(node: TreeItem<T>, depth?: number): number;
export function find<T>(
    data: FullTree<T> & {
        getNodeKey: GetNodeKeyFunction<T>,
        searchQuery?: string | number,
        searchMethod: (data: SearchData<T>) => boolean,
        searchFocusOffset?: number,
        expandAllMatchPaths?: boolean,
        expandFocusMatchPaths?: boolean,
    },
): {matches: NodeData<T>[]} & FullTree<T>;
