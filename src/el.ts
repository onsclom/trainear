interface EventHandler<T, E extends Event> {
  (
    e: E & {
      currentTarget: T;
      target: HTMLElement;
    },
  ): void;
}

export default function el<K extends keyof HTMLElementTagNameMap>(
  type: K,
  // pretty crazy typing huh? but it works!
  props: Partial<
    Omit<HTMLElementTagNameMap[K], "style" | "oninput"> & {
      style: Partial<CSSStyleDeclaration>;
      oninput?: EventHandler<HTMLElementTagNameMap[K], KeyboardEvent>;
      onMount?: (el: HTMLElementTagNameMap[K]) => void;
    }
  > = {},
  ...children: (HTMLElement | string)[]
) {
  const el = document.createElement(type);
  Object.assign(el, props);
  if (props.style) {
    for (const [key, value] of Object.entries(props.style)) {
      el.style[key as any] = value;
    }
  }
  children.forEach((child) => {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });
  if (props.onMount) {
    props.onMount(el);
  }
  return el;
}
