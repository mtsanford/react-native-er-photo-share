import React from "react";
import styled, { useTheme, DefaultTheme } from "styled-components/native";

const sizeVariant = {
  small: 1,
  medium: 2,
  large: 3,
};

const positionVariant = {
  top: "marginTop",
  left: "marginLeft",
  right: "marginRight",
  bottom: "marginBottom",
};

const getVariant = (position: keyof typeof positionVariant, size: keyof typeof sizeVariant, theme: DefaultTheme) => {
  const sizeIndex = sizeVariant[size];
  const property = positionVariant[position];
  const value = theme.space[sizeIndex];

  return `${property}:${value}`;
};

const SpacerView = styled.View`
  ${({ variant }: { variant: string }) => variant};
`;

export const Spacer = ({
  position,
  size,
  children,
}: {
  position: keyof typeof positionVariant;
  size: keyof typeof sizeVariant;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const variant = getVariant(position, size, theme);

  return <SpacerView variant={variant}>{children}</SpacerView>;
};

Spacer.defaultProps = {
  position: "top",
  size: "small",
};
