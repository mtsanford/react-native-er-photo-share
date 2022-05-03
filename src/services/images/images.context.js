import React, { useState, useContext, createContext, useEffect } from "react";

import { requestMostRecent } from "./images.service";

export const ImagesContext = createContext();

export const ImagesContextProvider = ({ children }) => {
  const [recentImages, setRecentImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <ImagesContext.Provider
      value={{
        recentImages,
        isLoading,
        error,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};
