
import { ImagesService, NewPostResult } from "./images.service";
import { Rect, Size } from "../../infrastructure/types/geometry.types";
import { Image } from "../../infrastructure/types/image.types";
import { fitRect, sizeToRect } from "../../infrastructure/fit-essential-rect";

import { mockRecentResults } from "./mock";

const requestMostRecent = async () => {
    return mockRecentResults;
};

const requestById = (id: string) => {
  return new Promise((resolve, reject) => {
    const image = mockAllImages[id];
    if (!image) {
      reject("not found!");
    }
    resolve(image);
  });
};


const newPost = async ({
    uid,
    localUri,
    essentialRect,
    imageSize,
  }: {
    uid: string;
    localUri: string;
    essentialRect: Rect;
    imageSize: Size;
  }): Promise<NewPostResult> => {
    return new Promise<NewPostResult>( (resolve, reject) => {

    })
  }

export const MockImagesService: ImagesService = {
  requestMostRecent,
  newPost
}