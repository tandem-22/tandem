import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const config = {
  0: {
    bg: "green.400",
    icon: ShieldCheckIcon,
  },
  1: {
    bg: "orange.400",
    icon: ShieldExclamationIcon,
  },
  2: {
    bg: "red.400",
    icon: ShieldExclamationIcon,
  },
} as const;

interface Props extends FlexProps {
  riskLevel: keyof typeof config;
}

export const Status = ({ riskLevel, ...rest }: Props) => {
  const { bg, icon } = config[riskLevel];

  return (
    <Flex
      boxSize="16"
      bg={bg}
      justifyContent="center"
      alignItems="center"
      rounded="md"
      {...rest}
    >
      <Icon as={icon} boxSize="8" strokeWidth="2" />
    </Flex>
  );
};
