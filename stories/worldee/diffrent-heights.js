import React, { Component } from 'react';
import SortableTree from '../../src';
import classnames from "../../src/utils/classnames";
import TreeItemRenderer from "./renderer/item-renderer";
import './renderer/item-renderer.css'
import './style.css'
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        const data1 = [];
        const data2 = [];
        for (let i = 0; i < 1; i += 1) {
            data1.push({ id: i+1, title: `Chicken${  i}`, expanded: true, children: [] },)
        }
        for (let i = 0; i < 1; i += 1) {
            data2.push({ id: 10 + i+1, title: `Chicken${  i}`, expanded: true, children: [] },)
        }
        this.state = {
            treeData1: data1,
            treeData2: data2
        };
    }

    render() {
        return (
            <>
                Tree 1:
                <div style={{padding: "30px", border: "2px solid black"}}>
                    <SortableTree
                        placeholderRenderer={() => {
                            return (
                                <div className={classnames(
                                    "empty-day-placeholder",
                                    'rst__placeholder'
                                )}>
                                    <div>
                                        <div>
                                            <span>PLACE HOLDER</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                        loaderRenderer={() => <div style={{height: "40px", width: "100%"}}>LOADER</div>}
                        isVirtualized={false}
                        treeData={this.state.treeData1}
                        onChange={(treeData1) => {
                            this.setState({ treeData1 })
                        }}
                        className={classnames("rst__linear", "rst__noLeft")}
                        dragDnDType="example"
                        dropDnDType={["example"]}
                        maxDepth={1}
                        ignoreScaffold
                        customRowHeight
                        nodeContentRenderer={(props) => {
                            return (
                                <TreeItemRenderer
                                    {...props}
                                    customPlaceholderClass="rstRowDayLanding"
                                    draggableItemRenderer={() => <div>X</div>}
                                    itemRenderer={( isDragging, handle) => {
                                        return (
                                            <div className="item-wrapper" style={{height: props.node.id > 1 ? "80px" : "150px", margin: "20px"}}>
                                                <div>{props.node.id}</div>
                                                <>{handle}</>
                                                <span>CONTENT</span>
                                            </div>
                                        )
                                    }}
                                />
                            )
                        }}
                    />
                </div>
                <br /> <br />
                Tree 2:
                <div style={{padding: "30px", border: "2px solid black"}}>
                    <SortableTree
                        loaderRenderer={() => <div style={{height: "40px", width: "100%"}}>LOADER</div>}
                        isVirtualized={false}
                        treeData={this.state.treeData2}
                        onChange={(treeData2) =>  {
                            this.setState({ treeData2 })
                        }}
                        className={classnames("rst__linear", "rst__noLeft")}
                        dragDnDType="example"
                        dropDnDType={["example"]}
                        maxDepth={1}
                        ignoreScaffold
                        customRowHeight
                        nodeContentRenderer={(props) => {
                            return (
                                <TreeItemRenderer
                                    {...props}
                                    customPlaceholderClass="rstRowDayLanding"
                                    draggableItemRenderer={() => <div>X</div>}
                                    itemRenderer={( isDragging, handle) => {
                                        return (
                                            <div className="item-wrapper" style={{height: "100px", margin: "10px"}}>
                                                <div>{props.node.id}</div>
                                                <>{handle}</>
                                                <span>CONTENT</span>
                                            </div>
                                        )
                                    }}
                                />
                            )
                        }}
                    />
                </div>
            </>
        );
    }
}
