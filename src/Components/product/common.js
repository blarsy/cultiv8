import { sort, map, uniqBy } from 'ramda'

export const greedinessOptions = [{
      label: 'Forte',
      value: 3
    },
    {
      label: 'Modérée',
      value: 2
    },
    {
      label: 'Faible',
      value: 1
    }]
export const monthesOptions = [{
    label: '(1) Janvier',
    value: 1
  },{
    label: '(2) Février',
    value: 2
  },{
    label: '(3) Mars',
    value: 3
  },{
    label: '(4) Avril',
    value: 4
  },{
    label: '(5) Mai',
    value: 5
  },{
    label: '(6) Juin',
    value: 6
  },{
    label: '(7) Juillet',
    value: 7
  },{
    label: '(8) Août',
    value: 8
  },{
    label: '(9) Septembre',
    value: 9
  },{
    label: '(10) Octobre',
    value: 10
  },{
    label: '(11) Novembre',
    value: 11
  },{
    label: '(12) Décembre',
    value: 12
  }
]
export const greenhouseOptions= [{
  label: 'En serre',
  value: 3
},{
  label: 'En plein champ',
  value: 2
},{
  label: 'Les deux',
  value: 1
}]
export const getFamiliesOptions = products => sort((a, b) => a.label.localeCompare(b.label),
  map(product => ({ value: product.family, label: product.family }),
    uniqBy(product => product.family, products)
  )
)
