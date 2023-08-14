import { Box } from "@chakra-ui/react";
import { Popover, PopoverPlacement } from "@nextui-org/react";
import React, { ReactNode } from "react";

interface IPopoverProps {
  trigger: ReactNode;
  clickAwayClosesModal?: boolean;
  content?: ReactNode;
  placement?: PopoverPlacement;
}

const PopoverComponent: React.FC<IPopoverProps> = (props) => {
  const { trigger, content, placement, clickAwayClosesModal } = props;

  return (
    <Popover shouldCloseOnInteractOutside={() => clickAwayClosesModal ?? true} placement={placement}>
      <Popover.Trigger>
        <Box>{trigger}</Box>
      </Popover.Trigger>
      <Popover.Content>
        {content}
      </Popover.Content>
    </Popover>
  );
};

export default PopoverComponent;
