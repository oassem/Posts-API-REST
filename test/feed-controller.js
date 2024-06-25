const User = require('../models/user')
const Post = require('../models/post')
const FeedController = require('../controllers/feed')
const mongoose = require('mongoose')

let expect

before(async () => {
    const chai = await import('chai')
    expect = chai.expect
})

describe('Feed Controller', function () {
    it('should add a new post to the user\'s posts array', async function () {
        try {
            await mongoose.connect('mongodb+srv://omarelghazalynweave:HM5ip9T6LomkmVpX@cluster0.hbxmz04.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0');

            const user = new User({
                _id: '551137c2f9e1fac808a5f572',
                name: 'Omar Assem',
                email: 'omar@xxx.com',
                password: 'hashedPassword',
                posts: []
            });

            await user.save();

            const req = {
                body: {
                    title: 'New post',
                    content: 'This is a new post',
                },
                file: {
                    path: 'file/path'
                },
                userId: '551137c2f9e1fac808a5f572'
            };

            const res = {
                status: function () { return this; },
                json: function () { }
            };

            const resultUser = await FeedController.createPost(req, res, () => { });

            expect(resultUser).to.have.property('posts');
            expect(resultUser.posts).to.have.length(1);

            await Post.deleteMany({});
            await User.deleteMany({});
            await mongoose.disconnect();

        } catch (err) {
            console.error(err);
            throw err;
        }
    })
})