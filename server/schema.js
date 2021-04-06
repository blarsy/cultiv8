import { gql } from 'apollo-server-express'

export default gql`
  type Farm {
    _id: ID,
    name: String
  },
  type Culture {
    _id: ID,
    product: Product,
    plantDate: String,
    status: Int,
    surfaces: [Surface]
  }
  type Surface {
    _id: ID,
    plot: Plot,
    code: String
  }
  type Plot {
    _id: ID,
    Code: String,
    Description: String
  }
  type Product {
    _id: ID,
    harvestDays: Int,
    interestRatio: Float,
    soilOccupationRatio: Float,
    priceOrganic: Int,
    unit: String,
    family: String,
    growingDays: Int,
    greediness: Int,
    sowMax: Int,
    incomePerWorkHour: Float,
    name: String,
    amountOfWorkRatio: Float,
    totalNumberOfPlants: Float,
    surface: Int,
    totalIncome: Float,
    greenhouseSurface: Int,
    productivity: Float,
    plantsPerSqMeter: Float,
    incomePerSqMeter: Float,
    sowMin: Int,
    actualPrice: Float,
    nurseryDays: Int,
    greenhouse: Boolean,
    surfaceRatio: Int,
    workPerSqMeter: Float
  }
  type Task {
    _id: ID,
    type: String,
    culture: Culture,
    date: String,
    creation: String
  }
  type Query {
      currentCultures: [Culture],
      tasks: [Task],
      task(id: ID): Task,
      farms: [Farm],
      farm(id: ID): Farm,
      cultures: [Culture]
  }
`
