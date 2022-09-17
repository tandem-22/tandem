import { Flex, FlexProps, Heading, Icon } from "@chakra-ui/react";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const config = {
  0: {
    bg: "green.400",
    icon: ShieldCheckIcon,
    text: "Safe cycling conditions",
  },
  1: {
    bg: "orange.400",
    icon: ShieldExclamationIcon,
    text: "Stay alert for passing vehicles",
  },
  2: {
    bg: "red.400",
    icon: ShieldExclamationIcon,
    text: "Potentially dangerous cycling conditions",
  },
} as const;

interface Props extends FlexProps {
  riskLevel: keyof typeof config;
}

export const Status = ({ riskLevel, ...rest }: Props) => {
  const { bg, icon, text } = config[riskLevel];

  return (
    <Flex
      bg={bg}
      px="6"
      py="3.5"
      alignItems="center"
      rounded="md"
      {...rest}
      gap="4"
    >
      <Icon as={icon} boxSize="8" strokeWidth="2" color="white" />
      <Heading color="white" fontSize="xl">
        {text}
      </Heading>
    </Flex>
  );
};
