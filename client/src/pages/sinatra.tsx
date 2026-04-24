import { useLocation } from "react-router";
import useSinatra from "../hooks/useSinatra";
import { Gem } from "lucide-react";
import DOMPurify from "dompurify";
import { Container } from "semantic-ui-react";
import useTheme from "@/hooks/useTheme";

export default function SinatraPage() {
  const location = useLocation();
  const { data, error } = useSinatra(
    "http://localhost:4567" + location.pathname,
  );

  const { mode } = useTheme();

  function sanitize(html: string): string {
    return DOMPurify.sanitize(html) // Sanitize the HTML to prevent XSS attacks
      .replaceAll('action="', 'action="http://localhost:4567') // Ensure the action attribute points to the frontend server
      .replaceAll("dark-mode", mode === "dark" ? "inverted" : ""); // Inject inverted if dark mode enabled
  }

  return (
    <div>
      <div className="flex gap-2 bg-red-500 p-2 align-middle text-white">
        <Gem width={15} /> Ruby + Sinatra
      </div>
      {error && <div>Error: {(error as Error).message}</div>}
      {data && (
        <Container>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(data),
            }}
          />
        </Container>
      )}
    </div>
  );
}
