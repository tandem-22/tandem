import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { Status } from "@/components/Status";
import { Blindspot } from "@/components/Blindspot";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDate } from "@/hooks/useDate";
import { useRouter } from "next/router";

const VIDEO_FEED_URL = "http://localhost:3001/video_feed";
// const VIDEO_FEED_URL = "1.jpg";

// Dimensions of the 7 in. RPI screen are 800 x 480
const Home: NextPage = () => {
  const [city, setCity] = useState("Waterloo, ON, Canada");
  const [premise, setPremise] = useState("Engineering 5");
  const [read, setRead] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const [passing, setPassing] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const { formattedDate } = useDate();
  const [riskLevel, setRiskLevel] = useState<0 | 1 | 2>(0);

  const [time] = useState(new Date());

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
      const webSocket = new WebSocket("ws://localhost:3001/ws");
      webSocket.onmessage = ({ data }: { data: string }) => {
        const parsedData: {
          risk_level: 0 | 1 | 2;
          danger_left: boolean;
          danger_right: boolean;
        } = JSON.parse(data);

        const { risk_level, danger_left, danger_right } = parsedData;
        setRiskLevel(risk_level);
        setPassing({ left: danger_left, right: danger_right });
      };
      setRead(true);
    }
  }, [read]);
  const router = useRouter();

  return (
    <>
      <Box
        color="gray.200"
        bg={`url(${VIDEO_FEED_URL})`}
        bgPosition="center"
        bgSize="cover"
        h="100vh"
      >
        {showHUD && (
          <Box
            fontSize="lg"
            bg="#202226"
            py="4"
            pl="6"
            pr="14"
            rounded="xl"
            w="fit-content"
            pos="fixed"
            top="4"
            left="8"
          >
            <Box color="white">
              <Heading fontSize="xl">{city}</Heading>
              <Text fontSize="lg">{premise}</Text>
            </Box>
            <Box mt="1">
              <Text>{formattedDate}</Text>
            </Box>
          </Box>
        )}

        {showHUD && (
          <Button
            pos="fixed"
            top="36"
            left="8"
            colorScheme="twitter"
            rounded="full"
            p="5"
            onClick={() => router.push("https://htn-tandem.herokuapp.com/")}
          >
            View Map
          </Button>
        )}

        <Flex
          direction="column"
          w="40"
          alignItems="right"
          right="8"
          top="4"
          gap="3"
          pos="fixed"
        >
          <Button
            colorScheme="gray"
            color="black"
            onClick={() => setShowHUD(!showHUD)}
            rounded="full"
            p="5"
          >
            {showHUD ? "Hide HUD" : "Show HUD"}
          </Button>
          {showHUD && (
            <>
              <Button
                colorScheme="orange"
                rounded="full"
                p="5"
                onClick={() => router.push("/report")}
              >
                Report Incident
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  const endTime = new Date();
                  const timeDiff = endTime.getTime() - time.getTime();
                  const minutes = Math.floor(timeDiff / 1000 / 60);
                  const seconds = Math.floor((timeDiff / 1000) % 60);
                  router.push(`/done?m=${minutes}&s=${seconds}`, undefined);
                }}
                rounded="full"
                p="5"
              >
                End Ride
              </Button>
            </>
          )}
        </Flex>
        {showHUD && (
          <Status
            pos="fixed"
            bottom="4"
            left="8"
            right="8"
            riskLevel={riskLevel}
          />
        )}
      </Box>
      <Blindspot passing={passing} />
    </>
  );
};

export default Home;
