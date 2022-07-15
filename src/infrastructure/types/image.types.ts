import { Rect, Size } from './geometry.types';

export interface Image {
    id: string;
    userId: string;
    title: string;
    preview: string;
    full: string;
    essentialRect: Rect;
    size?: Size;
}

