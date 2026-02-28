import { css } from '@emotion/react';
import { graphql, Link, StaticQuery } from 'gatsby';
import { getSrc, type ImageDataLike } from 'gatsby-plugin-image';

import config from '../../website-config';

type SiteNavLogoProps = {
  logo?: any;
};

export function SiteNavLogo() {
  return (
    <StaticQuery
      query={graphql`query HeadingQuery {
  logo: file(relativePath: {eq: "logo.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FIXED, width: 200, quality: 50)
    }
  }
}
`}
      render={(data: SiteNavLogoProps) => (
        <Link className="site-nav-logo" css={SiteNavLogoStyles} to="/">
          {data.logo ? (
            <img src={getSrc(data.logo as ImageDataLike)} alt={config.title} />
          ) : (
            config.title
          )}
        </Link>
      )}
    />
  );
}

const SiteNavLogoStyles = css`
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  display: inline-block;
  margin-right: 32px;
  padding: 12px 0;
  color: #fff;
  font-size: 1.7rem;
  line-height: 1.8rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  text-transform: none;

  :hover {
    text-decoration: none;
  }

  img {
    display: block;
    width: auto;
    height: 21px;
  }
`;

