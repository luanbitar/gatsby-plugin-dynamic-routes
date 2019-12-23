const path = require("path")

function getDynamicRoutes(routeFilePath = `src/Routes`) {
  const routesFile = require(path.resolve(routeFilePath))

  const routeKeys = Object.keys(routesFile)
  const staticRouteKeys = routeKeys.filter(route => {
    const childKeys = Object.keys(routesFile[route])
    return childKeys.includes("path")
  })
  const staticRoutes = staticRouteKeys.reduce(
    (acc, route) => ({
      ...acc,
      [route]: routesFile[route]
    }),
    {}
  )

  const { ROUTE_ENV, BUILD_ENV, NODE_ENV } = process.env
  const environment = ROUTE_ENV || BUILD_ENV || NODE_ENV || "development"

  const dynamicRoutes = routesFile[environment] || {}
  const routes = Object.assign({}, staticRoutes, dynamicRoutes)

  return {
    routes,
    environment
  }
}

exports.createPages = ({ actions, reporter }, { routeFilePath }) => {
  const { routes, environment } = getDynamicRoutes(routeFilePath)
  reporter.info(
    `Will use '${environment}' env and creating this route keys: ${Object.keys(
      routes
    )}`
  )

  const activity = reporter.activityTimer(`Dynamic routes created`)
  activity.start()

  const { createPage } = actions
  Object.keys(routes).map(routeKey => {
    const route = routes[routeKey]
    reporter.info(`Creating route: ${route.path}`)
    createPage({
      path: route.path,
      component: path.resolve(route.component)
    })
  })
  activity.end()
}

exports.onCreateWebpackConfig = ({ actions, plugins }, { routeFilePath }) => {
  const { routes } = getDynamicRoutes(routeFilePath)

  const ROUTES = Object.keys(routes).reduce((acc, routeKey) => {
    acc[routeKey] = routes[routeKey]
    return acc
  }, {})

  actions.setWebpackConfig({
    plugins: [plugins.define({ ROUTES: JSON.stringify(ROUTES) })]
  })
}

exports.onCreatePage = ({ page, actions, reporter }, { routeFilePath }) => {
  const { deletePage } = actions

  const { routes } = getDynamicRoutes(routeFilePath)

  const existingRouteOnPageFolder = Object.values(routes).some(
    ({ component }) => {
      const isSomeRouteThatWillBeRenamed =
        path.resolve(component) === page.component
      return isSomeRouteThatWillBeRenamed
    }
  )

  if (existingRouteOnPageFolder) {
    deletePage(page)
    reporter.info(`Preventing creation of route: ${page.path}`)
  }
}
