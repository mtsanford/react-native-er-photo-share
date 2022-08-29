import { Rect, Size } from './geometry.types';

export interface Image {
    id: string;
    created: Date;
    userId: string;
    userName: string;
    title: string;
    preview: string;
    full: string;
    essentialRect: Rect;
    size: Size;
}

