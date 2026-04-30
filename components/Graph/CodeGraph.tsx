/**
 * components/Graph/CodeGraph.tsx
 */
"use client";

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Defined outside to prevent unnecessary re-renders (fixes React Flow warning #002)
const nodeTypes = {};
const edgeTypes = {};

interface CodeGraphProps {
  initialNodes: any[];
  initialEdges: any[];
  onNodeClick: (node: any) => void;
}

export default function CodeGraph({ initialNodes, initialEdges, onNodeClick }: CodeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when props change (e.g., new repo)
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    onNodeClick(node);
    
    // Flow tracing: Highlight connected nodes and edges
    const connectedNodes = new Set<string>();
    const connectedEdges = new Set<string>();
    
    connectedNodes.add(node.id);

    // Find all edges connected to this node (outbound)
    initialEdges.forEach(edge => {
      if (edge.source === node.id) {
        connectedEdges.add(edge.id);
        connectedNodes.add(edge.target);
      }
    });

    setNodes(nds => nds.map(n => ({
      ...n,
      style: { 
        ...n.style, 
        opacity: connectedNodes.has(n.id) ? 1 : 0.3,
        borderColor: connectedNodes.has(n.id) ? '#4f46e5' : '#333',
        boxShadow: connectedNodes.has(n.id) ? '0 0 20px rgba(79, 70, 229, 0.4)' : 'none'
      }
    })));

    setEdges(eds => eds.map(e => ({
      ...e,
      animated: connectedEdges.has(e.id),
      style: { 
        ...e.style, 
        stroke: connectedEdges.has(e.id) ? '#4f46e5' : '#222',
        opacity: connectedEdges.has(e.id) ? 1 : 0.1
      }
    })));
  };

  // Reset highlight when clicking on canvas
  const onPaneClick = useCallback(() => {
    setNodes(nds => nds.map(n => ({ ...n, style: {} })));
    setEdges(eds => eds.map(e => ({ ...e, animated: false, style: {} })));
    onNodeClick(null);
  }, [setNodes, setEdges, onNodeClick]);

  return (
    <div className="w-full h-full bg-[#050505]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
        fitView
        className="react-flow-dark"
        panOnScroll={false}
        panOnDrag={[1, 2]} // Support both mouse and touch drag
        selectionOnDrag={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        preventScrolling={true}
      >
        <Background color="#111" gap={20} />
        <Controls />
        <MiniMap 
          style={{ backgroundColor: '#000', border: '1px solid #333' }}
          maskColor="rgba(0, 0, 0, 0.5)"
          nodeColor="#4f46e5"
        />
      </ReactFlow>
      
      <style jsx global>{`
        .react-flow__node {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
          width: 180px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .react-flow__node:hover {
          border-color: #4f46e5;
        }
        .react-flow__edge-path {
          stroke: #333;
          stroke-width: 2;
        }
        .react-flow__controls-button {
          background: #1a1a1a;
          fill: #fff;
          border-bottom: 1px solid #333;
        }
        .react-flow__controls-button:hover {
          background: #2a2a2a;
        }
      `}</style>
    </div>
  );
}
