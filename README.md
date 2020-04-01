[![Version](https://img.shields.io/npm/v/gatsby-plugin-dynamic-routes.svg)](https://www.npmjs.com/package/gatsby-plugin-dynamic-routes)
[![Downloads Total](https://img.shields.io/npm/dt/gatsby-plugin-dynamic-routes.svg)](https://www.npmjs.com/package/gatsby-plugin-dynamic-routes)

# gatsby-plugin-dynamic-routes

Use one file to declare your routes, provides to chose dynamic route paths based on your `BUILD_ENV` or `ROUTE_ENV` to your custom routing env. Also it's possible to only renaming routes on `pages/`, or use everything together.

## Install

`$ npm i gatsby-plugin-dynamic-routes`

or

`$ yarn add gatsby-plugin-dynamic-routes`

## How to use

Add the plugin to your `gatsby-config.js`.

```javascript
module.exports = {
  plugins: [
    `gatsby-plugin-dynamic-routes`
  ]
}
```

Create your's `Routes.js` inside your `src/` folder

```bash
project/
├── src/
  └── Routes.js
```

`Routes.js`

```javascript
module.exports = {
  home: {
    path: `/casa`,
    component: `src/pages/Home.js`
  }
}
```

Use in client-side, include globals comment

`component/Example.js`

```javascript
import { Link } from "gatsby"

function Example() {
  return <Link href="/casa" />
}
```

## Dynamic routes

`Routes.js`

```javascript
module.exports = {
  development: {
    two: {
      path: `/2`,
      component: `src/pages/Two.js`
    }
  },
  staging: {
    two: {
      path: `/dois`,
      component: `src/pages/Two.js`
    }
  },
  home: {
    path: `/casa`,
    component: `src/pages/Home.js`
  }
}
```

Run with your `BUILD_ENV` environment

```bash
BUILD_ENV=staging yarn start
```

If you are using the plugin [Dynamic Environment Variables][1], what will happen is that your environments inside your `.env` and `.env.staging` will be loaded, and your routes inside `staging` key will go to root of the object that is exported of `Routes` and will be available in yours global environment variables.

`component/Example.js`

```javascript
import { Link } from "gatsby"
/* globals ROUTES */

function Example() {
  return <Link href={ROUTES.two.path} />
}
```

You can pass more than `path` or `component` keys, these keys will be available in your component later

## Variations

If you want to made variations of the same environment, but whit different routes, you can use `ROUTE_ENV` variable to chose your dynamic routes

`example`

```bash
ROUTE_ENV=organic BUILD_ENV=production yarn build
```

## Options

### `routeFilePath`

This options allows you to specify what's the path to your file with your Routes object

Example:

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-dynamic-routes`,
      options: {
        routeFilePath: `config/Routes.js`
      }
    }
  ]
}
```

```bash
project/
├── config/
  └── Routes.js
```

If you want to put in root of your project, simply put the name of your file

## Ignoring gatsby default page creator

By default, gatsby generates one route to each file inside `pages/` folder, to disable this feature, put in you `gatsby-config.js`:

```js
{
  resolve: `gatsby-plugin-page-creator`,
  options: {
    path: `${__dirname}/src/pages`,
    ignore: {
      patterns: [`**/*`],
    },
  },
},
```

## Recommended plugins

Check out the [Dynamic Environment Variables][1] plugin that provides you to load different files based on your env variables

[1]: https://github.com/luanbitar/gatsby-env-variables
