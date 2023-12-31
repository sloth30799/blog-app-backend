const Blog = require("../models/Blog")
const User = require("../models/User")

const testBlogs = [
  {
    title: "The Art of Blogging",
    author: "Alice Johnson",
    url: "/the-art-of-blogging",
    likes: 15,
  },
  {
    title: "Mastering Mongoose Schemas",
    author: "Bob Smith",
    url: "/mastering-mongoose-schemas",
    likes: 20,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  testBlogs,
  blogsInDb,
  usersInDb
}
