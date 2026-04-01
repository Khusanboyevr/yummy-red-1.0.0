/**
 * Business hours utility for GoPizza
 * Open: 09:00 AM
 * Close: 02:00 AM (next day)
 */

export const BUSINESS_HOURS = {
  OPEN: 9, // 09:00
  CLOSE: 2, // 02:00 next day
};

export function getRestaurantStatus() {
  const now = new Date();
  const hours = now.getHours();
  const { OPEN, CLOSE } = BUSINESS_HOURS;

  let isOpen = false;
  if (CLOSE > OPEN) {
    // Same day closing (e.g. 09:00 - 22:00)
    isOpen = hours >= OPEN && hours < CLOSE;
  } else {
    // Overnight closing (e.g. 09:00 - 02:00)
    isOpen = hours >= OPEN || hours < CLOSE;
  }
  
  let nextOpening = new Date(now);
  if (hours < OPEN) {
    // It's currently before today's opening
    nextOpening.setHours(OPEN, 0, 0, 0);
  } else {
    // It's after today's opening, next opening is tomorrow
    nextOpening.setDate(now.getDate() + 1);
    nextOpening.setHours(OPEN, 0, 0, 0);
  }

  return {
    isOpen,
    nextOpening,
  };
}
