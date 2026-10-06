import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const publicBase=process.env.VITE_PUBLIC_BASE?.trim()||"/";

export default defineConfig({ base:publicBase,plugins:[react()],build:{chunkSizeWarningLimit:2300} });
