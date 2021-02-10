// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'fron... Remove this comment to see the full error message
import withScrolling, { createHorizontalStrength, createScrollingComponent, createVerticalStrength, } from 'frontend-collective-react-dnd-scrollzone';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import { DndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { polyfill } from 'react-lifecycles-compat';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
// @ts-expect-error ts-migrate(6142) FIXME: Module './node-renderer-default' was resolved to '... Remove this comment to see the full error message
import NodeRendererDefault from './node-renderer-default';
// @ts-expect-error ts-migrate(6142) FIXME: Module './placeholder-renderer-default' was resolv... Remove this comment to see the full error message
import PlaceholderRendererDefault from './placeholder-renderer-default';
import './react-sortable-tree.css';
// @ts-expect-error ts-migrate(6142) FIXME: Module './tree-node' was resolved to '/Users/jgow/... Remove this comment to see the full error message
import TreeNode from './tree-node';
// @ts-expect-error ts-migrate(6142) FIXME: Module './tree-node-no-scaffold' was resolved to '... Remove this comment to see the full error message
import TreeNodeNoScaffold from './tree-node-no-scaffold';
// @ts-expect-error ts-migrate(6142) FIXME: Module './tree-placeholder' was resolved to '/User... Remove this comment to see the full error message
import TreePlaceholder from './tree-placeholder';
import classnames from './utils/classnames';
import { defaultGetNodeKey, defaultSearchMethod, } from './utils/default-handlers';
import DndManager from './utils/dnd-manager';
import { slideRows } from './utils/generic-utils';
import { memoizedGetDescendantCount, memoizedGetFlatDataFromTree, memoizedInsertNode, } from './utils/memoized-tree-data-utils';
import { changeNodeAtPath, find, insertNode, removeNode, toggleExpandedForAll, walk, } from './utils/tree-data-utils';
let treeIdCounter = 1;
const mergeTheme = (props: any) => {
    const merged = {
        ...props,
        style: { ...props.theme.style, ...props.style },
        innerStyle: { ...props.theme.innerStyle, ...props.innerStyle },
        reactVirtualizedListProps: {
            ...props.theme.reactVirtualizedListProps,
            ...props.reactVirtualizedListProps,
        },
    };
    const overridableDefaults = {
        nodeContentRenderer: NodeRendererDefault,
        placeholderRenderer: PlaceholderRendererDefault,
        rowHeight: 62,
        scaffoldBlockPxWidth: 44,
        slideRegionSize: 100,
        treeNodeRenderer: props.ignoreScaffold ? TreeNodeNoScaffold : TreeNode,
    };
    Object.keys(overridableDefaults).forEach((propKey) => {
        // If prop has been specified, do not change it
        // If prop is specified in theme, use the theme setting
        // If all else fails, fall back to the default
        if (props[propKey] === null) {
            merged[propKey] =
                typeof props.theme[propKey] !== 'undefined'
                    ? props.theme[propKey]
                    : // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      overridableDefaults[propKey];
        }
    });
    return merged;
};
type OwnReactSortableTreeProps = {
    dragDropManager: {
        getMonitor?: (...args: any[]) => any;
    };
    treeData: any[];
    style?: {};
    className?: string;
    innerStyle?: {};
    rowHeight?: number | ((...args: any[]) => any);
    slideRegionSize?: number;
    reactVirtualizedListProps?: {};
    scaffoldBlockPxWidth?: number;
    maxDepth?: number;
    searchMethod?: (...args: any[]) => any;
    searchQuery?: any;
    searchFocusOffset?: number;
    searchFinishCallback?: (...args: any[]) => any;
    generateNodeProps?: (...args: any[]) => any;
    isVirtualized?: boolean;
    ignoreScaffold?: boolean;
    customRowHeight?: boolean;
    treeNodeRenderer?: (...args: any[]) => any;
    nodeContentRenderer?: (...args: any[]) => any;
    loaderRenderer?: (...args: any[]) => any;
    placeholderRenderer?: (...args: any[]) => any;
    theme?: {
        style?: {};
        innerStyle?: {};
        reactVirtualizedListProps?: {};
        scaffoldBlockPxWidth?: number;
        slideRegionSize?: number;
        rowHeight?: number | ((...args: any[]) => any);
        treeNodeRenderer?: (...args: any[]) => any;
        nodeContentRenderer?: (...args: any[]) => any;
        placeholderRenderer?: (...args: any[]) => any;
    };
    getNodeKey?: (...args: any[]) => any;
    onChange: (...args: any[]) => any;
    onMoveNode?: (...args: any[]) => any;
    canDrag?: ((...args: any[]) => any) | boolean;
    canDrop?: (...args: any[]) => any;
    canNodeHaveChildren?: (...args: any[]) => any;
    shouldCopyOnOutsideDrop?: ((...args: any[]) => any) | boolean;
    onVisibilityToggle?: (...args: any[]) => any;
    dragDnDType: string;
    dropDnDType: string[];
    onDragStateChanged?: (...args: any[]) => any;
    onlyExpandSearchedNodes?: boolean;
    rowDirection?: string;
};
type ReactSortableTreeState = any;
type ReactSortableTreeProps = OwnReactSortableTreeProps & typeof ReactSortableTree.defaultProps;
class ReactSortableTree extends Component<ReactSortableTreeProps, ReactSortableTreeState> {
    static defaultProps = {
        canDrag: true,
        canDrop: null,
        canNodeHaveChildren: () => true,
        className: '',
        generateNodeProps: null,
        getNodeKey: defaultGetNodeKey,
        innerStyle: {},
        isVirtualized: true,
        ignoreScaffold: false,
        customRowHeight: false,
        maxDepth: null,
        treeNodeRenderer: null,
        nodeContentRenderer: null,
        loaderRenderer: null,
        onMoveNode: () => { },
        onVisibilityToggle: () => { },
        placeholderRenderer: null,
        reactVirtualizedListProps: {},
        rowHeight: null,
        scaffoldBlockPxWidth: null,
        searchFinishCallback: null,
        searchFocusOffset: null,
        searchMethod: null,
        searchQuery: null,
        shouldCopyOnOutsideDrop: false,
        slideRegionSize: null,
        style: {},
        theme: {},
        onDragStateChanged: () => { },
        onlyExpandSearchedNodes: false,
        rowDirection: 'ltr',
    };
    clearMonitorSubscription: any;
    customRowHeight: any;
    dndManager: any;
    dragDnDType: any;
    dropDnDType: any;
    hStrength: any;
    ignoreScaffold: any;
    loaderRenderer: any;
    nodeContentRenderer: any;
    scrollTop: any;
    scrollZoneVirtualList: any;
    treeId: any;
    treeNodeRenderer: any;
    treePlaceholderRenderer: any;
    vStrength: any;
    constructor(props: ReactSortableTreeProps) {
        super(props);
        const { dragDnDType, dropDnDType, nodeContentRenderer, treeNodeRenderer, isVirtualized, ignoreScaffold, customRowHeight, loaderRenderer, slideRegionSize, } = mergeTheme(props);
        this.dndManager = new DndManager(this);
        // Wrapping classes for use with react-dnd
        this.treeId = `rst__${treeIdCounter}`;
        treeIdCounter += 1;
        this.dragDnDType = dragDnDType;
        this.dropDnDType = dropDnDType;
        this.loaderRenderer = loaderRenderer;
        this.ignoreScaffold = ignoreScaffold;
        this.customRowHeight = customRowHeight;
        this.nodeContentRenderer = this.dndManager.wrapSource(nodeContentRenderer);
        this.treePlaceholderRenderer = this.dndManager.wrapPlaceholder(TreePlaceholder);
        this.treeNodeRenderer = this.dndManager.wrapTarget(treeNodeRenderer);
        // Prepare scroll-on-drag options for this list
        if (isVirtualized) {
            this.scrollZoneVirtualList = (createScrollingComponent || withScrolling)(List);
            this.vStrength = createVerticalStrength(slideRegionSize);
            this.hStrength = createHorizontalStrength(slideRegionSize);
        }
        this.state = {
            draggingTreeData: null,
            draggedNode: null,
            draggedMinimumTreeIndex: null,
            draggedDepth: null,
            searchMatches: [],
            searchFocusTreeIndex: null,
            dragging: false,
            // props that need to be used in gDSFP or static functions will be stored here
            instanceProps: {
                treeData: [],
                ignoreOneTreeUpdate: false,
                searchQuery: null,
                searchFocusOffset: null,
            },
        };
        this.toggleChildrenVisibility = this.toggleChildrenVisibility.bind(this);
        this.moveNode = this.moveNode.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.dragHover = this.dragHover.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.drop = this.drop.bind(this);
        this.handleDndMonitorChange = this.handleDndMonitorChange.bind(this);
    }
    componentDidMount() {
        ReactSortableTree.loadLazyChildren(this.props, this.state);
        const stateUpdate = ReactSortableTree.search(this.props, this.state, true, true, false);
        this.setState(stateUpdate);
        // Hook into react-dnd state changes to detect when the drag ends
        // TODO: This is very brittle, so it needs to be replaced if react-dnd
        // offers a more official way to detect when a drag ends
        this.clearMonitorSubscription = (this.props as any).dragDropManager
            .getMonitor()
            .subscribeToStateChange(this.handleDndMonitorChange);
    }
    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        const { instanceProps } = prevState;
        const newState = {};
        const isTreeDataEqual = isEqual(instanceProps.treeData, nextProps.treeData);
        // make sure we have the most recent version of treeData
        instanceProps.treeData = nextProps.treeData;
        if (!isTreeDataEqual) {
            if (instanceProps.ignoreOneTreeUpdate) {
                instanceProps.ignoreOneTreeUpdate = false;
            }
            else {
                (newState as any).searchFocusTreeIndex = null;
                ReactSortableTree.loadLazyChildren(nextProps, prevState);
                Object.assign(newState, ReactSortableTree.search(nextProps, prevState, false, false, false));
            }
            (newState as any).draggingTreeData = null;
            (newState as any).draggedNode = null;
            (newState as any).draggedMinimumTreeIndex = null;
            (newState as any).draggedDepth = null;
            (newState as any).dragging = false;
        }
        else if (!isEqual(instanceProps.searchQuery, nextProps.searchQuery)) {
            Object.assign(newState, ReactSortableTree.search(nextProps, prevState, true, true, false));
        }
        else if (instanceProps.searchFocusOffset !== nextProps.searchFocusOffset) {
            Object.assign(newState, ReactSortableTree.search(nextProps, prevState, true, true, true));
        }
        instanceProps.searchQuery = nextProps.searchQuery;
        instanceProps.searchFocusOffset = nextProps.searchFocusOffset;
        (newState as any).instanceProps = { ...instanceProps, ...(newState as any).instanceProps };
        return newState;
    }
    // listen to dragging
    componentDidUpdate(prevProps: ReactSortableTreeProps, prevState: ReactSortableTreeState) {
        // if it is not the same then call the onDragStateChanged
        if (this.state.dragging !== prevState.dragging) {
            if ((this.props as any).onDragStateChanged) {
                (this.props as any).onDragStateChanged({
                    isDragging: this.state.dragging,
                    draggedNode: this.state.draggedNode,
                });
            }
        }
    }
    componentWillUnmount() {
        this.clearMonitorSubscription();
    }
    getRows(treeData: any) {
        return memoizedGetFlatDataFromTree({
            ignoreCollapsed: true,
            getNodeKey: (this.props as any).getNodeKey,
            treeData,
        });
    }
    handleDndMonitorChange() {
        const monitor = (this.props as any).dragDropManager.getMonitor();
        // If the drag ends and the tree is still in a mid-drag state,
        // it means that the drag was canceled or the dragSource dropped
        // elsewhere, and we should reset the state of this tree
        if (!monitor.isDragging() && this.state.draggingTreeData) {
            setTimeout(() => {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
                this.endDrag();
            });
        }
    }
    toggleChildrenVisibility({ node: targetNode, path }: any) {
        const { instanceProps } = this.state;
        const treeData = changeNodeAtPath({
            treeData: instanceProps.treeData,
            path,
            newNode: ({ node }: any) => ({ ...node, expanded: !node.expanded }),
            getNodeKey: (this.props as any).getNodeKey,
        });
        (this.props as any).onChange(treeData);
        (this.props as any).onVisibilityToggle({
            treeData,
            node: targetNode,
            expanded: !targetNode.expanded,
            path,
        });
    }
    moveNode({ node, path: prevPath, treeIndex: prevTreeIndex, depth, minimumTreeIndex }: any) {
        const { treeData, treeIndex, path, parentNode: nextParentNode, } = insertNode({
            treeData: this.state.draggingTreeData,
            newNode: node,
            depth,
            minimumTreeIndex,
            expandParent: true,
            getNodeKey: (this.props as any).getNodeKey,
        });
        (this.props as any).onChange(treeData);
        (this.props as any).onMoveNode({
            treeData,
            node,
            treeIndex,
            path,
            nextPath: path,
            nextTreeIndex: treeIndex,
            prevPath,
            prevTreeIndex,
            nextParentNode,
        });
    }
    // returns the new state after search
    static search(props: any, state: any, seekIndex: any, expand: any, singleSearch: any) {
        const { onChange, getNodeKey, searchFinishCallback, searchQuery, searchMethod, searchFocusOffset, onlyExpandSearchedNodes, } = props;
        const { instanceProps } = state;
        // Skip search if no conditions are specified
        if (!searchQuery && !searchMethod) {
            if (searchFinishCallback) {
                searchFinishCallback([]);
            }
            return { searchMatches: [] };
        }
        const newState = { instanceProps: {} };
        // if onlyExpandSearchedNodes collapse the tree and search
        const { treeData: expandedTreeData, matches: searchMatches } = find({
            getNodeKey,
            treeData: onlyExpandSearchedNodes
                ? toggleExpandedForAll({
                    treeData: instanceProps.treeData,
                    expanded: false,
                })
                : instanceProps.treeData,
            searchQuery,
            searchMethod: searchMethod || defaultSearchMethod,
            searchFocusOffset,
            expandAllMatchPaths: expand && !singleSearch,
            expandFocusMatchPaths: !!expand,
        });
        // Update the tree with data leaving all paths leading to matching nodes open
        if (expand) {
            (newState.instanceProps as any).ignoreOneTreeUpdate = true; // Prevents infinite loop
            onChange(expandedTreeData);
        }
        if (searchFinishCallback) {
            searchFinishCallback(searchMatches);
        }
        let searchFocusTreeIndex = null;
        if (seekIndex &&
            searchFocusOffset !== null &&
            searchFocusOffset < searchMatches.length) {
            searchFocusTreeIndex = searchMatches[searchFocusOffset].treeIndex;
        }
        (newState as any).searchMatches = searchMatches;
        (newState as any).searchFocusTreeIndex = searchFocusTreeIndex;
        return newState;
    }
    startDrag({ path }: any) {
        this.setState((prevState: any) => {
            const { treeData: draggingTreeData, node: draggedNode, treeIndex: draggedMinimumTreeIndex, } = removeNode({
                treeData: prevState.instanceProps.treeData,
                path,
                getNodeKey: (this.props as any).getNodeKey,
            });
            return {
                draggingTreeData,
                draggedNode,
                draggedDepth: path.length - 1,
                draggedMinimumTreeIndex,
                dragging: true,
            };
        });
    }
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'draggedNode' implicitly has an 'a... Remove this comment to see the full error message
    dragHover({ node: draggedNode, depth: draggedDepth, minimumTreeIndex: draggedMinimumTreeIndex, }) {
        // Ignore this hover if it is at the same position as the last hover
        if (this.state.draggedDepth === draggedDepth &&
            this.state.draggedMinimumTreeIndex === draggedMinimumTreeIndex) {
            return;
        }
        this.setState(({ draggingTreeData, instanceProps }: any) => {
            // Fall back to the tree data if something is being dragged in from
            //  an external element
            const newDraggingTreeData = draggingTreeData || instanceProps.treeData;
            const addedResult = memoizedInsertNode({
                treeData: newDraggingTreeData,
                newNode: draggedNode,
                depth: draggedDepth,
                minimumTreeIndex: draggedMinimumTreeIndex,
                expandParent: true,
                getNodeKey: (this.props as any).getNodeKey,
            });
            const rows = this.getRows(addedResult.treeData);
            const expandedParentPath = rows[addedResult.treeIndex].path;
            return {
                draggedNode,
                draggedDepth,
                draggedMinimumTreeIndex,
                draggingTreeData: changeNodeAtPath({
                    treeData: newDraggingTreeData,
                    path: expandedParentPath.slice(0, -1),
                    newNode: ({ node }: any) => ({ ...node, expanded: true }),
                    getNodeKey: (this.props as any).getNodeKey,
                }),
                // reset the scroll focus so it doesn't jump back
                // to a search result while dragging
                searchFocusTreeIndex: null,
                dragging: true,
            };
        });
    }
    endDrag(dropResult: any) {
        const { instanceProps } = this.state;
        const resetTree = () => this.setState({
            draggingTreeData: null,
            draggedNode: null,
            draggedMinimumTreeIndex: null,
            draggedDepth: null,
            dragging: false,
        });
        // Drop was cancelled
        if (!dropResult) {
            resetTree();
            this.dndManager.resetLastMove();
        }
        else if (dropResult.treeId !== this.treeId) {
            // The node was dropped in an external drop target or tree
            const { node, path, treeIndex } = dropResult;
            let shouldCopy = (this.props as any).shouldCopyOnOutsideDrop;
            if (typeof shouldCopy === 'function') {
                shouldCopy = shouldCopy({
                    node,
                    prevTreeIndex: treeIndex,
                    prevPath: path,
                });
            }
            let treeData = this.state.draggingTreeData || instanceProps.treeData;
            // If copying is enabled, a drop outside leaves behind a copy in the
            //  source tree
            if (shouldCopy) {
                treeData = changeNodeAtPath({
                    treeData: instanceProps.treeData,
                    path,
                    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'copyNode' implicitly has an 'any'... Remove this comment to see the full error message
                    newNode: ({ node: copyNode }) => ({ ...copyNode }),
                    getNodeKey: (this.props as any).getNodeKey,
                });
            }
            (this.props as any).onChange(treeData);
            (this.props as any).onMoveNode({
                treeData,
                node,
                treeIndex: null,
                path: null,
                nextPath: null,
                nextTreeIndex: null,
                prevPath: path,
                prevTreeIndex: treeIndex,
            });
        }
    }
    drop(dropResult: any) {
        this.moveNode(dropResult);
    }
    canNodeHaveChildren(node: any) {
        const { canNodeHaveChildren } = this.props;
        if (canNodeHaveChildren) {
            // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
            return canNodeHaveChildren(node);
        }
        return true;
    }
    // Load any children in the tree that are given by a function
    // calls the onChange callback on the new treeData
    static loadLazyChildren(props: any, state: any) {
        const { instanceProps } = state;
        walk({
            treeData: instanceProps.treeData,
            getNodeKey: props.getNodeKey,
            callback: ({ node, path, lowerSiblingCounts, treeIndex }: any) => {
                // If the node has children defined by a function, and is either expanded
                //  or set to load even before expansion, run the function.
                if (node.children &&
                    typeof node.children === 'function' &&
                    (node.expanded || props.loadCollapsedLazyChildren)) {
                    // Call the children fetching function
                    node.children({
                        node,
                        path,
                        lowerSiblingCounts,
                        treeIndex,
                        // Provide a helper to append the new data when it is received
                        done: (childrenArray: any) => props.onChange(changeNodeAtPath({
                            treeData: instanceProps.treeData,
                            path,
                            // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'oldNode' implicitly has an 'any' ... Remove this comment to see the full error message
                            newNode: ({ node: oldNode }) => 
                            // Only replace the old node if it's the one we set off to find children
                            //  for in the first place
                            oldNode === node
                                ? {
                                    ...oldNode,
                                    children: childrenArray,
                                }
                                : oldNode,
                            getNodeKey: props.getNodeKey,
                        })),
                    });
                }
            },
        });
    }
    renderRow(row: any, { listIndex, style, getPrevRow, matchKeys, swapFrom, swapDepth, swapLength }: any) {
        const { node, parentNode, path, lowerSiblingCounts, treeIndex } = row;
        const { canDrag, generateNodeProps, scaffoldBlockPxWidth, searchFocusOffset, rowDirection, } = mergeTheme(this.props);
        const TreeNodeRenderer = this.treeNodeRenderer;
        const NodeContentRenderer = this.nodeContentRenderer;
        const nodeKey = path[path.length - 1];
        const isSearchMatch = nodeKey in matchKeys;
        const isSearchFocus = isSearchMatch && matchKeys[nodeKey] === searchFocusOffset;
        const callbackParams = {
            node,
            parentNode,
            path,
            lowerSiblingCounts,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
        };
        const nodeProps = !generateNodeProps
            ? {}
            : generateNodeProps(callbackParams);
        const rowCanDrag = typeof canDrag !== 'function' ? canDrag : canDrag(callbackParams);
        const sharedProps = {
            treeIndex,
            scaffoldBlockPxWidth,
            node,
            path,
            treeId: this.treeId,
            rowDirection,
        };
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        return (<TreeNodeRenderer style={style} key={node.id || nodeKey} listIndex={listIndex} getPrevRow={getPrevRow} lowerSiblingCounts={lowerSiblingCounts} swapFrom={swapFrom} swapLength={swapLength} swapDepth={swapDepth} loaderRenderer={this.loaderRenderer} {...sharedProps}>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <NodeContentRenderer parentNode={parentNode} isSearchMatch={isSearchMatch} isSearchFocus={isSearchFocus} canDrag={rowCanDrag} toggleChildrenVisibility={this.toggleChildrenVisibility} {...sharedProps} {...nodeProps}/>
      </TreeNodeRenderer>);
    }
    render() {
        const { dragDropManager, style, className, innerStyle, rowHeight, isVirtualized, placeholderRenderer, reactVirtualizedListProps, getNodeKey, rowDirection, } = mergeTheme(this.props);
        const { searchMatches, searchFocusTreeIndex, draggedNode, draggedDepth, draggedMinimumTreeIndex, instanceProps, } = this.state;
        const treeData = this.state.draggingTreeData || instanceProps.treeData;
        const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;
        let rows: any;
        let swapFrom: any = null;
        let swapLength: any = null;
        if (draggedNode && draggedMinimumTreeIndex !== null) {
            const addedResult = memoizedInsertNode({
                treeData,
                newNode: draggedNode,
                depth: draggedDepth,
                minimumTreeIndex: draggedMinimumTreeIndex,
                expandParent: true,
                getNodeKey,
            });
            const swapTo = draggedMinimumTreeIndex;
            swapFrom = addedResult.treeIndex;
            swapLength = 1 + memoizedGetDescendantCount({ node: draggedNode });
            rows = slideRows(this.getRows(addedResult.treeData), swapFrom, swapTo, swapLength);
        }
        else {
            rows = this.getRows(treeData);
        }
        // Get indices for rows that match the search conditions
        const matchKeys = {};
        searchMatches.forEach(({ path }: any, i: any) => {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            matchKeys[path[path.length - 1]] = i;
        });
        // Seek to the focused search result if there is one specified
        const scrollToInfo = searchFocusTreeIndex !== null
            ? { scrollToIndex: searchFocusTreeIndex }
            : {};
        let containerStyle = style;
        let list;
        if (rows.length < 1) {
            const Placeholder = this.treePlaceholderRenderer;
            const PlaceholderContent = placeholderRenderer;
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            list = (<Placeholder treeId={this.treeId} drop={this.drop}>
          {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
          <PlaceholderContent />
        </Placeholder>);
        }
        else if (isVirtualized) {
            containerStyle = { height: '100%', ...containerStyle };
            const ScrollZoneVirtualList = this.scrollZoneVirtualList;
            // Render list with react-virtualized
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            list = (<AutoSizer>
          {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
          {({ height, width }) => (<ScrollZoneVirtualList {...scrollToInfo} dragDropManager={dragDropManager} verticalStrength={this.vStrength} horizontalStrength={this.hStrength} speed={30} scrollToAlignment="start" className="rst__virtualScrollOverride" width={width} onScroll={({ scrollTop }: any) => {
                this.scrollTop = scrollTop;
            }} height={height} style={innerStyle} rowCount={rows.length} estimatedRowSize={typeof rowHeight !== 'function' ? rowHeight : undefined} rowHeight={typeof rowHeight !== 'function'
                ? rowHeight
                : ({ index }: any) => rowHeight({
                    index,
                    treeIndex: index,
                    node: rows[index].node,
                    path: rows[index].path,
                })} rowRenderer={({ index, style: rowStyle }: any) => this.renderRow(rows[index], {
                listIndex: index,
                style: rowStyle,
                getPrevRow: () => rows[index - 1] || null,
                matchKeys,
                swapFrom,
                swapDepth: draggedDepth,
                swapLength,
            })} {...reactVirtualizedListProps}/>)}
        </AutoSizer>);
        }
        else {
            // Render list without react-virtualized
            list = rows.map((row: any, index: any) => this.renderRow(row, {
                listIndex: index,
                style: {
                    height: typeof rowHeight !== 'function'
                        ? rowHeight
                        : rowHeight({
                            index,
                            treeIndex: index,
                            node: row.node,
                            path: row.path,
                        }),
                },
                getPrevRow: () => rows[index - 1] || null,
                matchKeys,
                swapFrom,
                swapDepth: draggedDepth,
                swapLength,
            }));
        }
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        return (<div className={classnames('rst__tree', className, rowDirectionClass)} style={containerStyle}>
        {list}
      </div>);
    }
}
polyfill(ReactSortableTree);
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const SortableTreeWithoutDndContext = (props: any) => <DndContext.Consumer>
  {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
  {({ dragDropManager }) => dragDropManager === undefined ? null : (<ReactSortableTree {...props} dragDropManager={dragDropManager}/>)}
</DndContext.Consumer>;
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
const SortableTree = (props: any) => <DndProvider backend={HTML5Backend}>
  {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
  <SortableTreeWithoutDndContext {...props}/>
</DndProvider>;
// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { SortableTreeWithoutDndContext };
export default SortableTree;
