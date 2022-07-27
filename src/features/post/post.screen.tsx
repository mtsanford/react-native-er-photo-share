import React, { useState, useEffect, useRef } from "react";
import { Button, Image, View, Platform, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadResult,
  UploadTask,
} from "firebase/storage";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

import { Rect, Size } from "../infrastructure/types/geometry.types";
import { fitRect, sizeToRect } from "../../infrastructure/fit-essential-rect";
import { auth, storage } from "../../infrastructure/firebase";
import { uploadString } from "firebase/storage";

export const PostPlaceHolder = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const PostScreen = ({ route, navigation }) => {
  const [image, setImage] = useState<string>();
  const uriRef = useRef<string>();
  const sizeRef = useRef<Size>();

  const essentialRect = route.params?.essentialRect;

  console.log("essentialRect", essentialRect);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      uriRef.current = result.uri;
      sizeRef.current = { width: result.width, height: result.height };
      navigation.navigate("ERSelect", {
        uri: result.uri,
        imageSize: { width: result.width, height: result.height },
      });
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      // Get the file
      const saveFilename = Date.now().toString();
      const file = uriRef.current;

      if (!uriRef.current) return;

      const thumbImage = await makeThumbNail(
        uriRef.current,
        sizeRef.current,
        essentialRect
      );

      console.log("trumb returned", thumbImage.uri);
      setImage(thumbImage.uri);

      const fullImage = await makeFullImage(uriRef.current, sizeRef.current);
      console.log("fullImage returned", fullImage.uri);

      const thumbResponse = await fetch(thumbImage.uri);
      const fullResponse = await fetch(fullImage.uri);

      // if (!response.ok) {
      //   console.log('failed to open ', uriRef.current)
      // }

      const thumbBlob = await thumbResponse.blob();
      const fullBlob = await fullResponse.blob();

      // console.log('response');
      // console.log(response.type);
      // console.log(response.ok);
      // console.log(response.url);

      //const extension = file?.type.split("/")[1];
      const extension = "jpg";

      // Makes reference to the storage bucket location
      const thumbFileRef = ref(
        storage,
        `images3/${saveFilename}_thumb.${extension}`
      );
      const fullFileRef = ref(
        storage,
        `images3/${saveFilename}_full.${extension}`
      );

      // Starts the upload
      const thumbUploadTask: UploadTask = uploadBytesResumable(
        thumbFileRef,
        thumbBlob
      );
      const fullUploadTask: UploadTask = uploadBytesResumable(
        fullFileRef,
        fullBlob
      );

      // Listen to updates to upload task
      // thumbUploadTask.on("state_changed", (snapshot) => {
      //   const pct = (
      //     (snapshot.bytesTransferred / snapshot.totalBytes) *
      //     100
      //   ).toFixed(0);
      //   // setProgress(pct);
      // });

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      thumbUploadTask
        .then((d) => getDownloadURL(thumbFileRef))
        .then((url) => {
          console.log("thumb uploaded as ", url);
        });

        fullUploadTask
        .then((d) => getDownloadURL(fullFileRef))
        .then((url) => {
          console.log("full uploaded as ", url);
        });
    };

    uploadImage();

    console.log("PostScreen effect");
  }, [essentialRect]);

  return (
    <PostPlaceHolder>
      <Button title="Upload Picture" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 256, height: 256 }} />
      )}
    </PostPlaceHolder>
  );
};

// make a new image with max edge of 1600
const makeFullImage = async (
  uri: string,
  size: Size,
  maxEdge: number = 1600
) => {
  const scale = Math.max(size.width / maxEdge, size.height / maxEdge);
  const fullUri = await manipulateAsync(
    uri,
    [{ resize: { width: size.width / scale } }],
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
  console.log("fittedRect", fittedRect);
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
