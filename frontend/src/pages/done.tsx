import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Done = () => {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      h="100vh"
    >
      <Heading>Ride Complete!</Heading>
      <Text>
        You total travel time was:{" "}
        <Text as="span" fontWeight="bold">
          {router.query.m} minutes, {router.query.s} seconds
        </Text>{" "}
      </Text>
      <Button
        mt="2"
        rounded="full"
        colorScheme="green"
        onClick={() => router.push("/")}
      >
        Ride again
      </Button>
    </Flex>
  );
};

export default Done;
