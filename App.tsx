import "react-native-gesture-handler";

import { ImagesContextProvider } from "./src/services/images/images.context";
import { Navigation } from "./src/infrastructure/navigation";

export default function App() {
  return (
    <ImagesContextProvider>
      <Navigation />
    </ImagesContextProvider>
  );
}
