export function getRequiredElement<T extends HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

export function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((html, [key, value]) => html.split(`{{${key}}}`).join(String(value)), template);
}
