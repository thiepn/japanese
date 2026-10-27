import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

const publicBase=process.env.VITE_PUBLIC_BASE?.trim()||"/";

export default defineConfig({ base:publicBase,plugins:[react(),tailwind()],build:{chunkSizeWarningLimit:2300} });
