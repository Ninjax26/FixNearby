import assert from "assert";
import express from "express";
import availabilityRoutes from "../routes/availabilityRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/availability", availabilityRoutes);

const routeStack = app._router.stack
  .flatMap((layer) => layer.handle?.stack || [])
  .filter((layer) => layer.route)
  .map((layer) => ({
    path: layer.route.path,
    methods: Object.keys(layer.route.methods),
  }));

assert(
  routeStack.some((route) => route.path === "/status" && route.methods.includes("put")),
  "Expected PUT /api/availability/status route to be registered"
);

assert(
  routeStack.some((route) => route.path === "/status/:workerId" && route.methods.includes("get")),
  "Expected GET /api/availability/status/:workerId route to be registered"
);

console.log("Availability status routes are registered.");
