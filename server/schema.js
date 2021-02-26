const { gql } = require('apollo-server-express')

export default gql`
  type Culture {
    id: ID,
    product: Product,
    plantDate: Int,
    status: Int,
    surfaces: [Surface]
  }
  type Surface {
    id: ID,
    plot: Plot,
    code: String
  }
  type Plot {
    id: ID,
    Code: String,
    Description: String
  }
  type Product {
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
  type Query {
      CurrentCultures: [Culture]
  }
`
