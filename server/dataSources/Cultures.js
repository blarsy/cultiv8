import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Cultures extends MongoDataSource {
  async getCultures() {
    return this.collection.find().toArray()
  }
  async getCulture(cultureId) {
    return this.findOneById(cultureId)
  }
}
