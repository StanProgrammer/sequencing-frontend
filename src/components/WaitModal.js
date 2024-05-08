import React, { useState } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";

const WaitModal = ({ isOpen, onClose, onSave, initialContent, placeholder }) => {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Waiting Hours(Max 48)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={content}
            onChange={(e) => {
              // Parse the input value as a number and limit it to a maximum of 48
              const newValue = Math.min(parseInt(e.target.value, 10) || 0, 48);
              setContent(newValue.toString()); // Convert back to string for input value
            }}
            placeholder={placeholder}
            size="sm"
            maxLength={"2"} // Limit to 2 digits for hours
            type="number"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default WaitModal;
