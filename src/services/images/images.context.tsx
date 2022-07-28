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

    requestMostRecent()
      .then((results) => {
        setIsLoading(false);
        setRecentImages(results);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    retrieveMostRecentImages();
  }, []);

  const refresh = () => {
    retrieveMostRecentImages();
  }

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
        refresh,
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
