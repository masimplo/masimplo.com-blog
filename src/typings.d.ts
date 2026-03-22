// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@emotion/react/types/css-prop" />

type CSSModule = Record<string, string>;

// type shims for CSS modules

declare module '*.module.scss' {
  const cssModule: CSSModule;
  export = cssModule;
}

declare module '*.module.css' {
  const cssModule: CSSModule;
  export = cssModule;
}

declare module '*.ico' {
  const ico: any;
  export = ico;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module 'rehype-react' {
  import { type Processor } from 'unified';
  type RehypeOptions = {
    Fragment?: any;
    jsx?: any;
    jsxs?: any;
    createElement?: any;
    components?: Record<string, any>;
    elementAttributeNameCase?: 'html' | 'react';
    stylePropertyNameCase?: 'css' | 'dom';
  };
  class RehypeReact {
    compiler: (...args: any[]) => any;
    constructor(options: RehypeOptions);
    freeze(): Processor;
  }
  export default RehypeReact;
}
