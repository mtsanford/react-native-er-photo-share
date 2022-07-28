import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  Text,
  Animated,
  Easing,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import Lottie from "lottie-react-native";

import { Size } from "../infrastructure/types/geometry.types";
import { ImagesContext } from "../../services/images/images.context";

export const PostPlaceHolder = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const AnimationWrapper = styled.View`
  width: 500px;
  height: 500px;
  padding: 4px;
`;

  // position: absolute;
  // top: 30px;


export const PostScreen = ({ route, navigation }) => {
  const { uploadState } = useContext(ImagesContext);
  const [image, setImage] = useState<string>();
  const [ showUploadDone, setShowUploadDone] = useState<boolean>(false);
  const uriRef = useRef<string>();
  const sizeRef = useRef<Size>();

  const recentThumbRef = useRef<string>(uploadState.recentThumbnailUri);

  // console.log('showUploadDone', showUploadDone);

  useEffect( () => {
    let timer;
    console.log('uploadState.uploading', uploadState.uploading)
    // we've got a new uploaded image
    if (!uploadState.uploading && recentThumbRef.current !== uploadState.recentThumbnailUri) {
      recentThumbRef.current = uploadState.recentThumbnailUri;
      setShowUploadDone(true);
      timer = setTimeout(() => {
        setShowUploadDone(false);
      }, 1200)
    }

    return () => {
      clearTimeout(timer);
    }

  }, [uploadState.uploading])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uriRef.current = result.uri;
      sizeRef.current = { width: result.width, height: result.height };
      navigation.navigate("ERSelect", {
        uri: result.uri,
        imageSize: { width: result.width, height: result.height },
      });
    }
  };

  const showUploading = uploadState.uploading;
  const showUploadButton = !showUploading && !showUploadDone;
  const showThumb = uploadState.recentThumbnailUri && !showUploading && !showUploadDone

  return (
    <PostPlaceHolder>
      { showUploadButton && <Button title="Upload Picture" onPress={pickImage} /> }
      { showUploading && <Uploading /> }
      { showUploadDone && <UploadDone />}

      { showThumb && (
        <Image source={{ uri: uploadState.recentThumbnailUri }} style={{ width: 256, height: 256 }} />
      )}
    </PostPlaceHolder>
  );
};

const UploadDone = () => {
  const animationProgress = useRef(new Animated.Value(.433));
  useEffect(() => {
    () => {};
  }, []);

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <AnimationWrapper>
      <Lottie
        source={require("../../../assets/5414-image-uploading.json")}
        progress={animationProgress.current}
      />
    </AnimationWrapper>
  );
};

const Uploading = () => {
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    () => {};
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animationProgress.current, {
        toValue: 0.433,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iterations: 1000 }
    ).start();
  }, []);

  return (
    <AnimationWrapper>
      <Lottie
        source={require("../../../assets/5414-image-uploading.json")}
        progress={animationProgress.current}
      />
    </AnimationWrapper>
  );
};
