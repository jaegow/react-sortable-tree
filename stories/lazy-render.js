import React, { Component } from 'react';
import SortableTree from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        const data = [];
        for (let i = 0; i < 100; i += 1) {
            data.push({ title: `Chicken${  i}`, expanded: true, children: [] },)
        }
        this.state = {
            treeData: data
        };
    }

    render() {
        return (
            <div style={{ height: 300 }}>
                <SortableTree
                    lazyRenderItemsCount={10}
                    isVirtualized={false}
                    treeData={this.state.treeData}
                    onChange={treeData => this.setState({ treeData })}
                />
            </div>
        );
    }
}
