import { Atom } from "lucide-react";
import { Outlet } from "react-router";
import { Container } from "semantic-ui-react";

export default function ReactContent() {
  return (
    <>
      <div className="flex gap-2 bg-cyan-500 p-2 align-middle text-white">
        <Atom width={15} /> React
      </div>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
