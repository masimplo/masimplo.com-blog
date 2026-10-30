import config from '../website-config';

type MailchimpResponse = {
  result: string;
  msg: string;
};

type MailchimpCallback = (data: MailchimpResponse) => void;

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
};

const gaId = 'G-SKNLCK1W2K';

function setMailchimpCallback(name: string, callback: MailchimpCallback | undefined) {
  // JSONP callbacks must live on window; assign/clear without dynamic delete.
  (window as unknown as Record<string, MailchimpCallback | undefined>)[name] = callback;
}

function getGaClientId(): string {
  const match = /(?:^|;\s*)_ga=GA\d+\.\d+\.(\d+\.\d+)/.exec(document.cookie);
  if (match?.[1]) {
    return match[1];
  }

  const id = `${Math.floor(Math.random() * 1e9)}.${Math.floor(Date.now() / 1000)}`;
  document.cookie = `_ga=GA1.1.${id};path=/;max-age=63072000;SameSite=Lax`;
  return id;
}

function sendGa4Collect(eventName: string, params: Record<string, string>) {
  // Direct collect hit — works even when googletagmanager.com (gtag.js) is blocked.
  const url = new URL('https://www.google-analytics.com/g/collect');
  url.searchParams.set('v', '2');
  url.searchParams.set('tid', gaId);
  url.searchParams.set('cid', getGaClientId());
  url.searchParams.set('en', eventName);
  url.searchParams.set('dl', window.location.href);
  url.searchParams.set('_s', '1');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`ep.${key}`, value);
  }

  // GET pixel is the most reliable when the gtag.js library never loads.
  const img = new Image();
  img.src = url.toString();
}

function trackNewsletterSubscribe() {
  const params = {
    method: 'mailchimp',
    page_path: window.location.pathname,
  };

  sendGa4Collect('newsletter_subscribe', params);
  sendGa4Collect('sign_up', { method: 'mailchimp' });

  // Still queue via gtag when the library is available.
  const { gtag } = window as WindowWithGtag;
  gtag?.('event', 'newsletter_subscribe', { ...params, send_to: gaId });
  gtag?.('event', 'sign_up', { method: 'mailchimp', send_to: gaId });
}

function showMessage(element: HTMLElement, kind: 'success' | 'error', html: string) {
  element.className = `subscribe-message ${kind}`;
  // Mailchimp messages contain links (e.g. "already subscribed, update your profile").
  element.innerHTML = html;
  element.hidden = false;
}

function subscribe(form: HTMLFormElement) {
  const input = form.querySelector<HTMLInputElement>('.subscribe-email')!;
  const button = form.querySelector<HTMLButtonElement>('.subscribe-form-button')!;
  const label = button.querySelector('span')!;
  const message = form.querySelector<HTMLElement>('.subscribe-message')!;

  if (!config.mailchimpAction) {
    return;
  }

  button.disabled = true;
  label.textContent = 'Subscribing...';
  message.hidden = true;

  const done = () => {
    button.disabled = false;
    label.textContent = 'Subscribe';
  };

  const url = config.mailchimpAction.replace('/post?', '/post-json?');
  const callbackName = `mailchimpCallback_${Math.round(Math.random() * 10_000)}`;
  const script = document.createElement('script');
  script.src = `${url}&EMAIL=${encodeURIComponent(input.value)}&c=${callbackName}`;

  setMailchimpCallback(callbackName, data => {
    setMailchimpCallback(callbackName, undefined);
    script.remove();
    done();

    if (data.result === 'success') {
      showMessage(message, 'success', data.msg);
      trackNewsletterSubscribe();
    } else {
      showMessage(message, 'error', data.msg.replace(/^\d+ - /, ''));
    }
  });

  script.addEventListener('error', () => {
    setMailchimpCallback(callbackName, undefined);
    script.remove();
    done();
    showMessage(message, 'error', 'Subscription failed. Please try again.');
  });

  document.body.append(script);
}

export function initSubscribeForms() {
  for (const form of document.querySelectorAll<HTMLFormElement>('[data-subscribe-form]')) {
    if (form.dataset.ready) {
      continue;
    }

    form.dataset.ready = 'true';
    form.addEventListener('submit', event => {
      event.preventDefault();
      subscribe(form);
    });
  }
}
