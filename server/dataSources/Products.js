import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Products extends MongoDataSource {
  async getProducts() {
    return this.collection.find().toArray()
  }
  async getProduct(productId) {
    return this.findOneById(productId)
  }
}
