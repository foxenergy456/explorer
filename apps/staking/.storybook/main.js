// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
    features: {
        postcss: false,
    },
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        'storybook-addon-apollo-client',
        'storybook-addon-performance/register',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-next-router',
    ],
    webpackFinal: async (config) => {
        config.module.rules = config.module.rules.map((r) =>
            r.test.toString().includes('jsx')
                ? {
                      ...r,
                      exclude: (filename) => {
                          return (
                              /node_modules/.test(filename) &&
                              !/@chakra-ui/.test(filename) &&
                              !/@zag-js/.test(filename)
                          );
                      },
                  }
                : r
        );

        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                    '@ledgerhq/devices/hid-framing': toPath(
                        'node_modules/@ledgerhq/devices/lib/hid-framing'
                    ),
                    '@toruslabs/torus-embed': toPath(
                        'node_modules/@toruslabs/torus-embed/dist/torus.umd.min.js'
                    ),
                },
            },
        };
    },
};