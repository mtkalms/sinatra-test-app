import { useLocation } from "react-router";
import useSinatra from "../hooks/useSinatra";
import { Gem } from "lucide-react";
import DOMPurify from "dompurify";
import { Container } from "semantic-ui-react";

export default function SinatraPage() {
  const location = useLocation();
  const { data, loading, error } = useSinatra(
    "http://localhost:4567" + location.pathname,
  );

  function sanitize(html: string): string {
    return DOMPurify.sanitize(html) // Sanitize the HTML to prevent XSS attacks
      .replace('action="', 'action="http://localhost:4567'); // Ensure the action attribute points to the frontend server
  }

  return (
    <div>
      <div className="flex gap-2 bg-red-500 p-2 align-middle text-white">
        <Gem width={15} /> Ruby + Sinatra
      </div>
      {error && <div>Error: {(error as any).message}</div>}
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
