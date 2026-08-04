import { load } from "@tauri-apps/plugin-store";
import type { DeepPartial } from "react-hook-form";
import type z from "zod";
import log from "~/lib/logging";

function isObject(item: unknown): item is AnyConfig {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  if (!isObject(target) || !isObject(source)) return source as unknown as T;

  const output: AnyConfig = { ...target };
  for (const k of Object.keys(source)) {
    const sourceValue = (source as AnyConfig)[k];
    const targetValue = (target as AnyConfig)[k];

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[k] = deepMerge(targetValue, sourceValue);
    } else {
      output[k] = sourceValue;
    }
  }
  return output as unknown as T;
}

type AnyConfig = Record<string, unknown>;
type AppStoreConstructorOptions<T extends object = AnyConfig> = {
  name: string;
  version: number;
  default: T;
  migrations: Record<number, (old: T) => T>;
  schema: z.ZodType<T>;
};
export abstract class AppStore<T extends object = AnyConfig> {
  private readonly name: string;
  private readonly key: string;
  private readonly version: number;
  public readonly default: T;
  private readonly migrations: Record<number, (old: T) => T>;
  private readonly schema: z.ZodType<T>;

  constructor(opts: AppStoreConstructorOptions<T>) {
    const { name, version, default: defaultValue, migrations, schema } = opts;
    this.name = `${name}.json`;
    this.key = name;
    this.version = version;
    this.default = defaultValue;
    this.migrations = migrations;
    this.schema = schema;
  }

  private validateConfig(config: T): T | null {
    const res = this.schema.safeParse(config);
    if (!res.success) {
      log.error(
        `Validation failed for key ${this.key}:\n`,
        res.error.issues
          .map((i) => `\t- [${i.code}] ${i.path.join(".")} ${i.message}`)
          .join("\n"),
      );
      return null;
    }

    return res.data;
  }
  private async loadConfig() {
    return await load(this.name, {
      autoSave: false,
      defaults: {},
    });
  }
  private async writeConfig(config: DeepPartial<T>): Promise<void> {
    const store = await this.loadConfig();
    const prev = (await store.get<T>(this.key)) ?? this.default;
    const payload = deepMerge(prev, config);

    const validated = this.validateConfig(payload);
    if (!validated) return;

    await store.set(this.key, validated);
    await store.save();
  }

  public async clear(): Promise<void> {
    const store = await this.loadConfig();
    await store.delete(this.key);
    await store.save();
  }

  public async get(): Promise<T | null> {
    const store = await this.loadConfig();
    const raw = await store.get<T>(this.key);

    return raw ? this.migrate(raw) : null;
  }
  public async set(config: DeepPartial<T> | ((prev: T) => DeepPartial<T>)) {
    if (typeof config === "function") {
      const prev = await this.get();
      if (!prev) return;
      await this.writeConfig(config(prev));
    } else {
      await this.writeConfig(config);
    }
  }
  public migrate(raw: T): T {
    let config: T = { ...raw };
    const startVersion = "version" in config ? (config.version as number) : 0;

    for (let v = startVersion + 1; v <= this.version; v++) {
      if (this.migrations[v]) {
        config = this.migrations[v](config);
      }
    }

    const validated = this.validateConfig(config);
    if (!validated) {
      this.writeConfig(this.default as DeepPartial<T>).catch(log.error);
      return this.default;
    }

    return {
      ...this.default,
      ...validated,
      version: this.version,
    };
  }
}
