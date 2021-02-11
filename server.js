import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import products from './products.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/moonstone"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useFindAndModify', false)

const Product = mongoose.model('Product', {
  name: {
    type: String
  },
  description: {
    type: String,
  },
  categories: [{
    type: String
  }],
  soulPowers: [{
    type: String
  }],
  images: [{
    type: String
  }],
  price: {
    type: Number
  },
  inventory: {
    type: Number
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
})

if (process.env.RESET_DATABASE) {
  console.log('RESETTING DATABASE')

  const populateDatabase = async () => {
    await Product.deleteMany()

    products.forEach(product => {
      const newProduct = new Product(product)
      newProduct.save()
    })
  }
  populateDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/products', async (req, res) => {
  const products = await Product
    .find(req.query.c ? { categories: { "$in": req.query.c } } : {})
    .find(req.query.sp ? { soulPowers: { "$in": req.query.sp } } : {})
  res.json(products)
})

app.get('/products/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId)
  res.json(product)
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})