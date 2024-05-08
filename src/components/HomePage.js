import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, useToast } from '@chakra-ui/react';
import Flowchart from './Flowchart';
import { useSelector, useDispatch } from 'react-redux';
import { updateSqnm } from '../store/actions';

function HomePage({ onLogout}) {
  const name = useSelector(state => state.sequenceName);
  const [sequenceName, setSequenceName] = useState(name);
  const [editSequenceName, setEditSequenceName] = useState(name);
  const toast = useToast();
  const dispatch = useDispatch();

  const handleSequenceNameChange = (event) => {
    setEditSequenceName(event.target.value);
    dispatch(updateSqnm(event.target.value));
  };

  useEffect(() => {
    setEditSequenceName(name);
  }, [name]);

  const saveSequenceName = () => {
    if (!editSequenceName.trim()) {
      toast({
        title: "Error",
        description: "Sequence name cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSequenceName(editSequenceName);
    toast({
      title: "Success",
      description: "Sequence name updated successfully.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <div className="App">
      <Box display="flex" justifyContent="center" m={4}>
      <Button colorScheme="red" onClick={onLogout}
      style={{ position: 'absolute', right: 0 }}
      >Logout</Button>
        <Input
          placeholder="Enter sequence name"
          value={editSequenceName}
          onChange={handleSequenceNameChange}
          size="md"
          w='320px'
        />
        <Button
          ml={2}
          colorScheme="blue"
          onClick={saveSequenceName}
        >
          Save
        </Button>
      </Box>
      <Flowchart />
    </div>
  );
}

export default HomePage;
