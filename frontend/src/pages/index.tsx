import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Status } from "@/components/Status";

const VIDEO_FEED_URL = "http://localhost:3001";

// Dimensions of the 7 in. RPI screen are 800 x 480
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Box
        p="8"
        px="12"
        color="white"
        bg={`url(${VIDEO_FEED_URL})`}
        bgPosition="center"
        bgSize="cover"
        h="100vh"
      >
        <Flex justifyContent="space-between">
          <Box fontSize="lg">
            <Heading fontSize="3xl">Waterloo</Heading>
            <Heading fontSize="2xl">Heading NW</Heading>
            <Text>23.9 °C, Cloudy</Text>
            <Text>7:25 AM, 2022/09/24</Text>
            <Text>12.94 km/h</Text>
          </Box>
          <Status state="warning" />
        </Flex>
      </Box>
    </>
  );
};

export default Home;
