import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@chakra-ui/react';

const DecisionModal = ({ isOpen, onClose, onSave, initialContent }) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Justify your Choice in Short</ModalHeader>
        <ModalBody>
          <Textarea value={content} onChange={handleChange} placeholder="Enter content" size="md" maxLength={'100'} required/>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DecisionModal;
