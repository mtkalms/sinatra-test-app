import { useLocation } from "react-router";
import useSinatra from "../hooks/useSinatra";
import { Gem } from "lucide-react";

export default function SinatraPage() {
  const location = useLocation();
  const {data, loading, error} = useSinatra('http://localhost:4567' + location.pathname);


  console.log(data)
  return (
    <div>
      <div className="bg-red-500 text-white p-2 flex align-middle gap-2"><Gem width={15}/> Ruby + Sinatra</div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {(error as any).message}</div>}
      {data && <div dangerouslySetInnerHTML={{__html: data?.replace("action=\"", "action=\"http://localhost:4567") as string}} />}
    </div>
  );
}