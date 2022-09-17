import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Image } from "@chakra-ui/react";
import { Status } from "@/components/Status";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Box w="100%" h="100vh" pos="fixed" zIndex={-10}>
        <Image
          src="/1.jpg"
          // src="http://localhost:3001/video_feed"
          objectFit="cover"
          alt="Video feed"
        />
      </Box>
      <Box p="8" px="12" color="white">
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
