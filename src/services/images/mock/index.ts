import { Image } from '../../../infrastructure/types/image.types';

export const mockAllImages: Record<string, Image> = {
    "pic1" : {
        id: "pic1",
        userId: "user1",
        title: "mock picture 1",
        full: "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images%2Fpic_001_full.jpg?alt=media&token=8ef80f9b-3dbb-450d-b5a1-6b904489308c",
        preview: "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images%2Fpic_001_square.jpg?alt=media&token=dd41d1b2-98b5-4d65-8a9c-868a0ba8b0ea",
        essentialRect: {
            left: 200,
            top: 300,
            width: 600,
            height: 1200,
        }
    },
    "pic2" : {
        id: "pic2",
        userId: "user2",
        title: "mock picture 2",
        full: "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images%2Fpic_001_full.jpg?alt=media&token=8ef80f9b-3dbb-450d-b5a1-6b904489308c",
        preview: "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images%2Fpic_001_square.jpg?alt=media&token=dd41d1b2-98b5-4d65-8a9c-868a0ba8b0ea",
        essentialRect: {
            left: 200,
            top: 300,
            width: 600,
            height: 1200,
        }
    },
};

export let mockRecentResults: Image[] = [];

for (const [key, value] of Object.entries(mockAllImages)) {
    mockRecentResults.push(value);
}



