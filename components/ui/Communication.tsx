import React from "react";

interface CommunicationProps {
  messages: string[];
}

export default function Communication({ messages }: CommunicationProps) {
  return (
    <div>
      <ul className="grid gap-2">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
