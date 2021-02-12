import SortableTree, {
  SortableTreeWithoutDndContext,
  // @ts-expect-error ts-migrate(6142) FIXME: Module './react-sortable-tree' was resolved to '/U... Remove this comment to see the full error message
} from './react-sortable-tree';

export * from './utils/default-handlers';
export * from './utils/tree-data-utils';
export default SortableTree;

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { SortableTreeWithoutDndContext };
