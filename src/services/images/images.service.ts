import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadResult,
  UploadTask,
} from "firebase/storage";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

import { storage, firestore } from "../../infrastructure/firebase";
import { Rect, Size } from "../../infrastructure/types/geometry.types";
import { fitRect, sizeToRect } from "../../infrastructure/fit-essential-rect";

import { mockRecentResults, mockAllImages } from "./mock";

export const requestMostRecent = async () => {
  const images = collection(
    firestore,
    "images",
  );
  const q = query(images, orderBy("created", "desc"), limit(24));

  const querySnapshot = await getDocs(q);
  const recentImages = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  });

  return recentImages;  
};

export const requestById = (id: string) => {
  return new Promise((resolve, reject) => {
    const image = mockAllImages[id];
    if (!image) {
      reject("not found!");
    }
    resolve(image);
  });
};

const uploadFile = (path: string, blob: any): Promise<any> => {
  const promise = new Promise<any>((resolve, reject) => {
    const fileRef = ref(storage, path);
    const uploadTask: UploadTask = uploadBytesResumable(fileRef, blob, {
      cacheControl: "public, max-age=3600",
    });
    uploadTask
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        console.log("uploaded as ", url);
        resolve({ url: url });
      })
      .catch((e) => {
        console.log(e.message);
        reject({ error: e.message });
      });
  });
  return promise;
};

export interface NewPostResult {
  error?: string;
  thumbnailUri?: string;
  fullUri?: string;
  imageSize?: Size;
  essentialRect?: Rect;
}

const maxEdge = 960;

// Create a new post
// - thumbnail
// - full image
// - firestore entry
export const newPost = async ({
  localUri,
  essentialRect,
  imageSize,
}: {
  localUri: string;
  essentialRect: Rect;
  imageSize: Size;
}): Promise<NewPostResult> => {
  const saveFilename = Date.now().toString();

  try {
    const scale = Math.min(
      maxEdge / imageSize.width,
      maxEdge / imageSize.height
    );
    const newWidth = imageSize.width * scale;

    const newEssentialRect = {
      left: Math.floor(essentialRect.left * scale),
      top: Math.floor(essentialRect.top * scale),
      width: Math.floor(essentialRect.width * scale),
      height: Math.floor(essentialRect.height * scale),
    };

    const newSize = {
      width: Math.floor(imageSize.width * scale),
      height: Math.floor(imageSize.height * scale),
    };

    console.log("newEssentialRect", newEssentialRect);

    const thumbImage = await makeThumbNail(localUri, imageSize, essentialRect);
    const fullImage = await makeFullImage(localUri, newWidth);

    // console.log("fullImage returned", fullImage.uri);
    // console.log("trumb returned", thumbImage.uri);

    const thumbResponse = await fetch(thumbImage.uri);
    const fullResponse = await fetch(fullImage.uri);

    const thumbBlob = await thumbResponse.blob();
    const fullBlob = await fullResponse.blob();

    const extension = "jpg";
    const thumbPath = `images3/${saveFilename}_thumb.${extension}`;
    const fullPath = `images3/${saveFilename}_full.${extension}`;

    const thumbResult = await uploadFile(thumbPath, thumbBlob);
    const fullResult = await uploadFile(fullPath, fullBlob);

    return {
      thumbnailUri: thumbResult.url,
      fullUri: fullResult.url,
      imageSize: newSize,
      essentialRect: newEssentialRect,
    };
  } catch (e) {
    console.log("newPost failed", e);
    return {
      error: e as string,
    };
  }
};

// make a new image with max edge of 1600
const makeFullImage = async (uri: string, newWidth: number) => {
  const fullUri = await manipulateAsync(
    uri,
    [{ resize: { width: newWidth } }],
    { compress: 0.6, format: SaveFormat.JPEG }
  );
  return fullUri;
};

const makeThumbNail = async (
  uri: string,
  size: Size,
  essentialRect: Rect,
  thumbnailSize: number = 256
) => {
  const fittedRect = fitRect(
    sizeToRect(size),
    essentialRect,
    sizeToRect({ width: thumbnailSize, height: thumbnailSize })
  );
  const scale = fittedRect.width / size.width;
  // console.log("fittedRect", fittedRect);

  const thumbUri = await manipulateAsync(
    uri,
    [
      { resize: { width: size.width * scale } },
      {
        crop: {
          originX: -fittedRect.left,
          originY: -fittedRect.top,
          width: thumbnailSize,
          height: thumbnailSize,
        },
      },
    ],
    { compress: 0.5, format: SaveFormat.JPEG }
  );
  return thumbUri;
};
