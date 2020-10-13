const {isolate} = require('../src/http')

describe('utilities', () => {

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