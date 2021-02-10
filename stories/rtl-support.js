import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: 'Chicken',
          expanded: true,
          children: [
            { title: 'Egg' },
            { title: 'Egg' },
            { title: 'Egg' },
            { title: 'Egg' },
            { title: 'Egg' },
            { title: 'Egg' },
          ],
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 300, width: 600 }}>
        <SortableTree
          dragDnDType="example"
          dropDnDType={['example']}
          rowDirection="rtl"
          treeData={this.state.treeData}
          onChange={(treeData) => this.setState({ treeData })}
        />
      </div>
    );
  }
}
