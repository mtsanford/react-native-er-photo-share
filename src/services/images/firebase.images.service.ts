import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadResult,
  UploadTask,
} from "firebase/storage";
import { collection, collectionGroup, query, orderBy, limit, getDocs, addDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { storage, firestore } from "../../infrastructure/firebase";


import { ImagesService, NewPostResult } from "./images.service";
import { Rect, Size } from "../../infrastructure/types/geometry.types";
import { Image } from "../../infrastructure/types/image.types";
import { fitRect, sizeToRect } from "../../infrastructure/fit-essential-rect";

import { mockRecentResults, mockAllImages } from "./mock";

const requestMostRecent = async () => {
  try {
    const images = collectionGroup(
      firestore,
      "images",
    );
    const q = query(images, orderBy("created", "desc"), limit(24));

    const querySnapshot = await getDocs(q);
    const recentImages = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id
      } as Image
    });

    console.log("recentImages", recentImages);
    return recentImages;
  }
  catch (e) {
    console.log("requestMostRecent failed", e);
    return []
    // return {
    //   error: e as string,
    // };
  }
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

const uploadFile = (path: string, blob: any): Promise<any> => {
  const promise = new Promise<any>((resolve, reject) => {
    const fileRef = ref(storage, path);

    const uploadTask: UploadTask = uploadBytesResumable(fileRef, blob, {
      cacheControl: "public, max-age=3600",
    });

    // Note: uploadTask is not a JS promise
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


const maxEdge = 1600;

// Create a new post
// - thumbnail
// - full image
// - firestore entry
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
  const saveFilename = Date.now().toString();

    const extension = "jpg";
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

    const thumbImage = await makeThumbNail(localUri, imageSize, essentialRect);
    const thumbResponse = await fetch(thumbImage.uri);

    const thumbBlob = await thumbResponse.blob();
    const thumbPath = `users/${uid}/images/thumb/${saveFilename}.${extension}`;
    const thumbResult = await uploadFile(thumbPath, thumbBlob);

    const fullImage = await makeFullImage(localUri, newWidth);
    const fullResponse = await fetch(fullImage.uri);

    const fullBlob = await fullResponse.blob();
  
    const fullPath = `users/${uid}/images/full/${saveFilename}.${extension}`;
    const fullResult = await uploadFile(fullPath, fullBlob);

    const images = collection(
      firestore,
      "images",
    );

    const docRef = await addDoc(collection(firestore, `users/${uid}/images`), {
      full: fullResult.url,
      preview: thumbResult.url,
      essentialRect: newEssentialRect,
      size: newSize,
      created: serverTimestamp(),
    });

    return {
      thumbnailUri: thumbResult.url,
      fullUri: fullResult.url,
      imageSize: newSize,
      essentialRect: newEssentialRect,
    };
};

// make a new image with max edge of 1600
const makeFullImage = async (uri: string, newWidth: number) => {
  const fullUri = await manipulateAsync(
    uri,
    [{ resize: { width: newWidth } }],
    { compress: 0.8, format: SaveFormat.JPEG }
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


export const FirebaseImagesService: ImagesService = {
  requestMostRecent,
  newPost
}