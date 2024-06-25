const middleware = require('../middleware/is-auth')
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

let expect

before(async () => {
    const chai = await import('chai')
    expect = chai.expect
})

describe('Test Auth Middleware', function () {
    it('should throw error if no authorization header present', function () {
        const req = {
            get: function () {
                return null
            }
        }

        expect(middleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.')
    })

    it('should throw error if authorization header is one string', function () {
        const req = {
            get: function () {
                return 'xyz'
            }
        }

        expect(middleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('should throw error if token cannot be verified', function () {
        const req = {
            get: function () {
                return 'Bearer xyz'
            }
        }

        expect(middleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('should yield userId after decoding the token', function () {
        const req = {
            get: function () {
                return 'Bearer xyz'
            }
        }

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({ userId: 'abc' })

        middleware(req, {}, () => { })

        expect(req).to.have.property('userId')
        expect(req).to.have.property('userId', 'abc')
        expect(jwt.verify.called).to.be.true

        jwt.verify.restore()
    })
})
