import { Atom } from "lucide-react";
import { Outlet } from "react-router";

export default function ReactContent() {
  return (
    <>
        <div className="bg-cyan-500 text-white p-2 gap-2 flex align-middle"><Atom width={15}/> React</div>
        <Outlet/>
    </>
  );
}