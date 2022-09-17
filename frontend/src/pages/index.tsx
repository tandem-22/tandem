import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Status } from "@/components/Status";
import { Warning } from "@/components/Warning";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDate } from "@/hooks/useDate";

const VIDEO_FEED_URL = "http://localhost:3001/video_feed";
// const VIDEO_FEED_URL = "1.jpg";

// Dimensions of the 7 in. RPI screen are 800 x 480
const Home: NextPage = () => {
  const [premise, setPremise] = useState("Calibrating...");
  const [city, setCity] = useState("Calibrating...");
  const [read, setRead] = useState(false);

  useEffect(() => {
    if (read) {
      return;
    }

    if (typeof window !== "undefined") {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.geolocation !== "undefined"
      ) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = `${latitude},${longitude}`;
          const {
            data: { results },
          } = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&result_type=premise|locality&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
          );
          results.forEach((result: any) => {
            if (result.types.includes("premise")) {
              setPremise(result.address_components[0].long_name);
            } else if (result.types.includes("locality")) {
              setCity(result.formatted_address);
            }
          });
        });
      }
      setRead(true);
    }
  }, [read]);

  const [showWarning, setShowWarning] = useState(false);
  const { formattedDate } = useDate();

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
              <Heading fontSize="xl">{city}</Heading>
              <Text fontSize="lg">{premise}</Text>
            </Box>
            <Box mt="1">
              <Text>23.9 °C, Cloudy</Text>
              <Text>{formattedDate}</Text>
            </Box>
          </Box>
          <Status state="danger" onClick={() => setShowWarning(true)} />
        </Flex>
      </Box>
      {showWarning && <Warning setShowWarning={setShowWarning} />}
    </>
  );
};

export default Home;
