const User = require('../models/user')
const AuthController = require('../controllers/auth')
const sinon = require('sinon')
const mongoose = require('mongoose')

let expect

before(async () => {
    const chai = await import('chai')
    expect = chai.expect
})

describe('Auth Controller', function () {
    it('should throw an error if accessing database fails', function (done) {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }

        sinon.stub(User, 'findOne').throws(new Error('Database access failed!'));

        AuthController.login(req, {}, (err) => {
            try {
                expect(err).to.be.an('error');
                expect(err).to.have.property('statusCode', 500);
                done();
            } catch (error) {
                done(error);
            } finally {
                User.findOne.restore();
            }
        })
    })

    it('should send a response with valid user status', function (done) {
        mongoose
            .connect('mongodb+srv://omarelghazalynweave:HM5ip9T6LomkmVpX@cluster0.hbxmz04.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0')
            .then(() => {
                const user = new User({
                    name: 'Omar Assem',
                    email: 'omar@xyz.com',
                    password: 'hashedPassword',
                    posts: [],
                    _id: '551137c2f9e1fac808a5f572'
                })

                return user.save()
            }).then(() => {
                const req = {
                    userId: '551137c2f9e1fac808a5f572'
                }

                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function (code) {
                        this.statusCode = code
                        return this
                    },
                    json: function (data) {
                        this.userStatus = data.status
                    }
                }

                AuthController.getUserStatus(req, res, () => { }).then(async () => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.userStatus).to.be.equal('I am new')
                    await User.deleteMany({})
                    await mongoose.disconnect()
                    done()
                })
            })
    })
})