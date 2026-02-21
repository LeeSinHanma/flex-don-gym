// capacitor.config.ts
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.flexdon.gym",
  appName: "Flex Don Gym",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    url: "http://localhost:8001",
    cleartext: true
  }
};

export default config;
