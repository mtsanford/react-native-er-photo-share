import { Size } from "../types/geometry.types";

export type AppStackParamList = {
    Home: undefined;
    Carousel: { initialIndex: number };
    ERSelect: { uri: string, imageSize: Size },
    UserInfo: { uid: string },
};

