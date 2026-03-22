import { Link } from 'gatsby';
import { darken } from 'polished';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { colors } from '../../styles/colors';
import { SocialLink, SocialLinkFb } from '../../styles/shared';
import config from '../../website-config';
import { Facebook } from '../icons/facebook';
import { Twitter } from '../icons/twitter';
import { SubscribeModal } from '../subscribe/SubscribeModal';
import { SiteNavLogo } from './SiteNavLogo';

type SiteNavProps = {
  readonly isHome?: boolean;
  readonly isPost?: boolean;
  readonly post?: any;
};

function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const stored = localStorage.getItem('theme');

      if (stored) {
        return stored === 'dark';
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;

      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', next);
      } catch {
        // ignore
      }

      return next;
    });
  }, []);

  return [isDark, toggle];
}

function SiteNav({ isHome = false, isPost = false, post = {} }: SiteNavProps) {
  const subscribeRef = useRef<SubscribeModal>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const [showTitle, setShowTitle] = useState(false);
  const [isDark, toggleDark] = useDarkMode();

  const openModal = () => {
    if (subscribeRef.current) {
      subscribeRef.current.open();
    }
  };

  const update = useCallback(() => {
    if (!titleRef.current) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const trigger = titleRef.current.getBoundingClientRect().top;
    const triggerOffset = titleRef.current.offsetHeight + 35;

    setShowTitle(lastScrollY.current >= trigger + triggerOffset);
    ticking.current = false;
  }, []);

  const onScroll = useCallback(() => {
    if (!titleRef.current) {
      return;
    }

    if (!ticking.current) {
      requestAnimationFrame(update);
    }

    ticking.current = true;
  }, [update]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    if (isPost) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isPost, onScroll]);

  return (
    <>
      {config.showSubscribe && <SubscribeModal ref={subscribeRef} />}
      <nav css={SiteNavStyles}>
        <SiteNavLeft className="site-nav-left">
          {!isHome && <SiteNavLogo />}
          <SiteNavContent css={[showTitle ? HideNav : '']}>
            <ul css={NavStyles} role="menu">
              <li role="menuitem">
                <Link to="/" activeClassName="nav-current">
                  Home
                </Link>
              </li>
              <li role="menuitem">
                <Link to="/about" activeClassName="nav-current">
                  About
                </Link>
              </li>
            </ul>
            {isPost && (
              <NavPostTitle ref={titleRef} className="nav-post-title">
                {post.title}
              </NavPostTitle>
            )}
          </SiteNavContent>
        </SiteNavLeft>
        <SiteNavRight>
          <SocialLinks>
            {config.facebook && (
              <a
                className="social-link-fb"
                css={[SocialLink, SocialLinkFb]}
                href={config.facebook}
                target="_blank"
                title="Facebook"
                rel="noopener noreferrer"
              >
                <Facebook />
              </a>
            )}
            {config.twitter && (
              <a
                css={SocialLink}
                href={config.twitter}
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </a>
            )}
          </SocialLinks>
          <DarkModeToggle
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDark}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            )}
          </DarkModeToggle>
          {config.showSubscribe && (
            <SubscribeButton onClick={openModal}>Subscribe</SubscribeButton>
          )}
        </SiteNavRight>
      </nav>
    </>
  );
}

export const SiteNavMain = css`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  /* background: color(var(--darkgrey) l(-5%)) */
  background: ${darken('0.05', colors.darkgrey)};

  @media (max-width: 700px) {
    padding-right: 0;
    padding-left: 0;
  }
`;

const SiteNavStyles = css`
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow-y: hidden;
  height: 64px;
  font-size: 1.3rem;
`;

const SiteNavLeft = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  margin-right: 10px;
  padding: 10px 0 80px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  white-space: nowrap;

  -ms-overflow-scrolling: touch;

  @media (max-width: 700px) {
    margin-right: 0;
    padding-left: 5vw;
  }
`;

const SiteNavContent = styled.div`
  position: relative;
  align-self: flex-start;
`;

const NavStyles = css`
  position: absolute;
  z-index: 1000;
  display: flex;
  margin: 0 0 0 -12px;
  padding: 0;
  list-style: none;
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);

  li {
    display: block;
    margin: 0;
    padding: 0;
  }

  li a {
    position: relative;
    display: block;
    padding: 12px 12px;
    color: #fff;
    opacity: 0.8;
    transition: opacity 0.35s ease-in-out;
  }

  li a:hover {
    text-decoration: none;
    opacity: 1;
  }

  li a:before {
    content: '';
    position: absolute;
    right: 100%;
    bottom: 8px;
    left: 12px;
    height: 1px;
    background: #fff;
    opacity: 0.25;
    transition: all 0.35s ease-in-out;
  }

  li a:hover:before {
    right: 12px;
    opacity: 0.5;
  }

  .nav-current {
    opacity: 1;
  }
`;

const SiteNavRight = styled.div`
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 0;
  height: 64px;

  @media (max-width: 700px) {
    display: none;
  }
`;

const SocialLinks = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const DarkModeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  margin: 0 0 0 6px;
  background: transparent;
  border: none;
  color: #fff;
  opacity: 0.8;
  cursor: pointer;

  :hover {
    opacity: 1;
  }

  svg {
    display: block;
  }
`;

const SubscribeButton = styled.a`
  display: block;
  padding: 4px 10px;
  margin: 0 0 0 10px;
  border: #fff 1px solid;
  color: #fff;
  line-height: 1em;
  border-radius: 10px;
  opacity: 0.8;

  :hover {
    text-decoration: none;
    opacity: 1;
    cursor: pointer;
  }
`;

const NavPostTitle = styled.span`
  visibility: hidden;
  position: absolute;
  top: 9px;
  color: #fff;
  font-size: 1.7rem;
  font-weight: 400;
  text-transform: none;
  opacity: 0;
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateY(175%);

  .dash {
    left: -25px;
  }

  .dash:before {
    content: '– ';
    opacity: 0.5;
  }
`;

const HideNav = css`
  ul {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-175%);
  }
  .nav-post-title {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

export default SiteNav;
