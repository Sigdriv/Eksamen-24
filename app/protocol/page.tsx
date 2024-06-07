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
      // Check if the next IP is going to be "192.168.0.1"
      if (ipParts[ipParts.length - 1] === 1) {
        // If it is, increment the next part of the IP address
        if (i > 0) {
          ipParts[i] = 0;
          ipParts[i - 1]++;
        }
      }

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
  const [pending, startTransition] = useTransition();

  const RemoveMessages = () => {
    setMessages([]);
  };

  const handleSetScope = (startIp: string, endIp: string) => {
    if (validateIp(startIp) && validateIp(endIp) && startIp < endIp) {
      setScope({ startIp, endIp });
      setMessages([...messages, `DHCP Scope set from ${startIp} to ${endIp}`]);
    } else {
      alert("Invalid IP addresses or IP range");
    }
  };

  // Function to simulate the DHCP process
  const simulateDHCPProcess = (clientId: number, newIp: string) => {
    const dhcpMessages = [
      `Client ${clientId} sent DHCP DISCOVER`,
      `Server sent DHCP OFFER to Client ${clientId}`,
      `Client ${clientId} sent DHCP REQUEST`,
      `Server sent DHCP ACK to Client ${clientId}`,
      `Client ${clientId} successfully assigned IP: ${newIp}`,
    ];

    dhcpMessages.forEach((message, index) => {
      setTimeout(() => {
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
      }, 1000 * (index + 1));
    });
  };

  const addClient = () => {
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
  };

  const RemoveClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
    setAssignedIps((prevAssignedIps) => {
      const newAssignedIps = new Set(prevAssignedIps);
      newAssignedIps.delete(clients.find((client) => client.id === id)?.ip);
      return newAssignedIps;
    });
  };

  return (
    <div className="grid ">
      <h1>DHCP Visualization</h1>
      <DHCPServer setScope={handleSetScope} />
      <div>
        <h2>Clients</h2>
        <button onClick={addClient}>Add Client</button>
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
        <button onClick={RemoveMessages}>Remove all messages</button>
        <Communication messages={messages} />
      </div>
    </div>
  );
}
