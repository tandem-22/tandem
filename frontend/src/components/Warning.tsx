import { Box, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  setShowWarning: (prev: boolean) => void;
}

export const Warning = ({ setShowWarning }: Props) => {
  return (
    <Flex
      bg="red.400"
      pos="fixed"
      top="0"
      bottom="0"
      left="0"
      right="0"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton
        icon={<Icon as={XMarkIcon} />}
        pos="absolute"
        right="4"
        top="4"
        size="sm"
        bg="red.500"
        _active={{}}
        _hover={{}}
        color="white"
        aria-label="Close"
        onClick={() => setShowWarning(false)}
      />
      <Box color="white">
        <Heading fontSize="4xl">Watch out!</Heading>
        <Text fontSize="lg">{"You're in danger."}</Text>
      </Box>
    </Flex>
  );
};
