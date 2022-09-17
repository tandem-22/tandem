import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import { Bars4Icon } from "@heroicons/react/24/outline";

interface Props extends FlexProps {}

export const Controls = (props: Props) => {
  return (
    <Flex
      boxSize="16"
      bg="gray.900"
      justifyContent="center"
      alignItems="center"
      rounded="lg"
      {...props}
    >
      <Icon as={Bars4Icon} boxSize="8" strokeWidth="1" />
    </Flex>
  );
};
