import { useLocation } from "react-router";
import useSinatra from "../hooks/useSinatra";

export default function SinatraPage() {
  const location = useLocation();
  const {data, loading, error} = useSinatra('http://localhost:4567' + location.pathname);


  console.log(data)
  return (
    <div>
      <h1>Sinatra Page</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {(error as any).message}</div>}
      {data && <div dangerouslySetInnerHTML={{__html: data?.replace("action=\"", "action=\"http://localhost:4567") as string}} />}
    </div>
  );
}