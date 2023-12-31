const blogsRouter = require("express").Router()
const Blog = require("../models/Blog")
const User = require("../models/User")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })

  if (blogs) {
    res.json(blogs)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post("/", async (req, res) => {
  const { body } = req

  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title: body.title,
    likes: body.likes,
    url: body.url,
    author: body.author,
    user: user.id,
  })

  if (!body.title || !body.url) {
    res.status(400).json({
      error: "Blog data is missing!",
    })
  }

  const savedBlog = await blog.save()
  user.blogs.push(savedBlog)

  await User.findByIdAndUpdate(user.id, user, { new: true })

  res.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (req, res) => {
  const { body } = req

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
  }).populate("user", { username: 1, name: 1 })

  res.json(updatedBlog)
})

blogsRouter.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404).json({ error: "Not Found: Blog not found" })
  }

  if (blog.user.toString() === req.user.id) {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } else {
    res.status(403).json({
      error: "Forbidden: You do not have permission to delete this blog",
    })
  }
})

module.exports = blogsRouter
