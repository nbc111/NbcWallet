import React, { useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tooltip from './Tooltip';
import CONFIG from '../../config';
import { Mixpanel } from '../../mixpanel/index';
import AlertTriangleIcon from '../svg/AlertTriangleIcon.js';

const Container = styled.div`
    color: white;
    background-color: #0072ce;
    position: fixed;
    padding: 10px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .tooltip {
        margin: 0 0 0 8px;
        svg {
            width: 18px;
            height: 18px;

            path {
                stroke: white;
            }
        }
    }

    .network-link {
        margin-left: 6px;
    }

    a {
        color: white;
        :hover {
            color: white;
            text-decoration: underline;
        }
    }

    &.staging-banner {
        background-color: #f6c98e;
        color: #452500;

        .tooltip {
            svg {
                path {
                    stroke: #452500;
                }
            }
        }

        .alert-triangle-icon {
            margin-right: 8px;
            min-width: 16px;
        }
    }
`;

const NetworkBanner = ({ account }) => {
    useEffect(() => {
        Mixpanel.register({
            network_id: CONFIG.IS_MAINNET
                ? 'mainnet'
                : CONFIG.NETWORK_ID === 'default'
                ? 'testnet'
                : CONFIG.NETWORK_ID,
        });
        setBannerHeight();
        window.addEventListener('resize', setBannerHeight);
        return () => {
            window.removeEventListener('resize', setBannerHeight);
        };
    }, [account]);

    const setBannerHeight = () => {
        const banner = document.getElementById('top-banner');
        const bannerHeight = banner
            ? banner.getBoundingClientRect().top + banner.offsetHeight
            : 0;
        const app = document.getElementById('app-container');
        const navContainer = document.getElementById('nav-container');
        navContainer.style.top = bannerHeight ? `${bannerHeight}px` : 0;
        app.style.paddingTop = bannerHeight ? `${bannerHeight + 85}px` : '75px';
    };

    if (!CONFIG.IS_MAINNET) {
        return (
            <Container id='top-banner'>
                <Translate id='networkBanner.title' />
                <span className='network-link'>
                    (
                    <a
                    //href={`${CONFIG.NODE_URL}/status`}
                        href='/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {
                            // CONFIG.NODE_URL.replace(
                            //     /^(?:https?:\/\/)?(?:www\.)?/i,
                            //     ''
                            // ).split('/')[0]
                            'https://www.nbwallet.cc'
                        }
                    </a>
                    )
                </span>
                <Tooltip translate='networkBanner.desc' modalOnly={true} />
            </Container>
        );
    } else if (CONFIG.SHOW_PRERELEASE_WARNING) {
        return (
            <Container id='top-banner' className='staging-banner'>
                <AlertTriangleIcon color='#A15600' />
                <Translate id='stagingBanner.title' />
                <Tooltip translate='stagingBanner.desc' modalOnly={true} />
            </Container>
        );
    } else {
        return null;
    }
};

export default NetworkBanner;
