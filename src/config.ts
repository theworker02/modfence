export interface Layer {
  name: string;
  glob: string;
}

export interface FenceConfig {
  root: string;
  layers: Layer[];
  allow: Array<{ from: string; to: string[] }>;
  forbidCycles: boolean;
}

export const defaultConfig = (): FenceConfig => ({
  root: ".",
  forbidCycles: true,
  layers: [
    { name: "ui", glob: "src/ui/**" },
    { name: "domain", glob: "src/domain/**" },
    { name: "infra", glob: "src/infra/**" },
  ],
  allow: [
    { from: "ui", to: ["domain"] },
    { from: "domain", to: [] },
    { from: "infra", to: ["domain"] },
  ],
});
