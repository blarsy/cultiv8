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
    code: String,
    name: String,
    farmId: ID
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
    workPerSqMeter: Float,
    farmId: ID
  }
  type Task {
    _id: ID,
    type: String,
    culture: Culture,
    date: String,
    creation: String
  }
  type Query {
      tasks: [Task],
      task(_id: ID): Task,
      farms: [Farm],
      farm(_id: ID): Farm,
      cultures: [Culture],
      products: [Product],
      product: Product,
      surfaces(farmId: ID): [Surface]
  }
  type Mutation {
    rescheduleTask(_id: ID, date: String): Task,
    deleteTask(_id: ID): Int
  }
`
