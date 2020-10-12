const {Route} = require('../src/route')

describe('Route', () => {

    test('match index route', () => {
        let route = new Route('/')

        expect(route.match('/')).toBeTruthy()
        expect(route.matchFull('/')).toBeTruthy()
    })

    test('match simple path', () => {
        let route = new Route('/foo')

        expect(route.match('/foo')).toBeTruthy()
        expect(route.matchFull('/foo')).toBeTruthy()
    })

    test('partially match simple path', () => {
        let route = new Route('/foo')

        expect(route.match('/foo/bar')).toBeTruthy()
        expect(route.matchFull('/foo')).toBeTruthy()
        expect(route.matchFull('/foo/bar')).toBeFalsy()
    })

    test('sanitze path', () => {
        let path = '/'
        expect(Route.sanitize(path)).toBe('/')

        path = '/foo/'
        expect(Route.sanitize(path)).toBe('/foo')

        path = 'foo/bar/'
        expect(Route.sanitize(path)).toBe('/foo/bar')
    })

    test('make path relative to route', () => {
        let route = new Route('/foo')

        expect(route.relative('/foo/bar')).toBe('/bar')
    })

    test('turn param to regexp group', () => {
        let route = new Route('/foo/:name')

        expect(route.regPath).toEqual(/^\/foo\/(?<name>\w+)/)

        route = new Route('/foo/:name/:age')

        expect(route.regPath).toEqual(/^\/foo\/(?<name>\w+)\/(?<age>\w+)/)
    })

    test('match everything on multi path wildcard', () => {
        let route = new Route()

        expect(route.match('/')).toBeTruthy()
        expect(route.match('/foo/bar/test')).toBeTruthy()
    })

})