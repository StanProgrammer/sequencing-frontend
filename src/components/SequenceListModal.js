import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  List,
  ListItem,
  Flex,
  useToast
} from "@chakra-ui/react";
import { BASE_URL } from '../secret';
function SequenceListModal({ isOpen, onClose, sequences, onLoadSequence }) {
  const toast = useToast();
  const [sequence, setSequences] = useState(sequences); // Initialize state with sequences

  // Use useEffect to update state when sequences prop changes
  useEffect(() => {
    setSequences(sequences);
  }, [sequences]);
  const token = localStorage.getItem('token')
  const deleteSequence = async ({sqName}) => {
    console.log(sqName);
    try {
      const response = await fetch(`${BASE_URL}/delete-sequence/${sqName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }
      });
  
      if (response.ok) {
        setSequences(prevSequences => prevSequences.filter(seq => seq.sqName !== sqName));
        toast({
          title: 'Deleted Successfully',
          description: 'The sequence has been deleted.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errData = await response.json(); // Assuming the server sends back a JSON response even on errors
        toast({
          title: 'Failed to delete sequence',
          description: errData.message || 'Sequence with this name might not exist.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast({
        title: 'Error deleting sequence',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>List of All Sequences</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={3}>
            {sequence.length > 0 ? sequence.map((seq) => (
              <ListItem key={seq._id}>
                <Flex justify="space-between" align="center">
                  <Text>{seq.sqName}</Text>
                  <Flex>
                    <Button colorScheme="blue" size="sm" onClick={() => {
                      onClose();
                      onLoadSequence({ sqName: seq.sqName });
                    }}>
                      Load
                    </Button>
                    <Button colorScheme="red" ml={2} size="sm" onClick={() => deleteSequence({ sqName: seq.sqName })}>
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </ListItem>
            )) : <Text>No sequences found.</Text>}
          </List>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SequenceListModal;
