/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import renderer from 'react-test-renderer';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import { mount } from 'enzyme';
import { List } from 'react-virtualized';
import { DndProvider, DndContext } from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
// @ts-expect-error ts-migrate(6142) FIXME: Module './react-sortable-tree' was resolved to '/U... Remove this comment to see the full error message
import SortableTree, { SortableTreeWithoutDndContext } from './react-sortable-tree';
// @ts-expect-error ts-migrate(6142) FIXME: Module './tree-node' was resolved to '/Users/jgow/... Remove this comment to see the full error message
import TreeNode from './tree-node';
// @ts-expect-error ts-migrate(6142) FIXME: Module './node-renderer-default' was resolved to '... Remove this comment to see the full error message
import DefaultNodeRenderer from './node-renderer-default';
describe('<SortableTree />', () => {
  it('should render tree correctly', () => {
    const tree = renderer
      //
      .create(<SortableTree treeData={[{}]} onChange={() => {}} dragDnDType="example" dropDnDType={['example']} />, {
        createNodeMock: () => ({}),
      })
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should render nodes for flat data', () => {
    let wrapper;
    // No nodes
    //
    wrapper = mount(<SortableTree treeData={[]} onChange={() => {}} dragDnDType="example" dropDnDType={['example']} />);
    expect(wrapper.find(TreeNode).length).toEqual(0);
    // Single node
    //
    wrapper = mount(
      <SortableTree treeData={[{}]} onChange={() => {}} dragDnDType="example" dropDnDType={['example']} />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(1);
    // Two nodes
    //
    wrapper = mount(
      <SortableTree treeData={[{}, {}]} onChange={() => {}} dragDnDType="example" dropDnDType={['example']} />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(2);
  });
  it('should render nodes for nested, expanded data', () => {
    let wrapper;
    // Single Nested
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ expanded: true, children: [{}] }]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(2);
    // Double Nested
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ expanded: true, children: [{ expanded: true, children: [{}] }] }]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(3);
    // 2x Double Nested Siblings
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[
          { expanded: true, children: [{ expanded: true, children: [{}] }] },
          { expanded: true, children: [{ expanded: true, children: [{}] }] },
        ]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(6);
  });
  it('should render nodes for nested, collapsed data', () => {
    let wrapper;
    // Single Nested
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ expanded: false, children: [{}] }]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(1);
    // Double Nested
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ expanded: false, children: [{ expanded: false, children: [{}] }] }]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(1);
    // 2x Double Nested Siblings, top level of first expanded
    //
    wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[
          { expanded: true, children: [{ expanded: false, children: [{}] }] },
          { expanded: false, children: [{ expanded: false, children: [{}] }] },
        ]}
        onChange={() => {}}
      />,
    );
    expect(wrapper.find(TreeNode).length).toEqual(3);
  });
  it('should reveal hidden nodes when visibility toggled', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a', children: [{ title: 'b' }] }]}
        onChange={(treeData: any) => wrapper.setProps({ treeData })}
      />,
    );
    // Check nodes in collapsed state
    expect(wrapper.find(TreeNode).length).toEqual(1);
    // Expand node and check for the existence of the revealed child
    wrapper.find('.rst__expandButton').first().simulate('click');
    expect(wrapper.find(TreeNode).length).toEqual(2);
    // Collapse node and make sure the child has been hidden
    wrapper.find('.rst__collapseButton').first().simulate('click');
    expect(wrapper.find(TreeNode).length).toEqual(1);
  });
  it('should change outer wrapper style via `style` and `className` props', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        style={{ borderWidth: 42 }}
        className="extra-classy"
      />,
    );
    (expect(wrapper.find('.rst__tree')) as any).toHaveStyle('borderWidth', 42);
    (expect(wrapper.find('.rst__tree')) as any).toHaveClassName('extra-classy');
  });
  it('should change style of scroll container with `innerStyle` prop', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        innerStyle={{ borderWidth: 42 }}
      />,
    );
    (expect(wrapper.find('.rst__virtualScrollOverride').first()) as any).toHaveStyle('borderWidth', 42);
  });
  it('should change height according to rowHeight prop', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }, { title: 'b', extraHeight: 2 }]}
        onChange={() => {}}
        rowHeight={12}
      />,
    );
    // Works with static value
    (expect(wrapper.find(TreeNode).first()) as any).toHaveStyle('height', 12);
    // Works with function callback
    wrapper.setProps({ rowHeight: ({ node }: any) => 42 + (node.extraHeight || 0) });
    (expect(wrapper.find(TreeNode).first()) as any).toHaveStyle('height', 42);
    (expect(wrapper.find(TreeNode).last()) as any).toHaveStyle('height', 44);
  });
  it('should toggle virtualization according to isVirtualized prop', () => {
    //
    const virtualized = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }, { title: 'b' }]}
        onChange={() => {}}
        isVirtualized
      />,
    );
    expect(virtualized.find(List).length).toEqual(1);
    //
    const notVirtualized = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }, { title: 'b' }]}
        onChange={() => {}}
        isVirtualized={false}
      />,
    );
    expect(notVirtualized.find(List).length).toEqual(0);
  });
  it('should change scaffold width according to scaffoldBlockPxWidth prop', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        scaffoldBlockPxWidth={12}
      />,
    );
    (expect(wrapper.find('.rst__lineBlock')) as any).toHaveStyle('width', 12);
  });
  it('should pass props to the node renderer from `generateNodeProps`', () => {
    const title = 42;
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title }]}
        onChange={() => {}}
        generateNodeProps={({ node }: any) => ({ buttons: [node.title] })}
      />,
    );
    (expect(wrapper.find(DefaultNodeRenderer)) as any).toHaveProp('buttons', [title]);
  });
  it('should call the callback in `onVisibilityToggle` when visibility toggled', () => {
    let out = null;
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a', children: [{ title: 'b' }] }]}
        onChange={(treeData: any) => wrapper.setProps({ treeData })}
        onVisibilityToggle={({ expanded }: any) => {
          out = expanded ? 'expanded' : 'collapsed';
        }}
      />,
    );
    wrapper.find('.rst__expandButton').first().simulate('click');
    expect(out).toEqual('expanded');
    wrapper.find('.rst__collapseButton').first().simulate('click');
    expect(out).toEqual('collapsed');
  });
  it('should render with a custom `nodeContentRenderer`', () => {
    class FakeNode extends Component {
      render() {
        //
        return <div>{(this.props as any).node.title}</div>;
      }
    }
    (FakeNode as any).propTypes = {
      node: PropTypes.shape({ title: PropTypes.string }).isRequired,
    };
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        nodeContentRenderer={FakeNode}
      />,
    );
    expect(wrapper.find(FakeNode).length).toEqual(1);
  });
  it('search should call searchFinishCallback', () => {
    const searchFinishCallback = jest.fn();
    //
    mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[{ title: 'a', children: [{ title: 'b' }] }]}
        searchQuery="b"
        searchFocusOffset={0}
        searchFinishCallback={searchFinishCallback}
        onChange={() => {}}
      />,
    );
    expect(searchFinishCallback).toHaveBeenCalledWith([
      // Node should be found expanded
      { node: { title: 'b' }, path: [0, 1], treeIndex: 1 },
    ]);
  });
  it('search should expand all matches and seek out the focus offset', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[
          { title: 'a', children: [{ title: 'b' }] },
          { title: 'a', children: [{ title: 'be' }] },
        ]}
        searchQuery="b"
        onChange={() => {}}
      />,
    );
    const tree = wrapper.find('ReactSortableTree').instance();
    expect(tree.state.searchMatches).toEqual([
      { node: { title: 'b' }, path: [0, 1], treeIndex: 1 },
      { node: { title: 'be' }, path: [2, 3], treeIndex: 3 },
    ]);
    expect(tree.state.searchFocusTreeIndex).toEqual(null);
    wrapper.setProps({ searchFocusOffset: 0 });
    expect(tree.state.searchFocusTreeIndex).toEqual(1);
    wrapper.setProps({ searchFocusOffset: 1 });
    // As the empty `onChange` we use here doesn't actually change
    // the tree, the expansion of all nodes doesn't get preserved
    // after the first mount, and this change in searchFocusOffset
    // only triggers the opening of a single path.
    // Therefore it's 2 instead of 3.
    expect(tree.state.searchFocusTreeIndex).toEqual(2);
  });
  it('search onlyExpandSearchedNodes should collapse all nodes except matches', () => {
    //
    const wrapper = mount(
      <SortableTree
        dragDnDType="example"
        dropDnDType={['example']}
        treeData={[
          {
            title: 'a',
            children: [{ title: 'b', children: [{ title: 'c' }] }],
          },
          {
            title: 'b',
            children: [{ title: 'd', children: [{ title: 'be' }] }],
          },
          {
            title: 'c',
            children: [{ title: 'f', children: [{ title: 'dd' }] }],
          },
        ]}
        onChange={(treeData: any) => wrapper.setProps({ treeData })}
        onlyExpandSearchedNodes
      />,
    );
    wrapper.setProps({ searchQuery: 'be' });
    expect(wrapper.prop('treeData')).toEqual([
      {
        title: 'a',
        children: [
          {
            title: 'b',
            children: [
              {
                title: 'c',
                expanded: false,
              },
            ],
            expanded: false,
          },
        ],
        expanded: false,
      },
      {
        title: 'b',
        children: [
          {
            title: 'd',
            children: [
              {
                title: 'be',
                expanded: false,
              },
            ],
            expanded: true,
          },
        ],
        expanded: true,
      },
      {
        title: 'c',
        children: [
          {
            title: 'f',
            children: [
              {
                title: 'dd',
                expanded: false,
              },
            ],
            expanded: false,
          },
        ],
        expanded: false,
      },
    ]);
  });
  it('loads using SortableTreeWithoutDndContext', () => {
    //
    expect(
      mount(
        <DndProvider backend={HTML5Backend}>
          <SortableTreeWithoutDndContext
            dragDnDType="example"
            dropDnDType={['example']}
            treeData={[{ title: 'a' }]}
            onChange={() => {}}
          />
        </DndProvider>,
      ),
    ).toBeDefined();
    //
    expect(
      mount(
        <DndProvider backend={TouchBackend}>
          <SortableTreeWithoutDndContext
            dragDnDType="example"
            dropDnDType={['example']}
            treeData={[{ title: 'a' }]}
            onChange={() => {}}
          />
        </DndProvider>,
      ),
    ).toBeDefined();
  });
  it('loads using SortableTreeWithoutDndContext', () => {
    const onDragStateChanged = jest.fn();
    const treeData = [{ title: 'a' }, { title: 'b' }];
    let manager = null;
    //
    const wrapper = mount(
      <DndProvider backend={TestBackend}>
        <DndContext.Consumer>
          {/* @ts-expect-error ts-migrate(2322) FIXME: Type '({ dragDropManager }: DndContextType) => voi... Remove this comment to see the full error message */}
          {({ dragDropManager }) => {
            manager = dragDropManager;
          }}
        </DndContext.Consumer>

        <SortableTreeWithoutDndContext
          dragDnDType="example"
          dropDnDType={['example']}
          treeData={treeData}
          onDragStateChanged={onDragStateChanged}
          onChange={() => {}}
        />
      </DndProvider>,
    );
    // Obtain a reference to the backend
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const backend = manager.getBackend();
    // Retrieve our DnD-wrapped node component type
    const wrappedNodeType = wrapper.find('ReactSortableTree').instance().nodeContentRenderer;
    // And get the first such component
    const nodeInstance = wrapper.find(wrappedNodeType).first().instance();
    backend.simulateBeginDrag([nodeInstance.getHandlerId()]);
    expect(onDragStateChanged).toHaveBeenCalledWith({
      isDragging: true,
      draggedNode: treeData[0],
    });
    backend.simulateEndDrag([nodeInstance.getHandlerId()]);
    expect(onDragStateChanged).toHaveBeenCalledWith({
      isDragging: false,
      draggedNode: null,
    });
    expect(onDragStateChanged).toHaveBeenCalledTimes(2);
  });
});
