import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';

import styled from '@emotion/styled';
import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostFullContent } from '../components/PostContent';
import { Wrapper } from '../components/Wrapper';
import image from "../images/content/sarah-dorweiler-QeVmJxZOv3k-unsplash.jpg";
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import {
  inner,
  outer,
  SiteArchiveHeader,
  SiteHeader,
  SiteMain,
  SiteNavMain
} from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
    padding-bottom: 4vw;
    background: #fff;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      /* background: var(--darkmode); */
      background: ${colors.darkmode};
    }
  }
`;

const PostFullImage = styled.figure`
  margin: 25px 0 50px;
  height: 500px;
  background: ${colors.lightgrey} center center;
  background: url('${image}') center top;
  background-size: cover;
  border-radius: 5px;

  @media (max-width: 1170px) {
    margin: 25px -6vw 50px;
    border-radius: 0;
    img {
      max-width: 1170px;
    }
  }

  @media (max-width: 800px) {
    height: 200px;
  }
  @media (max-width: 500px) {
    margin-bottom: 4vw;
    height: 150px;
  }
`;

function About() {
  return (
    <IndexLayout>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Wrapper css={PageTemplate}>
        <header className="site-archive-header no-image" css={[SiteHeader, SiteArchiveHeader]}>
          <div css={[outer, SiteNavMain]}>
            <div css={inner}>
              <SiteNav isHome={false} />
            </div>
          </div>
        </header>
        <main id="site-main" className="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <article className="post page" css={[PostFull, NoImage]}>
              <PostFullHeader className="post-full-header">
                <PostFullTitle className="post-full-title">About</PostFullTitle>
              </PostFullHeader>

              <PostFullImage>
                {/* <img src={image} alt="hero image" /> */}
              </PostFullImage>

              <PostFullContent className="post-full-content">
                <div className="post-content">
                  <p>As a professional software engineer for more than 20 years, I have always been fascinated by the power of technology to solve problems.
                    From a very young age, I tinkered with computers and found joy in building things.
                    I approach new challenges with a creative and efficient mindset, constantly seeking innovative solutions to everyday problems.
                  </p>
                  <p>
                    During the day I make a lot of architecture and design decisions and manage a great team over <a href="https://covve.com">@Covve</a> but I also get my hands *dirty* writing
                    lots and lots of code. I feel at home when working inside a fully automated workflow, with lots of tests supporting
                    my refactoring frenzies and code reviews that make both me and my collegues better developers and better people.
                  </p>
                  <p>
                    I have done a lot of freelancing in the past, which gave me the opportunity to work with different
                    technologies, but also people. I have done 7+ years of daily C# development, mostly for Geographic Information
                    Systems, 3D visualization and Data Intensive applications. The last decade I am more into web technologies
                    development mostly for front end and mobile (Ionic, Capacitor, Swift, Kotlin, you name it), but also DevOps, Kubernetes and serverless,
                    including scalability, security, performance, maintainability and cost considerations. Lastly since even before the latest boom of AI
                    I have dabbled with machine learning and LLM training and trying to make the most of it in our projects.
                  </p>
                  <p>
                    My MBA background gives me a unique perspective on software products and how they align with business goals. I am able to approach software
                    development with a strategic mindset, focusing on how the end product will serve the needs of both the business and the users.
                    This allows me to be more involved with product development and business decisions but also to be more mindful about mentoring and
                    leading my team towards success and help them grow their skills and knowledge.
                  </p>
                  <p>
                    When I&apos;m not coding, I am an avid cook, 3d printing enthusiast, espresso snob, carpenter, traveler, and self-learner.
                    I also enjoy spending quality time with my two little boys, teaching them about the world around us.
                    I share my interests and thoughts on Twitter <a href="https://twitter.com/masimplo">@masimplo</a>,
                    through my blog at masimplo.com and by sharing pictures of my physical creations on Instagram <a href="https://www.instagram.com/masimplo/">@masimplo</a>
                  </p>
                </div>
              </PostFullContent>
            </article>
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
}

export default About;
