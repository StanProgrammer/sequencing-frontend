import React, { useCallback, useState, useRef } from "react";
import ReactFlow, { Controls, ReactFlowProvider, addEdge, useNodesState, useEdgesState } from "reactflow";
import { ChakraProvider, Box, VStack, Text,Button,useDisclosure, useToast  } from "@chakra-ui/react";
import "reactflow/dist/style.css";
import { nodeTypes } from "./CustomNode";
import { useDispatch, useSelector } from "react-redux";
import { addNode, resetSequence, updateSqnm, updatesqId } from "../store/actions";
import { v4 as uuidv4 } from 'uuid';
import SequenceListModal from './SequenceListModal'; 
import { BASE_URL } from "../secret";
const initialNodes = [];
const initialEdges = [];
export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sequences, setSequences] = useState([]);
  const sqName = useSelector(state => state.sequenceName)
  const nodeData =useSelector(state => state.nodes)
  const id = useSelector(state => state.sqId)
  const toast = useToast(); // useToast hook for showing feedback
  const token = localStorage.getItem('token');
  const resetSequenceData  = () => {
    // Reset local state
    setNodes(initialNodes);
    setEdges(initialEdges);
  
    // Dispatch Redux action to reset the sequence data
    dispatch(resetSequence());
  };

  const loadSequence = async ({sqName}) => {
    try {
      const response = await fetch(`${BASE_URL}/load-sequence/${sqName}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setNodes(data.nodeData);
        setEdges(data.edges);
        dispatch(updatesqId(data._id));
        dispatch(updateSqnm(data.sqName))
        dispatch(addNode(data.nodeData));
        toast({ title: 'Loaded Successfully', status: 'success' })
      } else {
        toast({ title: 'Failed to Load', description: 'Sequence with this name already exists', status: 'error' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast({ title: 'Error', description: error.message, status: 'error' });
    }
  };
  

  
  const executeSequence = async () => {
    try {
      const data = {
        sqName,
        nodeData,
        edges
      };
      const response = await fetch(`${BASE_URL}/execute-sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
          
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        toast({
          title:'Sequence Executed Successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        const errMsg = await response.text(); // Get error message from response
        throw new Error(`Failed to execute sequence: ${errMsg}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

 const fetchSequences = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sequences`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setSequences(data);
    } else {
      throw new Error('Failed to fetch sequences');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

  const handleOpenSequences = () => {
    fetchSequences();
    onOpen();
  };
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
   
    const onSaveAllNodeData = async () => {
      try {
        const data = {
          sqName,
          nodeData,
          edges
        };
        const endpoint = id ? 'update-sequence' : 'save-sequence';
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the JWT in the request
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          toast({
            title: id ? 'Sequence Updated Successfully' : 'Sequence Saved Successfully',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        } else {
          const errMsg = await response.text(); // Get error message from response
          throw new Error(`Failed to ${id ? 'update' : 'save'} sequence: ${errMsg}`);
        }
      } catch (error) {
        console.error('Error:', error.message);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    };
    
    
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  };
  const dispatch = useDispatch();
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
     
      const reactFlowInstanceCurrent = reactFlowInstance;
      if (!reactFlowInstanceCurrent) {
        console.log("ReactFlow instance is not ready when onDrop is called.");
        return;
      }

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/reactflow-label");
      const position = reactFlowInstanceCurrent.project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });
      const newId =uuidv4()
      let newNode = {
        id: newId,
        type,
        position,
        data: { label, content: null,id: newId},
      };
      if(type === 'EmailNode'){
        newNode.data.content = "Writing this email to justify that I Like Your Work"
      }
      else if(type === "WaitNode"){
        newNode.data.content = 1
      }
      else{
        newNode.data.content = 'Decision Taken By user is according to its needs'
      }
      dispatch(addNode(newNode))
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onLoad = (reactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
    console.log("onLoad");
  };
  

  return (
    <ChakraProvider>
      <div style={{ display: "flex", width: "100vw", height: "100vh", position: "absolute" }} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            onInit={onLoad}
          >
            <Controls />
          </ReactFlow>
          <VStack spacing={4} className="toolbar" p="4" bg="gray.100" align="stretch" minWidth="120px">
          <Button onClick={onSaveAllNodeData} colorScheme="blue">Save Sequence</Button>
          <Button onClick={handleOpenSequences} colorScheme="green">List All Sequences</Button>
          <Button onClick={resetSequenceData} colorScheme="red">Reset Sequence</Button>
          <Button onClick={executeSequence} colorScheme="blue">Execute Sequence</Button>

            {["EmailNode", "WaitNode", "DecisionNode"].map((type) => (
              <Box
                key={type}
                onDragStart={(event) => onDragStart(event, type, type.replace("Node", ""))}
               
                draggable
                p="2"
                bg="teal.500"
                color="white"
                borderRadius="md"
                cursor="grab"
              >
                <Text>Drag {type.replace("Node", "")}</Text>
              </Box>
            ))}
          </VStack>
        </ReactFlowProvider>
      </div>
      <SequenceListModal isOpen={isOpen} onClose={onClose} sequences={sequences} onLoadSequence={loadSequence} />

    </ChakraProvider>
  );
}
