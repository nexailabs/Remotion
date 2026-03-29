import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
  Img,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Captions } from "./Captions";
import { TopicOverlays, ZOOM_PUNCHES } from "./TopicOverlays";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

const VIDEO_DURATION_SECONDS = 38.16;

const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const exitOpacity = interpolate(
    frame,
    [1.2 * fps, 1.8 * fps],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: opacity * exitOpacity,
      }}
    >
      <div
        style={{
          fontSize: 68,
          fontWeight: 900,
          fontFamily,
          color: "#FFFFFF",
          textAlign: "center",
          transform: `scale(${scale})`,
          maxWidth: 800,
          lineHeight: 1.15,
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        Still doing{"\n"}everything{"\n"}
        <span style={{ color: "#3ECECE" }}>MANUALLY?</span>
      </div>
    </AbsoluteFill>
  );
};

const CTAOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile("nexai-icon.png")}
          style={{ width: 80, height: 80, marginBottom: 8 }}
        />
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            fontFamily,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          Let&apos;s automate{"\n"}your business
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            fontFamily,
            color: "#000000",
            backgroundColor: "#3ECECE",
            padding: "14px 44px",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          DM &quot;AI&quot;
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontFamily,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          @nexailabs
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const IGReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Base Ken Burns zoom
  const baseZoom = interpolate(
    frame,
    [0, durationInFrames],
    [1.04, 1.1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    }
  );

  // Zoom punches — quick scale bumps at key moments
  const punchZoom = ZOOM_PUNCHES.reduce((acc, punch) => {
    const punchFrame = Math.round(punch.timeSec * fps);
    const punchDuration = Math.round(0.25 * fps);
    const progress = spring({
      frame: frame - punchFrame,
      fps,
      config: { damping: 12, stiffness: 300 },
      durationInFrames: punchDuration,
    });
    return acc + punch.intensity * progress * (1 - progress) * 4;
  }, 0);

  const zoomScale = baseZoom + punchZoom;

  const videoDurationFrames = Math.round(VIDEO_DURATION_SECONDS * fps);
  const ctaDuration = Math.round(3.5 * fps);
  const ctaStart = videoDurationFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. Video — full-frame with zoom punches */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoomScale})`,
          transformOrigin: "center center",
        }}
      >
        <Video
          src={staticFile("video.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* 2. Top gradient — for topic overlay readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 25%, transparent 40%)",
        }}
      />

      {/* 3. Bottom gradient — for caption readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* 4. NexAI logo — top right, subtle */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-end",
          padding: "40px 40px",
        }}
      >
        <Img
          src={staticFile("nexai-icon.png")}
          style={{ width: 80, height: 80, opacity: 0.7 }}
        />
      </AbsoluteFill>

      {/* 5. Topic overlays — upper portion */}
      <TopicOverlays />

      {/* 6. Hook text — first 2 seconds */}
      <Sequence
        from={0}
        durationInFrames={Math.round(2 * fps)}
        premountFor={Math.round(0.3 * fps)}
      >
        <HookText />
      </Sequence>

      {/* 7. Captions — bottom portion */}
      <Captions />

      {/* 8. CTA outro */}
      <Sequence
        from={ctaStart}
        durationInFrames={ctaDuration}
        premountFor={Math.round(0.3 * fps)}
      >
        <CTAOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
