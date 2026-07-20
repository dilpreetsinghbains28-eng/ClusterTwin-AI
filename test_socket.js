import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to socket server with id:", socket.id);
});

socket.on("telemetry:factory_summary", (data) => {
  console.log("Received telemetry:factory_summary!");
  console.log(JSON.stringify(data, null, 2));
});

setTimeout(() => {
  console.log("Timeout waiting for event");
  process.exit(1);
}, 20000);
