import { Box, Heading, HStack, Icon } from "@chakra-ui/react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface Props {
  passing: { left: boolean; right: boolean };
}

export const PassingIndicator = ({ passing }: Props) => {
  if (!passing.left && !passing.right) {
    return null;
  }

  if (passing.left && passing.right) {
    return (
      <Box pos="absolute" top="49%" w="full" px="6">
        <HStack w="full" justifyContent="space-between">
          {passing.left && (
            <HStack>
              <Heading color="red.500" fontSize="2xl" w="min-content">
                Passing Vehicle
              </Heading>
              <Icon as={ChevronDoubleRightIcon} color="red.500" boxSize="20" />
            </HStack>
          )}
          {passing.right && (
            <HStack>
              <Icon as={ChevronDoubleLeftIcon} color="red.500" boxSize="20" />
              <Heading color="red.500" fontSize="2xl" w="min-content">
                Passing Vehicle
              </Heading>
            </HStack>
          )}
        </HStack>
      </Box>
    );
  }

  return (
    <Box pos="absolute" top="49%" w="full" px="6">
      <HStack w="full">
        {passing.left && (
          <HStack>
            <Heading color="red.500" fontSize="2xl" w="min-content">
              Passing Vehicle
            </Heading>
            <Icon as={ChevronDoubleRightIcon} color="red.500" boxSize="20" />
          </HStack>
        )}
        {passing.right && (
          <HStack marginLeft="auto">
            <Icon as={ChevronDoubleLeftIcon} color="red.500" boxSize="20" />
            <Heading color="red.500" fontSize="2xl" w="min-content">
              Passing Vehicle
            </Heading>
          </HStack>
        )}
      </HStack>
    </Box>
  );
};
