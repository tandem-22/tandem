import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  premise: (prev: "left" | "right" | null) => void;
  coords?: [number, number];
}

export const IncidentReport = ({ premise, coords }: Props) => {
  const [type, setType] = useState<
    "NEAR_MISS" | "ACCIDENT" | "OTHER" | undefined
  >(undefined);
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
        size="lg"
        bg="red.500"
        _active={{}}
        _hover={{}}
        color="white"
        aria-label="Close"
        onClick={() => setPassing(null)}
      />
      <Box color="white" width="70%">
        <Heading fontSize="4xl">Watch out!</Heading>
        <Box>
          <Button onClick={() => {}}>Near Miss</Button>
          <Button>Accident</Button>]<Button>Other</Button>
        </Box>
      </Box>
    </Flex>
  );
};
