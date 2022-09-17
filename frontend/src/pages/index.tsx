import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Status } from "@/components/Status";
import { Warning } from "@/components/Warning";
import { useState } from "react";

const VIDEO_FEED_URL = "http://localhost:3001/video_feed";
// const VIDEO_FEED_URL = "1.jpg";

// Dimensions of the 7 in. RPI screen are 800 x 480
const Home: NextPage = () => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Box
        p="8"
        px="12"
        color="gray.200"
        bg={`url(${VIDEO_FEED_URL})`}
        bgPosition="center"
        bgSize="cover"
        h="100vh"
      >
        <Flex justifyContent="space-between">
          <Box fontSize="lg" bg="#202226" py="4" pl="6" pr="14" rounded="xl">
            <Box color="white">
              <Heading fontSize="2xl">Waterloo</Heading>
              <Heading fontSize="xl">Heading NW</Heading>
            </Box>
            <Box mt="1">
              <Text>23.9 °C, Cloudy</Text>
              <Text>7:25 AM, 2022/09/24</Text>
              <Text>12.94 km/h</Text>
            </Box>
          </Box>
          <Status state="warning" onClick={() => setShowWarning(true)} />
        </Flex>
      </Box>
      {showWarning && <Warning setShowWarning={setShowWarning} />}
    </>
  );
};

export default Home;
