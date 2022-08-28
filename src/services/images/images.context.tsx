import React, {
  useState,
  createContext,
  useEffect,
  useReducer,
} from "react";

import { ImagesService } from "./images.service";
import { Image } from "../../infrastructure/types/image.types";
import { Rect, Size } from "../../infrastructure/types/geometry.types";

interface UploadState {
  uploading: boolean;
  recentError?: string;
  recentThumbnailUri?: string;
}

const initialUploadState: UploadState = {
  uploading: false,
  recentError: undefined,
  recentThumbnailUri: undefined,
};


interface UploadAction {
  type: "startUpload" | "uploaded" | "error";
  thumbnailUri?: string;
  error?: string;
}

interface ImagesContextInterface {
  recentImages: Image[],
  refresh: () => void,
  isLoading: boolean,
  error?: string,
  uploadState: UploadState,
  upload: ({ uid, localUri, essentialRect, imageSize }: { uid: string, localUri: string, essentialRect: Rect, imageSize: Size }) => void;
}

const defaultImagesContextInterface: ImagesContextInterface = {
  recentImages: [],
  refresh: () => {},
  isLoading: false,
  uploadState: initialUploadState,
  upload: ({ uid, localUri, essentialRect, imageSize }: { uid: string, localUri: string, essentialRect: Rect, imageSize: Size }) => {},
}

export const ImagesContext = createContext<ImagesContextInterface>(defaultImagesContextInterface);


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



type ImagesContextProviderProps = {
  service: ImagesService,
}

export const ImagesContextProvider: React.FC<ImagesContextProviderProps> = ({ children, service }) => {
  const [recentImages, setRecentImages] = useState<Array<Image>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [uploadState, dispatchUpload] = useReducer(
    uploadReducer,
    initialUploadState
  );

  const retrieveMostRecentImages = () => {
    setIsLoading(true);
    setRecentImages([]);

    service.requestMostRecent()
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

  const upload = ({ uid, localUri, essentialRect, imageSize }: { uid: string, localUri: string, essentialRect: Rect, imageSize: Size }) => {
    if (uploadState.uploading) return;

    dispatchUpload({
      type: "startUpload",
    });

    service.newPost({ uid, localUri, essentialRect, imageSize })
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
