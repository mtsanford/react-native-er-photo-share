import { Rect, Size } from "./types/geometry.types";

// image = | a |  e  |          b          |
// view  = |   v    |

// a = length of portion of line left of essential (e)
// b = length of portion of line right of essential (e)
// e = length of essential part of line that must fit in view
// v = length of viewport

// i2 = | a |  e  | a |   (surrounded by lesser of a or b)

export const fitLine = (a: number, e: number, b: number, v: number): number => {
  const i = a + e + b; // size of entire image line
  const i2 = a > b ? e + 2 * b : e + 2 * a; // essential surrounded by 2X the shorter of a or b

  if (v >= i) {
    return (v - i) / 2;
  }

  if (v > i2) {
    return a > b ? v - i : 0;
  }

  return (v - e) / 2 - a;
};

// Given a rect (clientRectToTransform) in client coordinates, get the coordinates in imageRect,
// reversing the scaling and translation done by fitRect
export const clientToImageRect = (
  imageRect: Rect,
  fittedRect: Rect,
  clientRectToTransform: Rect
): Rect => {
  const scale = imageRect.width / fittedRect.width;
  return {
    left: (clientRectToTransform.left - fittedRect.left) * scale,
    top: (clientRectToTransform.top - fittedRect.top) * scale,
    width: clientRectToTransform.width * scale,
    height: clientRectToTransform.height * scale,
  };
};

// Given a rect (imageRect) in image coordinates, get the coordinates in clientRect,
export const imageToClientRect = (
  imageRect: Rect,
  fittedRect: Rect,
  imageRectToTransform: Rect
): Rect => {
  const scale = fittedRect.width / imageRect.width;
  return {
    left: imageRectToTransform.left * scale + fittedRect.left,
    top: imageRectToTransform.top * scale + fittedRect.top,
    width: imageRectToTransform.width * scale,
    height: imageRectToTransform.height * scale,
  };
};

// Assume imageRect and clientRect are (left=0, top=0)
// Return: fittedRect, which scales and translate the image, such that when
// shown in clientRect, optimally shows the essentialRect of the image.
export const fitRect = (
  imageRect: Rect,
  essentialRect: Rect,
  clientRect: Rect
): Rect => {
  // How much do we have to scale image to fit essential part in client?
  // We need to pick the smaller of these two
  const hscale = clientRect.width / essentialRect.width;
  const vscale = clientRect.height / essentialRect.height;
  const scale = Math.min(hscale, vscale);

  const scaledImageRect: Rect = {
    left: 0,
    top: 0,
    width: imageRect.width * scale,
    height: imageRect.height * scale,
  };

  const scaledEssentialRect: Rect = {
    left: essentialRect.left * scale,
    top: essentialRect.top * scale,
    width: essentialRect.width * scale,
    height: essentialRect.height * scale,
  };

  const fittedRect: Rect = {
    left: 0,
    top: 0,
    width: imageRect.width * scale,
    height: imageRect.height * scale,
  };

  if (vscale > hscale) {
    // essentalRect width snuggly fits in client width
    fittedRect.left = -scaledEssentialRect.left;
    fittedRect.top = fitLine(
      scaledEssentialRect.top,
      scaledEssentialRect.height,
      scaledImageRect.height -
        (scaledEssentialRect.top + scaledEssentialRect.height),
      clientRect.height
    );
  } else {
    // essentalRect height snuggly fits in client height
    fittedRect.top = -scaledEssentialRect.top;
    fittedRect.left = fitLine(
      scaledEssentialRect.left,
      scaledEssentialRect.width,
      scaledImageRect.width -
        (scaledEssentialRect.left + scaledEssentialRect.width),
      clientRect.width
    );
  }

  // @#%&! Jest thinks -0 and 0 are different numbers
  const adjustedFittedRect: Rect = {
    top: fittedRect.top + 0,
    left: fittedRect.left + 0,
    width: fittedRect.width + 0,
    height: fittedRect.height + 0,
  };

  return adjustedFittedRect;
};

/************************************/

export function sizeToRect(s: Size): Rect {
  return { left: 0, top: 0, width: s.width, height: s.height};
}
