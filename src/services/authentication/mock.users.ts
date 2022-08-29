import { Image as RNImage } from "react-native";

import { User } from "../../infrastructure/types/user.types";


// const mock_01_full_asset = require( "../../../../assets/mock/mock_01_full.jpg");
// const mock_01_full = RNImage.resolveAssetSource(mock_01_full_asset).uri;

export const mockUsers = [
    {
        email: "test1@gmail.com",
        password: "test123",
        displayName: "test 1",
        photoURL: "",
        uid: "101"
    },
    {
        email: "test2@gmail.com",
        password: "test123",
        displayName: "test 2",
        photoURL: "",
        uid: "102"
    },
    {
        email: "test3@gmail.com",
        password: "test123",
        displayName: "test 3",
        photoURL: "",
        uid: "103"
    },
    {
        email: "test4@gmail.com",
        password: "test123",
        displayName: "test 4",
        photoURL: "",
        uid: "104"
    },
];
