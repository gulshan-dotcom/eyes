// types/user.ts

export interface User {
  userId: string;
  location: {
    accuracy: string[];
    lan: string[];
    lon: string[];
  };
  videos: string[]; // array of video src URLs
}
