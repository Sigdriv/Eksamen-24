interface ClientProps {
  id: number;
  ip: string;
  RemoveClient: (id: number) => void;
}

export default function Client({ id, ip, RemoveClient }: ClientProps) {
  return (
    <div className="flex gap-4">
      <h3>Client {id}</h3>
      <p>IP: {ip}</p>
      <button
        className="flex items-center justify-center w-2 h-3 bg-red-500 rounded-full"
        onClick={() => RemoveClient(id)}
      >
        x
      </button>
    </div>
  );
}
