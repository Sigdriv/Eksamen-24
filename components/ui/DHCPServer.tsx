import { useState } from "react";

interface DHCPServerProps {
  setScope: (startIp: string, endIp: string) => void;
}

export default function DHCPServer({ setScope }: DHCPServerProps) {
  const [startIp, setStartIp] = useState("");
  const [endIp, setEndIp] = useState("");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setScope(startIp, endIp);
  };

  return (
    <div>
      <h2>DHCP Server Configuration</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Start IP:{" "}
            <input
              type="text"
              value={startIp}
              onChange={(e) => setStartIp(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            End IP:{" "}
            <input
              type="text"
              value={endIp}
              onChange={(e) => setEndIp(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Set Scope</button>
      </form>
    </div>
  );
}
