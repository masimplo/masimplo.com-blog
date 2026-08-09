import { lighten, saturate } from 'polished';
import React, { useState } from 'react';
import styled from '@emotion/styled';

import { css } from '@emotion/react';

import { colors } from '../../styles/colors';
import config from '../../website-config';

type MailchimpResponse = {
  result: string;
  msg: string;
};

type MailchimpCallback = (data: MailchimpResponse) => void;

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
};

function setMailchimpCallback(name: string, callback: MailchimpCallback | undefined) {
  // JSONP callbacks must live on window; assign/clear without dynamic delete.
  (window as WindowWithGtag & Record<string, MailchimpCallback | undefined>)[name] = callback;
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
  url.searchParams.set('tid', 'G-SKNLCK1W2K');
  url.searchParams.set('cid', getGaClientId());
  url.searchParams.set('en', eventName);
  url.searchParams.set('dl', window.location.href);
  url.searchParams.set('_s', '1');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`ep.${key}`, value);
  }

  const href = url.toString();
  // GET pixel is the most reliable when the gtag.js library never loads.
  const img = new Image();
  img.src = href;
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
  gtag?.('event', 'newsletter_subscribe', { ...params, send_to: 'G-SKNLCK1W2K' });
  gtag?.('event', 'sign_up', { method: 'mailchimp', send_to: 'G-SKNLCK1W2K' });
}

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.mailchimpAction) {
      return;
    }

    setStatus('sending');
    setMessage(undefined);

    const url = config.mailchimpAction.replace('/post?', '/post-json?');
    const callbackName = `mailchimpCallback_${Math.round(Math.random() * 10000)}`;

    const script = document.createElement('script');
    script.src = `${url}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;

    setMailchimpCallback(callbackName, (data: MailchimpResponse) => {
      setMailchimpCallback(callbackName, undefined);
      if (script.parentNode) {
        document.body.removeChild(script);
      }

      if (data.result === 'success') {
        setStatus('success');
        setMessage(data.msg);
        trackNewsletterSubscribe();
      } else {
        setStatus('error');
        const cleanMessage = data.msg.replace(/^[0-9]+ - /, '');
        setMessage(cleanMessage);
      }
    });

    script.onerror = () => {
      setMailchimpCallback(callbackName, undefined);
      if (script.parentNode) {
        document.body.removeChild(script);
      }

      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    };

    document.body.appendChild(script);
  };

  return (
    <form noValidate css={SubscribeFormStyles} className="subscribe-form" onSubmit={onSubmit}>
      {/* This is required for the form to work correctly  */}
      <FormGroup className="form-group">
        <SubscribeEmail
          className="subscribe-email"
          type="email"
          name={config.mailchimpEmailFieldName}
          id={config.mailchimpEmailFieldName}
          placeholder="youremail@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name={config.mailchimpName} tabIndex={-1} />
      </div>
      <SubscribeFormButton type="submit" disabled={status === 'sending'}>
        <span>{status === 'sending' ? 'Subscribing...' : 'Subscribe'}</span>
      </SubscribeFormButton>
      {status === 'success' && message && (
        <SuccessMessage dangerouslySetInnerHTML={{ __html: message }} />
      )}
      {status === 'error' && message && (
        <ErrorMessage dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </form>
  );
}

const SubscribeFormStyles = css`
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 460px;

  @media (max-width: 500px) {
    flex-direction: column;

    .form-group {
      flex-direction: column;
      width: 100%;
    }
  }
`;

const SubscribeEmail = styled.input`
  display: block;
  padding: 10px;
  width: 100%;
  /* border: color(var(--lightgrey) l(+7%)) 1px solid; */
  border: ${lighten('0.07', colors.lightgrey)} 1px solid;
  /* color: var(--midgrey); */
  color: ${colors.midgrey};
  font-size: 1.8rem;
  line-height: 1em;
  font-weight: normal;
  user-select: text;
  border-radius: 5px;
  transition: border-color 0.15s linear;

  -webkit-appearance: none;

  :focus {
    outline: 0;
    /* border-color: color(var(--lightgrey) l(-2%)); */
    border-color: ${lighten('-0.02', colors.lightgrey)};
  }

  @media (prefers-color-scheme: dark) {
    /* border-color: color(var(--darkmode) l(+6%)); */
    border-color: ${lighten('0.06', colors.darkmode)};
    color: rgba(255, 255, 255, 0.9);
    /* background: color(var(--darkmode) l(+3%)); */
    background: ${lighten('0.03', colors.darkmode)};

    :focus {
      /* border-color: color(var(--darkmode) l(+25%)); */
      border-color: ${lighten('0.25', colors.darkmode)};
    }
  }

  html.dark & {
    border-color: ${lighten('0.06', colors.darkmode)};
    color: rgba(255, 255, 255, 0.9);
    background: ${lighten('0.03', colors.darkmode)};

    :focus {
      border-color: ${lighten('0.25', colors.darkmode)};
    }
  }
`;

const SubscribeFormButton = styled.button`
  position: relative;
  display: inline-block;
  margin: 0 0 0 10px;
  padding: 0 20px;
  height: 43px;
  outline: none;
  color: #fff;
  font-size: 1.5rem;
  line-height: 39px;
  font-weight: 400;
  text-align: center;
  /* background: linear-gradient(
    color(var(--blue) whiteness(+7%)),
    color(var(--blue) lightness(-7%) saturation(-10%)) 60%,
    color(var(--blue) lightness(-7%) saturation(-10%)) 90%,
    color(var(--blue) lightness(-4%) saturation(-10%))
  ); */
  /* background: linear-gradient(
    ${lighten('0.07', colors.blue)},
    ${saturate('-0.1', lighten('-0.07', colors.blue))} 60%,
    ${saturate('-0.1', lighten('-0.07', colors.blue))} 90%,
    ${saturate('-0.1', lighten('-0.04', colors.blue))}
  ); */
  background: linear-gradient(#4fb7f0, #29a0e0 60%, #29a0e0 90%, #36a6e2);
  border-radius: 5px;

  -webkit-font-smoothing: subpixel-antialiased;

  :active,
  :focus {
    /* background: color(var(--blue) lightness(-9%) saturation(-10%)); */
    background: ${saturate('-0.1', lighten('-0.09', colors.blue))};
  }
  @media (max-width: 500px) {
    margin: 10px 0 0 0;
    width: 100%;
  }

  @media (prefers-color-scheme: dark) {
    opacity: 0.9;
  }

  html.dark & {
    opacity: 0.9;
  }
`;

const FormGroup = styled.div`
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const SuccessMessage = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 15px;
  color: ${colors.green};
  font-size: 1.5rem;
`;

const ErrorMessage = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 15px;
  color: ${colors.red};
  font-size: 1.5rem;

  a {
    color: ${colors.red};
    text-decoration: underline;
  }
`;
