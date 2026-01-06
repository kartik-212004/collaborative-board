import HeroVideoDialog from "@/modules/hero-video-dialog";

const draw = "/demo.jpeg";
const video = "/video.mp4";

export function Demo() {
  return (
    <div id="demo" className="relative">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc={video}
        thumbnailSrc={draw}
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
