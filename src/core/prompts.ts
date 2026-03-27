import * as p from "@clack/prompts";

export const intro = p.intro;
export const outro = p.outro;
export const note = p.note;
export const spinner = p.spinner();

export async function textPrompt(message: string, placeholder?: string, defaultValue?: string) {
  const result = await p.text({
    message,
    placeholder,
    initialValue: defaultValue,
    validate(value) {
      if (!value || value.length === 0) return `Value is required!`;
    },
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return result;
}

export async function selectPrompt<T>(message: string, options: { value: T; label: string; hint?: string }[]) {
  const result = await p.select({
    message,
    options: (options as p.Option<T>[]),
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return result as T;
}

export async function confirmPrompt(message: string, initialValue: boolean = true) {
  const result = await p.confirm({
    message,
    initialValue,
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return result;
}

export async function multiselectPrompt<T>(message: string, options: { value: T; label: string; hint?: string }[]) {
  const result = await p.multiselect({
    message,
    options: (options as p.Option<T>[]),
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return result as T[];
}
