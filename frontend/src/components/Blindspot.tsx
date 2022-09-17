import { Box, HStack, Icon } from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  passing: { left: boolean; right: boolean };
}

export const Blindspot = ({ passing }: Props) => {
  if (!passing.left && !passing.right) {
    return null;
  }

  if (passing.left && passing.right) {
    return (
      <Box pos="absolute" top="49%" w="full" px="6">
        <HStack w="full" justifyContent="space-between">
          <Icon as={ExclamationTriangleIcon} color="orange.400" boxSize="20" />
          <Icon as={ExclamationTriangleIcon} color="orange.400" boxSize="20" />
        </HStack>
      </Box>
    );
  }

  return (
    <Box pos="absolute" top="49%" w="full" px="6">
      <HStack w="full">
        {passing.left && (
          <Icon as={ExclamationTriangleIcon} color="orange.400" boxSize="20" />
        )}
        {passing.right && (
          <Icon
            marginLeft="auto"
            as={ExclamationTriangleIcon}
            color="orange.400"
            boxSize="20"
          />
        )}
      </HStack>
    </Box>
  );
};
