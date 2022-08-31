import { Image as RNImage } from "react-native";

import { Image } from '../../../infrastructure/types/image.types';
import { mockUsers } from '../../authentication/mock.users';

export const numImages = 20;

const imageAssets = [
    {
        full: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_01_full.jpg")).uri,
        preview: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_01_preview.jpg")).uri,
        essentialRect: {left:679, top:80, width:415, height:623},
        size: { width: 1350, height: 900 },
    },
    {
        full: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_02_full.jpg")).uri,
        preview: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_02_preview.jpg")).uri,
        essentialRect: {left:347, top:384, width:461, height:507},
        size: { width: 1100, height: 1000 },
    },
    {
        full: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_03_full.jpg")).uri,
        preview: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_03_preview.jpg")).uri,
        essentialRect: {left:563, top:231, width:415, height:562},
        size: { width: 1219, height: 900 },
    },
    {
        full: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_04_full.jpg")).uri,
        preview: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_04_preview.jpg")).uri,
        size: { width: 1221, height: 1200 },
        essentialRect: {left:352, top:314, width:553, height:563},
    },
    {
        full: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_05_full.jpg")).uri,
        preview: RNImage.resolveAssetSource(require( "../../../../assets/mock/images/mock_05_preview.jpg")).uri,
        size: { width: 1265, height: 1300 },
        essentialRect: {left:335, top:336, width:600, height:583},
    },
];

let mockAllImages: Record<string, Image> = {};

const nowTimestamp = Date.now();

for (let i=0; i<numImages; i++) {
  const user = mockUsers[i % mockUsers.length];
  const image = imageAssets[i % imageAssets.length];
  const id = `pic${i+1}`;
  mockAllImages[id] = {
    id: id,
    userId: user.uid,
    userName: user.displayName,
    photoURL: user.photoURL,
    title: `mock picture ${i+1}`,
    full: image.full,
    preview: image.preview,
    essentialRect: image.essentialRect,
    size: image.size,
    created: new Date(nowTimestamp - i * 10 * 60 * 1000),
  }
}

export let mockRecentResults: Image[] = [];

for (const [key, value] of Object.entries(mockAllImages)) {
    mockRecentResults.push(value);
}

console.log(mockRecentResults);


