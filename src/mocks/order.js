import moment from 'moment'

export default {
  name: 'New Order',
  start: moment().format('YYYY-MM-DD'),
  end: moment().add(1, 'month').format('YYYY-MM-DD'),
  auto_budget: true,
  amount: 1000,
  budgets: [/* {
    id: 'abc',
    name: 'Mc Melody',
    percentage: 40,
    campaigns: []
  }, {
    id: 'def',
    name: 'Faustão',
    percentage: 30,
    campaigns: []
  }, {
    id: 'ghi',
    name: 'Neymar',
    percentage: 20,
    campaigns: []
  }*/]
}
