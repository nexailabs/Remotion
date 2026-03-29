import "./index.css";
import { Composition } from "remotion";
import { IGReel } from "./IGReel";

// Adjust per video: (video duration in seconds + CTA outro seconds) * fps
// Claude Code will update this when processing a new video
const VIDEO_SECONDS = 38.16;
const CTA_OUTRO_SECONDS = 3.5;
const FPS = 30;
const TOTAL_DURATION_FRAMES = Math.round((VIDEO_SECONDS + CTA_OUTRO_SECONDS) * FPS);

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
