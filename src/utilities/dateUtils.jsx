import { Timestamp } from "firebase/firestore";

// Convert Firestore Timestamp to string "dd/mm/yyyy" for display in UI

export const formatDateForDisplay = (timestamp) => {
  if (!timestamp || typeof timestamp.toDate !== "function") return "";
  const date = timestamp.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Convert Firestore Timestamp to "yyyy-mm-dd" format for input type=date form
export const formatDateForInput = (value) => {
  if (!value) return "";

  const date = typeof value.toDate === "function" ? value.toDate() : value;
  return date.toISOString().split("T")[0];
};

// Convert form input "yyyy-mm-dd" into a Firestore Timestamp
export const parseDateToTimestamp = (dateString) => {
  if (!dateString) return null;
  return Timestamp.fromDate(new Date(dateString + "T00:00:00"));
};
