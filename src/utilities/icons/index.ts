import { IconType } from "react-icons";
import {
    FcPlus,
    FcProcess,
    FcCamcorderPro,
    FcApproval,
    FcPrivacy,
    FcLowPriority,
    FcHighPriority,
    FcMediumPriority,
    FcLeave,
    FcBiomass
} from "react-icons/fc";

export const getIconValueForStatus = (value: string): IconType | undefined => {
    switch (value) {
        case "New":
            return FcPlus;
        case "In Proccess":
            return FcProcess;
        case "For Review":
            return FcCamcorderPro;
        case "In Tests":
            return FcBiomass;
        case "Finished":
            return FcApproval;
        case "Blocked":
            return FcPrivacy;
    }
};

export const getIconValueForPriority = (
    value: string
): IconType | undefined => { 
    switch (value) {
        case "Baja":
            return FcLowPriority;
        case "Media":
            return FcMediumPriority;
        case "Alta":
            return FcHighPriority;
        case "Crítica":
            return FcLeave;
    }
};
