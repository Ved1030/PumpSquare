export const jars = new Map();

export async function cookies() {
  return {
    get: (name) => {
      const entry = jars.get(name);
      if (!entry) return undefined;
      return { name, value: typeof entry === "string" ? entry : entry.value };
    },
    set: (name, value, options) => jars.set(name, { value, options }),
    delete: (name) => jars.delete(name),
  };
}

export async function headers() {
  return new Headers();
}
