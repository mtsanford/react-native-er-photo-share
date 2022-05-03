import { mockRecentResults, mockAllImages } from "./mock";

export const requestMostRecent = () => {
  return new Promise((resolve, reject) => {
      resolve(mockRecentResults);
  });
};

export const requestById = (id: string) => {
    return new Promise((resolve, reject) => {
      const image = mockAllImages[id];
      if (!image) {
        reject("not found!");
      }
      resolve(image);
  });
}
