import { Box } from "@chakra-ui/react";
import { Popover, PopoverPlacement, Text } from "@nextui-org/react";
import React, { ReactNode } from "react";

interface IPopoverProps {
  trigger: ReactNode;
  content?: ReactNode;
  placement?: PopoverPlacement;
}

const PopoverComponent: React.FC<IPopoverProps> = (props) => {
  const { trigger, content, placement } = props;

  return (
    <Popover placement={placement}>
      <Popover.Trigger>
        <Box>{trigger}</Box>
      </Popover.Trigger>
      <Popover.Content>{content}</Popover.Content>
    </Popover>
  );
};

export default PopoverComponent;
