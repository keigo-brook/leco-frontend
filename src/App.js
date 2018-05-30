import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import GraphView from 'react-digraph';
import GraphConfig from './GraphConfig.js'; // Configures node/edge types

const styles = {
    graph: {
        height: '100%',
        width: '100%'
    }
};

const NODE_KEY = "id"; // Key used to identify nodes

const EMPTY_TYPE = "empty";
const EDGE_NODE_TYPE = "edgeNode";
const LOCAL_NODE_TYPE = "localNode";
const SENSOR_NODE_TYPE = "sensorNode";

const LOCAL_NODE_EDGE_TYPE = "localNodeEdge";
const EDGE_NODE_EDGE_TYPE = "edgeNodeEdge";

const sample = {
    "nodes": [],
    "edges": []
};

const node_type = {
    "edge": EDGE_NODE_TYPE,
    "local": LOCAL_NODE_TYPE,
    "sensor": SENSOR_NODE_TYPE
};


export class Graph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graph: sample,
            selected: {}
        };

        this.loadResources = this.loadResources.bind(this);
    }

    loadResources() {
        const url = 'http://localhost:5000/all_resources';
        axios
            .get(url)
            .then(res => {
                const graph = this.state.graph;
                res.data.res.forEach(function(s) {
                    var resource = JSON.parse(s);
                    const viewNode = {
                        id: resource['ip'],
                        title: resource['ip'],
                        type: node_type[resource['type']],
                        x: 100 + graph.nodes.length * 200,
                        y: 100
                    };

                    if (graph.nodes.findIndex((node)=>{return node[NODE_KEY] === viewNode[NODE_KEY];})== -1) {
                        console.log(resource['ip']);
                        console.log(node_type[resource['type']]);
                        graph.nodes.push(viewNode);
                    }
                });
                this.setState({graph: graph});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Helper to find the index of a given node
    getNodeIndex(searchNode) {
        return this.state.graph.nodes.findIndex((node)=>{
            return node[NODE_KEY] === searchNode[NODE_KEY];
        });
    }

    // Helper to find the index of a given edge
    getEdgeIndex(searchEdge) {
        return this.state.graph.edges.findIndex((edge)=>{
            return edge.source === searchEdge.source &&
                edge.target === searchEdge.target;
        });
    }

    createNode(x, y, type, title) {
        const graph = this.state.graph;
        const viewNode = {
            id: this.state.graph.nodes.length + 1,
            title: title,
            type: type,
            x: x,
            y: y
        };

        graph.nodes.push(viewNode);
        this.setState({graph: graph});
    }

    // Given a nodeKey, return the corresponding node
    getViewNode = nodeKey => {
        const searchNode = {};
        searchNode[NODE_KEY] = nodeKey;
        const i = this.getNodeIndex(searchNode);
        return this.state.graph.nodes[i];
    }

    /*
     * Handlers/Interaction
     */

    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    onUpdateNode = viewNode => {
        const graph = this.state.graph;
        const i = this.getNodeIndex(viewNode);

        graph.nodes[i] = viewNode;
        this.setState({graph: graph});
    }

    // Node 'mouseUp' handler
    onSelectNode = viewNode => {
        // Deselect events will send Null viewNode
        if (!!viewNode){
            this.setState({selected: viewNode});
        } else{
            this.setState({selected: {}});
        }
    }

    // Edge 'mouseUp' handler
    onSelectEdge = viewEdge => {
        this.setState({selected: viewEdge});
    }

    // Updates the graph with a new node
    onCreateNode = (x,y) => {
        const type = Math.random() < 0.25 ? EDGE_NODE_TYPE : LOCAL_NODE_TYPE;
        this.createNode(x, y, '', type);
    }

    // Deletes a node from the graph
    onDeleteNode = viewNode => {
        const graph = this.state.graph;
        const i = this.getNodeIndex(viewNode);
        graph.nodes.splice(i, 1);

        // Delete any connected edges
        const newEdges = graph.edges.filter((edge, i)=>{
            return  edge.source != viewNode[NODE_KEY] &&
                edge.target != viewNode[NODE_KEY]
        })

        graph.edges = newEdges;

        this.setState({graph: graph, selected: {}});
    }

    // Creates a new node between two edges
    onCreateEdge = (sourceViewNode, targetViewNode) => {
        const graph = this.state.graph;

        // This is just an example - any sort of logic
        // could be used here to determine edge type
        const type = sourceViewNode.type === EDGE_NODE_TYPE ? EDGE_NODE_EDGE_TYPE : LOCAL_NODE_EDGE_TYPE;

        const viewEdge = {
            source: sourceViewNode[NODE_KEY],
            target: targetViewNode[NODE_KEY],
            type: type
        }

        // Only add the edge when the source node is not the same as the target
        if (viewEdge.source !== viewEdge.target) {
            graph.edges.push(viewEdge);
            this.setState({graph: graph});
        }
    }

    // Called when an edge is reattached to a different target.
    onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
        const graph = this.state.graph;
        const i = this.getEdgeIndex(viewEdge);
        const edge = JSON.parse(JSON.stringify(graph.edges[i]));

        edge.source = sourceViewNode[NODE_KEY];
        edge.target = targetViewNode[NODE_KEY];
        graph.edges[i] = edge;

        this.setState({graph: graph});
    }

    // Called when an edge is deleted
    onDeleteEdge = viewEdge => {
        const graph = this.state.graph;
        const i = this.getEdgeIndex(viewEdge);
        graph.edges.splice(i, 1);
        this.setState({graph: graph, selected: {}});
    }

    componentDidMount() {
        this.loadResources();
        setInterval(this.loadResources, 1000);
    }


    /*
     * Render
     */

    render() {
        const nodes = this.state.graph.nodes;
        const edges = this.state.graph.edges;
        const selected = this.state.selected;

        const NodeTypes = GraphConfig.NodeTypes;
        const NodeSubtypes = GraphConfig.NodeSubtypes;
        const EdgeTypes = GraphConfig.EdgeTypes;

        const btnStyle = {
            position: "absolute",
            zIndex: 1,
        };
        return (
                <div id='graph' style={styles.graph}>

                <button onClick={this.loadResources} style={btnStyle}>click</button>

                <GraphView
            ref={(el) => this.GraphView = el}
            nodeKey={NODE_KEY}
            emptyType={EMPTY_TYPE}
            nodes={nodes}
            edges={edges}
            selected={selected}
            nodeTypes={NodeTypes}
            nodeSubtypes={NodeSubtypes}
            edgeTypes={EdgeTypes}
            enableFocus={true}
            getViewNode={this.getViewNode}
            onSelectNode={this.onSelectNode}
            onCreateNode={this.onCreateNode}
            onUpdateNode={this.onUpdateNode}
            onDeleteNode={this.onDeleteNode}
            onSelectEdge={this.onSelectEdge}
            onCreateEdge={this.onCreateEdge}
            onSwapEdge={this.onSwapEdge}
            onDeleteEdge={this.onDeleteEdge}/>
                </div>
        );
    }

}

// To bootstrap this example into the Document
class App extends Component {
    render() {
        return <Graph/>;
    }
}
export default App;
