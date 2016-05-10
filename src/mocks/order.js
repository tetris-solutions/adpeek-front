import moment from 'moment'

export default {
  name: 'Campanhas TOP',
  start: moment().format('YYYY-MM-DD'),
  end: moment().add(1, 'month').format('YYYY-MM-DD'),
  auto_budget: true,
  amount: 1000,
  budgets: [{
    name: 'Mc Melody',
    percentage: 50,
    campaigns: []
  }, {
    name: 'Faustão',
    percentage: 30,
    campaigns: []
  }, {
    name: 'Neymar',
    percentage: 20,
    campaigns: []
  }]
}
