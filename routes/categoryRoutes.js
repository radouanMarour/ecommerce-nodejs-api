import Category from '../models/Category.js'
import express from 'express'
import { modelNames } from 'mongoose'
import slugify from 'slugify'

const router = express.Router()

// Create a category
router.post('/categories', async (req, res) => {
    console.log(req.body)
    const { name, parent } = req.body;

    if (!modelNames) {
        return res.status(400).json({
            status: "error",
            message: "Name, is required"
        })
    }

    try {
        const categoryExists = await Category.findOne({ slug: slugify(name) })
        if (categoryExists) {
            return res.status(400).json({
                status: "error",
                message: "Category already exists"
            })
        }
        let newCategory = ""
        if (parent) {
            newCategory = new Category({ name, slug: slugify(name), parent })
        } else {
            newCategory = new Category({ name, slug: slugify(name) })
        }
        await newCategory.save()
        res.status(201).json({
            status: "succeed",
            message: `${name} category has been created successfully`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }

})

// get all principal categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({ parent: { $eq: null } })
        res.status(201).json({
            status: "succeed",
            data: categories
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }
})

router.get('/subcategories/:parentId', async (req, res) => {
    const { parentId } = req.params
    try {
        const subcategories = await Category.find({ parent: parentId })
        res.status(201).json({
            status: "succeed",
            data: subcategories
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }
})

export default router