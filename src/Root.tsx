import "./index.css";
import { Composition } from "remotion";
import { IGReel } from "./IGReel";

// Video: 38.16s + 3.5s CTA outro = ~41.66s total
const TOTAL_DURATION_FRAMES = Math.round(41.66 * 30);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IGReel"
        component={IGReel}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
