import { Rect, Size } from "../../infrastructure/types/geometry.types"

export interface ImagePost {
    id: string;
    created: Date;
    full: string;
    preview: string;
    essentialRect: Rect;
    size: Size;
}

export interface NewPostResult {
  thumbnailUri?: string;
  fullUri?: string;
  imageSize?: Size;
  essentialRect?: Rect;
}


export interface ImagesService {
    requestMostRecent: () => Promise<Array<ImagePost>>;
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