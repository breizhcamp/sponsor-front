/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_KALON_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
