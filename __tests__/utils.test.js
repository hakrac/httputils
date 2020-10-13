const {isolate, promisify} = require('../src/utils')

describe('utilities', () => {

    test('promisify', () => {
        const fn = (name, cb) => cb(name)
        let promise = promisify(cb => fn('bob', cb))
        expect(Promise.resolve(promise)).toBe('bob')
    })

    test('isolate', () => {
        let obj = { a: 'a', b: 'b' }
        let fn = () => {
            return obj
        }
        fn = isolate(fn, obj, 'a')

        obj.a = 'b'
        obj.b = 'a'
        
        expect(obj).toEqual({a: 'b', b: 'a'})
        expect(fn()).toEqual({ a: 'a', b: 'a' })
    })

})