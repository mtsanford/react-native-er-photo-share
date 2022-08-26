
import { Image } from "../../infrastructure/types/image.types";
import { Rect, Size } from "../../infrastructure/types/geometry.types";

export interface NewPostResult {
  thumbnailUri?: string;
  fullUri?: string;
  imageSize?: Size;
  essentialRect?: Rect;
}

export interface ImagesService {
    requestMostRecent: () => Promise<Array<Image>>;
    newPost: ({
        uid,
        localUri,
        essentialRect,
        imageSize,
      }: {
        uid: string;
        localUri: string;
        essentialRect: Rect;
        imageSize: Size;
      }
    ) => Promise<NewPostResult>;
}