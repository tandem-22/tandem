import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Status } from "@/components/Status";
import { IncidentReport } from "@/components/Warning";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDate } from "@/hooks/useDate";
import { PassingIndicator } from "@/components/PassingIndicator";
import PassBell from "assets/chime.mp3";
import RedBell from "assets/red.mp3";
import LeftSay from "assets/keep-left.mp3";
import RightSay from "assets/keep-right.mp3";
import useSound from "use-sound";

const VIDEO_FEED_URL = "http://localhost:3001/video_feed";
// const VIDEO_FEED_URL = "1.jpg";

// Dimensions of the 7 in. RPI screen are 800 x 480
const Home: NextPage = () => {
  const [city, setCity] = useState("Calibrating...");
  const [premise, setPremise] = useState("Finding location...");
  const [read, setRead] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const [passing, setPassing] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const { formattedDate } = useDate();
  const [riskLevel, setRiskLevel] = useState<0 | 1 | 2>(0);

  const [playPassBell] = useSound(PassBell);
  const [playRedBell] = useSound(RedBell);
  const [playLeftSay] = useSound(LeftSay);
  const [playRightSay] = useSound(RightSay);

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
          console.log(latlng);
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
  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3001/ws");
    webSocket.onmessage = ({ data }: { data: string }) => {
      const parsedData: {
        risk_level: 0 | 1 | 2;
        danger_left: boolean;
        danger_right: boolean;
      } = JSON.parse(data);

      const { risk_level, danger_left, danger_right } = parsedData;
      setRiskLevel(risk_level);
      if (riskLevel === 2) {
        playRedBell();
        playRedBell();
      }
      setPassing({ left: danger_left, right: danger_right });
      if (danger_left) {
        playPassBell();
        playRightSay();
      }

      if (danger_right) {
        playPassBell();
        playLeftSay();
      }
    };

    return webSocket.close();
  }, []);

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
        {showHUD && (
          <Flex justifyContent="space-between">
            <Box>
              <Box
                fontSize="lg"
                bg="#202226"
                py="4"
                pl="6"
                pr="14"
                rounded="xl"
              >
                <Box color="white">
                  <Heading fontSize="xl">{city}</Heading>
                  <Text fontSize="lg">{premise}</Text>
                </Box>
                <Box mt="1">
                  <Text>23.9 °C, Cloudy</Text>
                  <Text>{formattedDate}</Text>
                </Box>
              </Box>
            </Box>
            <VStack>
              <Status riskLevel={riskLevel} />
            </VStack>
          </Flex>
        )}
        {showHUD && (
          <VStack pos="absolute" bottom="6" right="8" alignItems="right">
            <Button colorScheme="orange">Report Incident</Button>
            <Button colorScheme="red">End Ride</Button>
          </VStack>
        )}
        <Button
          pos="absolute"
          bottom="6"
          left="8"
          colorScheme="gray"
          color="black"
          onClick={() => setShowHUD(!showHUD)}
        >
          {showHUD ? "Hide HUD" : "Show HUD"}
        </Button>
      </Box>
      <PassingIndicator passing={passing} />
    </>
  );
};

export default Home;
