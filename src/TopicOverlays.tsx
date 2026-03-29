import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const BRAND_TEAL = "#3ECECE";

type TopicSegment = {
  startSec: number;
  endSec: number;
  number: number;
  headline: string;
  badge: string;
};

const SEGMENTS: TopicSegment[] = [
  { startSec: 0.5, endSec: 5, number: 1, headline: "Copy-Pasting Emails", badge: "2025" },
  { startSec: 6.5, endSec: 10, number: 2, headline: "Manual Spreadsheets", badge: "Still?" },
  { startSec: 11, endSec: 15, number: 3, headline: "Falling Behind", badge: "Not Old School" },
  { startSec: 16.5, endSec: 26, number: 4, headline: "AI on Autopilot", badge: "While You Sleep" },
  { startSec: 27.5, endSec: 37, number: 5, headline: "The Bare Minimum", badge: "Not The Future" },
];

const TopicCard: React.FC<{ segment: TopicSegment }> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Smooth entrance — no bounce
  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Fade exit over last 10 frames
  const exitStart = durationInFrames - 10;
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(enter, [0, 1], [30, 0]);
  const opacity = enter * exit;

  // Badge slide-in, slightly delayed
  const badgeEnter = spring({
    frame: frame - Math.round(0.15 * fps),
    fps,
    config: { damping: 200 },
  });
  const badgeX = interpolate(badgeEnter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: 180,
        paddingLeft: 70,
        paddingRight: 70,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Faded segment number */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 60,
          fontSize: 200,
          fontWeight: 800,
          fontFamily,
          color: "rgba(255, 255, 255, 0.05)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {segment.number}
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          fontFamily,
          color: "#FFFFFF",
          lineHeight: 1.15,
          marginTop: 60,
          textShadow: "0 2px 16px rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      >
        {segment.headline}
      </div>

      {/* Badge */}
      <div
        style={{
          marginTop: 16,
          display: "inline-flex",
          opacity: badgeEnter,
          transform: `translateX(${badgeX}px)`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontFamily,
            color: BRAND_TEAL,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            padding: "8px 20px",
            borderRadius: 8,
            letterSpacing: 0.5,
          }}
        >
          {segment.badge}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Progress bar — thin line showing video progress
const ProgressBar: React.FC<{ totalDurationSec: number }> = ({
  totalDurationSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = frame / fps;
  const progress = Math.min(currentSec / totalDurationSec, 1);

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 70,
        right: 70,
        height: 3,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        overflow: "hidden",
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: BRAND_TEAL,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

// Zoom punch config — exported for IGReel to use
export const ZOOM_PUNCHES = [
  { timeSec: 2.2, intensity: 0.08 },
  { timeSec: 8.3, intensity: 0.06 },
  { timeSec: 13.5, intensity: 0.1 },
  { timeSec: 18.2, intensity: 0.06 },
  { timeSec: 23.6, intensity: 0.08 },
  { timeSec: 28.0, intensity: 0.07 },
  { timeSec: 31.4, intensity: 0.1 },
  { timeSec: 35.0, intensity: 0.06 },
];

export const TopicOverlays: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <ProgressBar totalDurationSec={38} />
      {SEGMENTS.map((segment, index) => {
        const startFrame = Math.round(segment.startSec * fps);
        const durationInFrames = Math.round(
          (segment.endSec - segment.startSec) * fps
        );

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
            premountFor={Math.round(0.3 * fps)}
          >
            <TopicCard segment={segment} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
