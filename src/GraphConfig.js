import React from 'react';

const EmptyShape = (
        <symbol viewBox="0 0 100 100" id="empty">
        <circle cx="50" cy="50" r="45"></circle>
        </symbol>
);

const LocalNodeShape = (
        <symbol viewBox="0 0 100 100" id="localNode">
        <circle cx="50" cy="50" r="45"></circle>
        </symbol>
)

const EdgeNodeShape = (
        <symbol viewBox="0 0 100 100" id="edgeNode">
        <rect width="100" height="100"></rect>
        </symbol>
)

const SensorNodeShape = (
        <symbol viewBox="0 0 100 100" id="sensorNode">
        <rect transform="translate(15, 30)" width="70" height="50"></rect>
        </symbol>
)

const LocalNodeEdgeShape = (
        <symbol viewBox="0 0 50 50" id="localNodeEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
        </symbol>
)

const EdgeNodeEdgeShape = (
        <symbol viewBox="0 0 50 50" id="edgeNodeEdge">
        <rect transform="rotate(45)"  x="25" y="-4.5" width="15" height="15" fill="currentColor"></rect>
        </symbol>
);

const SensorNodeEdgeShape = (
        <symbol viewBox="0 0 50 50" id="sensorEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
        </symbol>
);


const SpecialChildShape = (
        <symbol viewBox="0 0 100 100" id="specialChild">
        <rect x="2.5" y="0" width="95" height="97.5" fill="rgba(30, 144, 255, 0.12)"></rect>
        </symbol>
)

export default {
    NodeTypes: {
        empty: {
            typeText: "empty",
            shapeId: "#empty",
            shape: EmptyShape
        },
        localNode: {
            typeText: "Local",
            shapeId: "#localNode",
            shape: LocalNodeShape
        },
        edgeNode: {
            typeText: "EdgeNode",
            shapeId: "#edgeNode",
            shape: EdgeNodeShape
        },

        sensor: {
            typeText: "Sensor",
            shapeId: "#sensorNode",
            shape: SensorNodeShape
        }
    },
    NodeSubtypes: {
        specialChild: {
            shapeId: "#specialChild",
            shape: SpecialChildShape
        }
    },
    EdgeTypes: {
       localNodeEdge: {
            shapeId: "#localNodeEdge",
            shape: LocalNodeEdgeShape
        },
        edgeNodeEdge: {
            shapeId: "#edgeNodeEdge",
            shape: EdgeNodeEdgeShape
        },
        sensorEdge: {
            shapeId: "#sensorNodeEdge",
            shape: SensorNodeEdgeShape
        }
    }
}
