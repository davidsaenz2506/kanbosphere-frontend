import { GridColumnIcon } from "@glideapps/glide-data-grid";

const icons = {
  phone: {
    overlayIcon: GridColumnIcon.RowOwnerOverlay,
    icon: GridColumnIcon.HeaderPhone,
  },
  boolean: {
    icon: GridColumnIcon.HeaderBoolean,
  },
  number: {
    icon: GridColumnIcon.HeaderNumber,
  },
  multipicklist: {
    icon: GridColumnIcon.HeaderIfThenElse,
  },
  picklist: {
    icon: GridColumnIcon.HeaderArray,
  },
  restrictedPicklist: {
    icon: GridColumnIcon.HeaderArray,
  },
  url: {
    icon: GridColumnIcon.HeaderUri,
  },
  currency: {
    icon: GridColumnIcon.HeaderRollup,
  },
  date: {
    icon: GridColumnIcon.HeaderDate,
  },
  id: {
    icon: GridColumnIcon.RowOwnerOverlay,
  },
  string: {
    icon: GridColumnIcon.HeaderString,
  },
  mail: {
    icon: GridColumnIcon.HeaderEmail,
  },
  compound: {
    icon: GridColumnIcon.HeaderReference,
  },
  textarea: {
    icon: GridColumnIcon.HeaderGeoDistance,
  },
  double: {
    icon: GridColumnIcon.HeaderGeoDistance,
  },
  datetime: {
    icon: GridColumnIcon.HeaderDate,
  },
  reference: {
    icon: GridColumnIcon.HeaderReference,
  },
  percent: {
    icon: GridColumnIcon.HeaderEmail,
  },
  time: {
    icon: GridColumnIcon.HeaderTime
  }
};

export default icons;
