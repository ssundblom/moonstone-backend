import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


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
  price: {
    type: Number
  },
  stock: {
    type: Number
  }
})

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/products', async (req, res) => {
  const { product } = await Product.find()
  res.json(product)
})





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
