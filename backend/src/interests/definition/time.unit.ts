export const TIME_UNITS = {
    MILLISECONDS_TO_SECOND: 1000,
  } as const;

export type timeUnits = typeof TIME_UNITS[keyof typeof TIME_UNITS];