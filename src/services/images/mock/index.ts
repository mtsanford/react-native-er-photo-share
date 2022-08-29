import { Image as RNImage } from "react-native";

import { Image } from '../../../infrastructure/types/image.types';

const mock_01_full_asset = require( "../../../../assets/mock/mock_01_full.jpg");
const mock_01_preview_asset = require( "../../../../assets/mock/mock_01_preview.jpg");
const mock_02_full_asset = require( "../../../../assets/mock/mock_02_full.jpg");
const mock_02_preview_asset = require( "../../../../assets/mock/mock_02_preview.jpg");
const mock_03_full_asset = require( "../../../../assets/mock/mock_03_full.jpg");
const mock_03_preview_asset = require( "../../../../assets/mock/mock_03_preview.jpg");

const mock_01_full = RNImage.resolveAssetSource(mock_01_full_asset).uri;
const mock_01_preview = RNImage.resolveAssetSource(mock_01_preview_asset).uri;

const mock_02_full = RNImage.resolveAssetSource(mock_02_full_asset).uri;
const mock_02_preview = RNImage.resolveAssetSource(mock_02_preview_asset).uri;

const mock_03_full = RNImage.resolveAssetSource(mock_03_full_asset).uri;
const mock_03_preview = RNImage.resolveAssetSource(mock_03_preview_asset).uri;

const now = new Date();

export const mockAllImages: Record<string, Image> = {
    "pic1" : {
        id: "pic1",
        userId: "101",
        userName: "User 1",
        title: "mock picture 1",
        full: mock_01_full,
        preview: mock_01_preview,
        essentialRect: {left:679, top:80, width:415, height:623},
        size: { width: 1350, height: 900 },
        created: now,
    },
    "pic2" : {
        id: "pic2",
        userId: "102",
        userName: "User 2",
        title: "mock picture 2",
        full: mock_02_full,
        preview: mock_02_preview,
        essentialRect: {left:347, top:384, width:461, height:507},
        size: { width: 1100, height: 1000 },
        created: now,
    },
    "pic3" : {
        id: "pic3",
        userId: "102",
        userName: "User 2",
        title: "mock picture 3",
        full: mock_03_full,
        preview: mock_03_preview,
        essentialRect: {left:563, top:231, width:415, height:562},
        size: { width: 1219, height: 900 },
        created: now,
    },
    "pic4" : {
        id: "pic4",
        userId: "101",
        userName: "User 1",
        title: "mock picture 4",
        full: mock_01_full,
        preview: mock_01_preview,
        essentialRect: {left:679, top:80, width:415, height:623},
        size: { width: 1350, height: 900 },
        created: now,
    },
    "pic5" : {
        id: "pic5",
        userId: "user2",
        userName: "User 2",
        title: "mock picture 5",
        full: mock_02_full,
        preview: mock_02_preview,
        essentialRect: {left:347, top:384, width:461, height:507},
        size: { width: 1100, height: 1000 },
        created: now,
    },
    "pic6" : {
        id: "pic6",
        userId: "102",
        userName: "User 2",
        title: "mock picture 6",
        full: mock_03_full,
        preview: mock_03_preview,
        essentialRect: {left:563, top:231, width:415, height:562},
        size: { width: 1219, height: 900 },
        created: now,
    },
    "pic7" : {
        id: "pic7",
        userId: "101",
        userName: "User 1",
        title: "mock picture 7",
        full: mock_01_full,
        preview: mock_01_preview,
        essentialRect: {left:679, top:80, width:415, height:623},
        size: { width: 1350, height: 900 },
        created: now,
    },
    "pic8" : {
        id: "pic8",
        userId: "102",
        userName: "User 2",
        title: "mock picture 8",
        full: mock_02_full,
        preview: mock_02_preview,
        essentialRect: {left:347, top:384, width:461, height:507},
        size: { width: 1100, height: 1000 },
        created: now,
    },
    "pic9" : {
        id: "pic9",
        userId: "102",
        userName: "User 2",
        title: "mock picture 9",
        full: mock_03_full,
        preview: mock_03_preview,
        essentialRect: {left:563, top:231, width:415, height:562},
        size: { width: 1219, height: 900 },
        created: now,
    },
};

export let mockRecentResults: Image[] = [];

for (const [key, value] of Object.entries(mockAllImages)) {
    mockRecentResults.push(value);
}



