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

import { Size } from "../../infrastructure/types/geometry.types";
import { auth, storage } from "../../infrastructure/firebase";
import { uploadString } from "firebase/storage";

export const PostPlaceHolder = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const PostScreen = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
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
      const file = uriRef.current;

      if (!uriRef.current) return;

      const response = await fetch(uriRef.current);

      if (!response.ok) {
        console.log('failed to open ', uriRef.current)
      }
      const blob = await response.blob();
      // console.log('response');
      // console.log(response.type);
      // console.log(response.ok);
      // console.log(response.url);

      //const extension = file?.type.split("/")[1];
      const extension = 'jpg';

      // Makes reference to the storage bucket location
      const fileRef = ref(
        storage,
        `images3/${Date.now()}.${extension}`
      );
      // setUploading(true);

      // Starts the upload
      const uploadTask: UploadTask = uploadBytesResumable(fileRef, blob);

      // Listen to updates to upload task
      uploadTask.on("state_changed", (snapshot) => {
        const pct = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        // setProgress(pct);
      });

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      uploadTask
        .then((d) => getDownloadURL(fileRef))
        .then((url) => {
          console.log('uploaded as ', url)
          // setDownloadURL(url);
          // setUploading(false);
        });
    };

    uploadImage();

    console.log("PostScreen effect");
  }, [essentialRect]);

  return (
    <PostPlaceHolder>
      <Button title="Upload Picture" onPress={pickImage} />
    </PostPlaceHolder>
  );
};
