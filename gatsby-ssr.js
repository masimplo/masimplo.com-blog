/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react');

// Inline script that runs before React hydration to prevent dark mode flash.
// Reads localStorage 'theme' (values: 'dark' | 'light').
// Falls back to OS preference when no explicit preference is stored.
const darkModeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

exports.onRenderBody = ({ setHeadComponents, setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement('script', {
      key: 'dark-mode-init',
      dangerouslySetInnerHTML: { __html: darkModeScript },
    }),
  ]);
};
