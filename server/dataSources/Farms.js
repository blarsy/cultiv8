import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Farms extends MongoDataSource {
  async getFarms() {
    return this.collection.find().toArray()
  }
  async getFarm(farmId) {
    return this.findOneById(farmId)
  }
}
