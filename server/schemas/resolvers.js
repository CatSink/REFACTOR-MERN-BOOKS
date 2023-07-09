const {User, Book} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent,args) => {
            return await User.findById(args.id).populate('user');
        },
    },
    Mutation: { 
        addUser: async (parent,{email,password}) => {
            return await User.create({username,password,email})
        },
        logIn: async (parent,{email,password}) => {
            const userData = await User.findOne({email})
            if (!userData) {
                throw new AuthenticationError('User profile not found.')

            }
            const token = signToken(userProfile);
            return {token,userProfile}
        },
        savedBooks: async (parent,{userId,bookId}) => {
            return await Book.findOneAndUpdate(
                { _id: userId}, 
                { $addSet: {savedBooks: {bookId: bookId}}
            },
            {
                new: true,
                runValidators: true,
            });

    },
    deleteBook: async (parent,{bookId}) => {
        return await Book.findOneAndDelete(
            {bookId: bookId});
        }
    } 
}

module.exports = resolvers;