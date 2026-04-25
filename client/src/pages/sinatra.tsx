import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Gem } from "lucide-react";
import { Container } from "semantic-ui-react";
import useTheme from "@/hooks/useTheme";

export default function SinatraPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [src, setSrc] = useState(`${location.pathname}?theme=${mode}`);
  // When navigate() is called from handleLoad, we must not update src in
  // response to that location change — the iframe is already there.
  const syncingFromIframe = useRef(false);

  useEffect(() => {
    if (syncingFromIframe.current) {
      syncingFromIframe.current = false;
      return;
    }
    setSrc(`${location.pathname}?theme=${mode}`);
  }, [location.pathname, mode]);

  const handleLoad = () => {
    const iframePath = iframeRef.current?.contentWindow?.location.pathname;
    if (iframePath && iframePath !== location.pathname) {
      syncingFromIframe.current = true;
      navigate(iframePath, { replace: true });
    }
  };

  return (
    <div>
      <div className="flex gap-2 bg-red-500 p-2 align-middle text-white">
        <Gem width={15} /> Ruby + Sinatra
      </div>
      <Container>
        <iframe
          ref={iframeRef}
          src={src}
          onLoad={handleLoad}
          style={{ width: "100%", border: "none", minHeight: "500px" }}
        />
      </Container>
    </div>
  );
}
