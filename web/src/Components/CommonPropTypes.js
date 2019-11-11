import PropTypes from 'prop-types'

export const ExperiencePropType = {
  startDate: PropTypes.date,
  endDate: PropTypes.date,
  present: PropTypes.bool,
  role: PropTypes.string,
  employer: PropTypes.number,
  city: PropTypes.number,
  description: PropTypes.string
}

export const TrainingPropType = {
  date: PropTypes.date,
  present: PropTypes.bool,
  diploma: PropTypes.string,
  school: PropTypes.string,
  city: PropTypes.number,
  Field: PropTypes.string,
  Description: PropTypes.string
}

export const HobbyPropType = {
  startDate: PropTypes.date,
  endDate: PropTypes.date,
  name: PropTypes.string,
  description: PropTypes.string
}
