import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface Inputs {
  latitude: number;
  longitude: number;
  description: string;
  type: "NEAR_MISS" | "ACCIDENT";
}

const Report = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async ({
    description,
    latitude,
    longitude,
    type,
  }) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/location` as string,
      { lat: Number(latitude), long: Number(longitude), type, description }
    );
    router.push("/");
  };

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      py="10"
    >
      <Heading>Report an incident</Heading>
      <Text mt="1" maxW="45ch" textAlign="center" color="gray.600">
        Did something happen during your ride? Let us know so the City of
        Waterloo can better understand the risks cyclists face.
      </Text>

      <Box mt="3" w="96" as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.latitude}>
          <FormLabel htmlFor="latitude">Latitude</FormLabel>
          <Input
            id="latitude"
            {...register("latitude", {
              required: true,
            })}
          />
          <FormErrorMessage>
            {errors.latitude && errors.latitude.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.longitude} mt="2">
          <FormLabel htmlFor="longitude">Longitude</FormLabel>
          <Input
            id="longitude"
            {...register("longitude", {
              required: true,
            })}
          />
          <FormErrorMessage>
            {errors.longitude && errors.longitude.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.type} mt="2">
          <FormLabel htmlFor="type">Type</FormLabel>
          <Select
            id="type"
            {...register("type", {
              required: true,
            })}
          >
            <option disabled>Select a type</option>
            <option value="ACCIDENT">Accident</option>
            <option value="NEAR_MISS">Near miss</option>
          </Select>
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} mt="2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            {...register("description", {
              required: true,
            })}
            placeholder="Describe what happened"
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt="5"
          rounded="full"
          colorScheme="telegram"
          px="8"
          w="full"
          type="submit"
        >
          Submit
        </Button>
      </Box>
    </Flex>
  );
};

export default Report;
