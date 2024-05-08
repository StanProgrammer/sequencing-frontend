import React,{useState} from 'react';
import EmailModal from './EmailModal';
import { Box, Flex, Text, Button, Stack, Heading } from "@chakra-ui/react";
import { Handle } from "reactflow";
import { MdEmail, MdAccessTime, MdPlaylistAddCheck } from 'react-icons/md'; 
import { Card, CardBody, CardFooter } from '@chakra-ui/react'; 
import WaitModal from './WaitModal';
import DecisionModal from './DecisionModal';
import { useDispatch} from 'react-redux'
import { updateNode } from '../store/actions';

export const nodeTypes = {
  
  EmailNode: ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [emailContent, setEmailContent] = useState(data.content||"Writing this email to justify that I Like Your Work");

    
    const dispatch = useDispatch();
    const handleupdateEmailContent = (content) => {
      setEmailContent(content);
      dispatch(updateNode(data.id,content))
    };

    return (
      <Flex
        borderRadius="md"
        bg="#f1c40f"
        color="#fff"
        alignItems="center"
        boxShadow="md"
        w="auto"
        h="auto"
        flexDirection="row"
        overflow="hidden"
      >
        <Handle type="target" position="top" />
        <Box p="1">
          <MdEmail size="50px" />
        </Box>
        <Card variant="outline" direction={{ base: 'column', sm: 'row' }}  maxW="300px" maxH="400px">
          <Stack spacing={2}>
            <CardBody p="2">
              <Heading size="sm" mb="1">{data.label}</Heading>
              <Text fontSize="sm" wordBreak={'break-word'}>{emailContent}</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="solid" colorScheme="blue" onClick={() => setIsOpen(true)}>
                Edit Email
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        <Handle type="source" position="bottom" />
        <EmailModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleupdateEmailContent}
          initialContent={emailContent}
        />
      </Flex>
    );
  },
  WaitNode: ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDelay, setNewDelay] = useState(data.content||1);
    const dispatch = useDispatch();
    const handleSaveDelay = (content) => {
      setNewDelay(content);
      dispatch(updateNode(data.id,content))
      setIsEditing(false);

    };

    return (
      <>
        <Flex
          borderRadius="md"
          bg="#3498db"
          color="#fff"
          alignItems="center"
          boxShadow="md"
          w="200px" 
          h="60px" 
          flexDirection="row"
          overflow="hidden"
        >
          <Handle type="target" position="top" />
          <Box p="1" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
            <MdAccessTime size="40px" />
          </Box>
          <Text fontSize="sm" color={'tomato'} ml={2}>
            {newDelay} hours wait period.
          </Text>
          <Handle type="source" position="bottom" />
        </Flex>
        <WaitModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveDelay}
          initialContent={newDelay}
          placeholder="Enter new waiting hours"
        />
      </>
    );
  },
  
  DecisionNode: ({ data }) => {
    const [decision, setDecision] = useState(data.choice);
    const [isEditing, setIsEditing] = useState(false);
    const [cardContent, setCardContent] = useState(data.content||'Decision Taken By user is according to its needs');
    
    const dispatch = useDispatch();
    const handleYesClick = () => {
      setDecision('yes');
      dispatch(updateNode(data.id,cardContent,'yes'))
    };

    const handleNoClick = () => {
      setDecision('no');
      dispatch(updateNode(data.id,cardContent,'no'))
    };

    const isYesDisabled = decision === 'no';
    const isNoDisabled = decision === 'yes';

    const handleSaveCardContent = (content) => {
      setCardContent(content);
      dispatch(updateNode(data.id,content))
      setIsEditing(false);
    };

    return (
      <>
        <Flex
          borderRadius="md"
          bg="#2ecc71"
          color="#fff"
          alignItems="center"
          boxShadow="md"
          w="auto"
          h="auto"
          flexDirection="row"
          overflow="hidden"
        >
          <Handle type="target" position="top" />
          <Box p="1">
            <MdPlaylistAddCheck size="40px" />
          </Box>
          <Card variant="outline" direction={{ base: 'column', sm: 'row' }} maxW="300px" minH="150px">
            <Stack spacing={2}>
              <CardBody p="2">
                <Heading size="sm" mb="1">{data.label}</Heading>
                <Text fontSize="sm" wordBreak={'break-word'}>{cardContent}</Text>
              </CardBody>
              <CardFooter>
                <Button
                  size="xs"
                  variant="solid"
                  colorScheme={decision === 'yes' ? 'blue' : 'gray'}
                  marginRight={'2px'}
                  disabled={isYesDisabled}
                  onClick={handleYesClick}
                >
                  Yes
                </Button>
                <Button
                  size="xs"
                  variant="solid"
                  colorScheme={decision === 'no' ? 'red' : 'gray'}
                  disabled={isNoDisabled}
                  onClick={handleNoClick}
                  marginRight={'2px'}
                >
                  No
                </Button>
                <Button size="xs" variant="solid" colorScheme="blue" onClick={() => setIsEditing(true)}>
                  Edit Content
                </Button>
              </CardFooter>
            </Stack>
          </Card>
          <Flex>
            <Handle
              type="source"
              position="bottom"
              id="yes"
              style={{ marginRight: '10px', visibility: decision === 'yes' ? 'visible' : 'hidden' }}
            />
            <Handle
              type="source"
              position="bottom"
              id="no"
              style={{ marginLeft: '10px', visibility: decision === 'no' ? 'visible' : 'hidden' }}
            />
          </Flex>
        </Flex>
        <DecisionModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveCardContent}
          initialContent={cardContent}
        />
      </>
    );
  },
};
