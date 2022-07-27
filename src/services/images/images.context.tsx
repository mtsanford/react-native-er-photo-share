import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
} from "react";

import { requestMostRecent, newPost } from "./images.service";
import { Image } from "../../infrastructure/types/image.types";
import { Rect, Size } from "../../infrastructure/types/geometry.types";

export const ImagesContext = createContext();

interface UploadState {
  uploading: boolean;
  recentError?: string;
  recentThumbnailUri?: string;
}

type UploadAction = any;

const uploadReducer = (
  state: UploadState,
  action: UploadAction
): UploadState => {
  switch (action.type) {
    case "startUpload":
      return { ...state, uploading: true };
    case "uploaded":
      return { uploading: false, recentThumbnailUri: action.thumbnailUri };
    case "error":
      return { uploading: false, recentError: action.error };
  }
  return { ...state };
};

const initialUploadState: UploadState = {
  uploading: false,
  recentError: undefined,
  recentThumbnailUri: undefined,
};

export const ImagesContextProvider = ({ children }) => {
  const [recentImages, setRecentImages] = useState<Array<Image>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadState, dispatchUpload] = useReducer(
    uploadReducer,
    initialUploadState
  );

  const retrieveMostRecentImages = () => {
    setIsLoading(true);
    setRecentImages([]);

    setTimeout(() => {
      requestMostRecent()
        .then((results) => {
          setIsLoading(false);
          setRecentImages(results);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err);
        });
    }, 2000);
  };

  useEffect(() => {
    retrieveMostRecentImages();
  }, []);

  const upload = ({ localUri, essentialRect, imageSize }) => {
    if (uploadState.uploading) return;

    dispatchUpload({
      type: "start",
    });

    newPost({ localUri, essentialRect, imageSize })
      .then((result) => {
        dispatchUpload({
          type: "uploaded",
          thumbnailUri: result.thumbnailUri,
        });

        setRecentImages([
          {
            id: Date.now(),
            userId: "",
            title: "",
            preview: result.thumbnailUri as string,
            full: result.fullUri as string,
            essentialRect: result.essentialRect as Rect,
            size: result.imageSize as Size,
          },
          ...recentImages,
        ]);
      })
      .catch((e) => {
        dispatchUpload({
          type: "error",
          error: e,
        });
      });
  };

  return (
    <ImagesContext.Provider
      value={{
        recentImages,
        isLoading,
        error,
        uploadState,
        upload,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};
