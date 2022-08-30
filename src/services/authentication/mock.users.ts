import { Image as RNImage } from "react-native";

const numUsers = 4;

const assets = [
  require("../../../assets/mock/users/user_1_small.jpg"),
  require("../../../assets/mock/users/user_2_small.jpg"),
];

export let mockUsers: any[] = [];

for (let i=1; i<=numUsers; i++) {
  const asset = assets[i%assets.length];
  const url = RNImage.resolveAssetSource(asset).uri;
  mockUsers.push({
    email: `test${i}@gmail.com`,
    pasword: "test123",
    displayName: `Mock User ${i}`,
    photoURL: url,
    uid: `${100 + i}`,
  });
}

console.log(mockUsers);

