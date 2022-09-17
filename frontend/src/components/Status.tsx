import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const config = {
  safe: {
    bg: "green.400",
    icon: ShieldCheckIcon,
  },
  warning: {
    bg: "orange.400",
    icon: ShieldExclamationIcon,
  },
  danger: {
    bg: "red.400",
    icon: ShieldExclamationIcon,
  },
} as const;

interface Props extends FlexProps {
  state: keyof typeof config;
}

export const Status = ({ state, ...rest }: Props) => {
  const { bg, icon } = config[state];

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
