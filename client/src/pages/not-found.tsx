import { Container } from "semantic-ui-react";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <Container>
      <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
      <p>
        The page you're looking for doesn't exist.{" "}
        <Link to="/">Go home</Link>
      </p>
    </Container>
  );
}
