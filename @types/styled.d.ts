import "styled-components/native";
import { ThemeType } from "../src/infrastructure/theme";

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
