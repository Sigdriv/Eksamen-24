"use client";

import Client from "@/components/ui/Client";
import Communication from "@/components/ui/Communication";
import DHCPServer from "@/components/ui/DHCPServer";
import React, { useState, useTransition } from "react";

// Function to validate IP addresses
const validateIp = (ip: string) => {
  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(ip);
};

// Function to get the next IP address
const incrementIp = (ip: string) => {
  // Split the IP into its components
  const ipParts = ip.split(".").map(Number);

  // Start from the end of the IP parts
  for (let i = ipParts.length - 1; i >= 0; i--) {
    if (ipParts[i] < 255) {
      // If the part is less than 255, increment it and stop the loop
      ipParts[i]++;
      break;
    } else {
      // If the part is 255, reset it to 0 and continue to the next part
      ipParts[i] = 0;
    }
  }

  // Join the parts back together into a string
  return ipParts.join(".");
};

export default function DHCPProtocol() {
  const [scope, setScope] = useState<{ startIp: string; endIp: string } | null>(
    null
  );
  const [clients, setClients] = useState<{ id: number; ip: string }[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [assignedIps, setAssignedIps] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleSetScope = (startIp: string, endIp: string) => {
    if (validateIp(startIp) && validateIp(endIp) && startIp < endIp) {
      setScope({ startIp, endIp });
      setMessages([...messages, `DHCP Scope set from ${startIp} to ${endIp}`]);
    } else {
      alert("Invalid IP addresses or IP range");
    }
  };

  const createDHCPMessages = (clientId: number, newIp: string) => [
    `Client ${clientId} sent DHCP DISCOVER`,
    `Server sent DHCP OFFER to Client ${clientId}`,
    `Client ${clientId} sent DHCP REQUEST`,
    `Server sent DHCP ACK to Client ${clientId}`,
    `Client ${clientId} successfully assigned IP: ${newIp}`,
  ];

  const updateState = (
    message: string,
    index: number,
    dhcpMessages: string[],
    clientId: number,
    newIp: string
  ) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    if (index === dhcpMessages.length - 1) {
      setClients((prevClients) => [
        ...prevClients,
        { id: clientId, ip: newIp },
      ]);

      setAssignedIps((prevAssignedIps) => {
        const newAssignedIps = new Set(prevAssignedIps);
        newAssignedIps.add(newIp);
        return newAssignedIps;
      });
    }
  };

  const simulateDHCPProcess = async (clientId: number, newIp: string) => {
    const dhcpMessages = createDHCPMessages(clientId, newIp);

    for (let index = 0; index < dhcpMessages.length; index++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateState(dhcpMessages[index], index, dhcpMessages, clientId, newIp);
    }
  };

  const addClient = () => {
    startTransition(() => {
      if (!scope) {
        alert("Please set a valid DHCP scope first.");
        return;
      }

      let newIp = scope.startIp;
      while (assignedIps.has(newIp) && newIp <= scope.endIp) {
        newIp = incrementIp(newIp);
      }

      if (newIp > scope.endIp) {
        alert("No available IP addresses in the DHCP scope.");
        return;
      }

      const clientId = clients.length + 1;
      simulateDHCPProcess(clientId, newIp);
    });
  };

  const RemoveClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
    setAssignedIps((prevAssignedIps) => {
      const newAssignedIps = new Set(prevAssignedIps);
      newAssignedIps.delete(
        clients.find((client) => client.id === id)?.ip ?? ""
      );
      return newAssignedIps;
    });
  };

  return (
    <div className="grid ">
      <h1>DHCP Visualization</h1>
      <DHCPServer setScope={handleSetScope} />
      <div>
        <h2>Clients</h2>
        <button onClick={addClient} disabled={isPending}>
          Add Client
        </button>
        <div>
          {clients.map((client) => (
            <Client
              key={client.id}
              id={client.id}
              ip={client.ip}
              RemoveClient={RemoveClient}
            />
          ))}
        </div>
      </div>
      <div>
        <h1>DHCP Communication Steps</h1>
        <button onClick={() => setMessages([])}>Remove all messages</button>
        <Communication messages={messages} />
      </div>
    </div>
  );
}
