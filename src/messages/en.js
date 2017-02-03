module.exports = {
  welcomeMessage: 'Hey, {name}',
  linkCampaignsCallToAction: 'Link selected',
  unlinkCampaignsCallToAction: 'Unlink selected',
  nCampaigns: '{n} linked campaigns',
  nLooseCampaigns: '{n} loose campaigns',
  filterActiveOnly: 'Show only active',
  selectAllCampaigns: 'Select all',
  deselectAllCampaigns: 'Deselect all',
  navLogout: 'Logout',
  navLogin: 'Login',
  navSignup: 'Signup',
  editCallToAction: 'Edit',
  editWorkspaceHeader: 'Edit workspace',
  newWorkspaceHeader: 'New workspace',
  newWorkspaceCallToAction: 'Create workspace',
  newFolderHeader: 'New folder',
  newReportHeader: 'New report',
  editFolderHeader: 'Edit folder',
  editBudgetHeader: 'Edit budget',
  newFolderCallToAction: 'Create folder',
  newReportCallToAction: 'Create report',
  isPrivateReport: 'Private report',
  isPrivateComment: 'Private',
  newOrderHeader: 'New order',
  newOrderCallToAction: 'Create order',
  newCampaignHeader: 'New campaign',
  newCampaignCallToAction: 'Create campaign',
  save: 'Save',
  cancel: 'Cancel',
  update: 'Update',
  budgetNameLabel: 'Budget name',
  nameLabel: 'Name',
  entityLabel: 'Report type',
  orders: 'Orders',
  dayLabel: 'Day',
  orderNameLabel: 'Order name',
  mediaLabel: 'Media',
  kpiLabel: 'KPI',
  folderTagLabel: 'Tag for campaign auto-linking',
  autoLinkRightAway: 'Link campaigns containing tag on submit',
  externalAccountLabel: 'External account',
  accountSelectorPlaceholder: 'Select the {platform} account',
  onSuccessAlert: 'Operation completed successfully!',
  budgetLabel: 'Budget',
  availableBudget: 'Available budget',
  percentageLabel: 'Percentage',
  amountLabel: 'Amount',
  valueLabel: 'Value',
  investmentLabel: 'Investment',
  investmentDayLabel: 'Daily goal',
  startDateLabel: 'Start date',
  endDateLabel: 'End date',
  dateLabel: 'Date',
  emptyBudgetSelectionTitle: 'No budget selected',
  emptyBudgetSelectionBody: `
      <p>
        Here you can say how those <strong>$ {amount}</strong> you set for this Order
        can be shared among your campaigns.
      </p>
      <p>
        Each slice in the pie aside is a partition of that sum.
        Inside each one of these slices you can put as many campaigns as you like, so the amount will be shared between them.
      </p>
      <p>
        You still have <strong>$ {available}</strong> left.
      </p>`,
  createBudget: 'Slice a new budget',
  folderCampaignsTitle: 'Folder campaigns',
  budgetCampaignsTitle: 'Budget campaigns',
  maxCampaignsPerBudgetReached: '<p>You can\'t add anymore campaign in this budget</p>',
  budgetWithoutCampaigns: '<p>You still did not include any campaign in this budget.</p>',
  newOrderName: '{month}',
  deliveryMethodLabel: 'Delivery method',
  close: 'Close',
  calculateBudgetAmountTitle: 'Calculated budget amount',
  calculateAdsetAmountTitle: 'Calculated ad set amount',
  totalAmountTitle: 'Total',
  averageAmountTitle: 'Average',
  previousAmountTitle: 'Previous',
  todayAmountTitle: 'Today\'s',
  loadCampaignBudgetTitle: 'Loaded campaign budget',
  loadCampaignCostTitle: 'Loaded campaign cost',
  loadAdsetCostTitle: 'Loaded Ad Set cost',
  loadAdsetInfoTitle: 'Loaded Ad Set Information',
  closedCostTitle: 'Closed',
  totalCostTitle: 'Total',
  todayCostTitle: 'Today\'s',
  campaignTitle: 'Campaign {name}',
  budgetTitle: 'Budget {name}',
  adsetTitle: 'Ad Set {name}',

  dailyBudgetTitle: 'Daily budget',
  lifetimeBudgetTitle: 'Lifetime budget',
  budgetRemainingTitle: 'Remaining budget',

  createBudgetTitle: 'Created budget',
  setCampaignBudgetTitle: 'Changed campaign budget',
  updateBudgetTitle: 'Updated budget',
  updateAdsetTitle: 'Updated Ad Set',
  remove: 'Remove',
  finalUrl: 'Final URL',
  cloneOrders: 'Clone Orders',
  cloneSingleOrder: 'Clone Order',
  selectOrders: 'Select',
  applyToSelectedOrders: 'Apply',
  copyOfName: 'Copy of {name}',
  biddableKeywords: 'Keywords',
  negativeKeywords: 'Negative Keywords',
  notYetImplemented: 'Not yet implemented',
  loadingAds: 'Loading Ads...',
  loadingReport: 'Loading Report...',
  loadingCampaigns: 'Loading Campaigns...',
  calculating: 'Calculating...',
  extractReport: 'Download',
  creatingReport: 'Creating Report...',

  // date ranges
  today: 'Today',
  yesterday: 'Yesterday',
  pastWeek: 'Past week',
  currentMonth: 'Current month',
  last30Days: 'Last 30 days',
  pastMonth: 'Past month',
  nextWeek: 'Next week',
  nextMonth: 'Next month',
  nextSemester: 'Next semester',
  nextYear: 'Next year',

  orderRangeTitle: 'Order Period',
  reportBuilder: 'Report Builder',
  dateRangeLabel: 'from {startDate} until {endDate}',
  reportRangeTitle: 'Report date range',
  campaigns: 'Campaigns',
  placementLevel: 'Placement',
  searchLevel: 'Search Query',
  audienceLevel: 'Audience',
  adGroups: 'AdGroups',
  videos: 'Videos',
  keywords: 'Keywords',
  adSets: 'Ad Sets',
  ads: 'Ads',
  campaignEntity: 'Campaign',
  videoEntity: 'Video',
  adEntity: 'Ad',
  adGroupEntity: 'Ad Group',
  adSetEntity: 'Ad Set',
  accountEntity: 'Account',
  keywordEntity: 'Keyword',
  newModule: 'New module',
  moduleTypeLabel: 'Module type',
  lineChart: 'Line chart',
  columnChart: 'Column chart',
  pieChart: 'Pie chart',
  table: 'Table',
  totalChart: 'Total',
  metrics: 'Metrics',
  dimensions: 'Segments',
  module: 'Module',
  invalidAttributePermutation: 'Selection canceled - {inserted} can not be used with {list}',
  filterLabel: 'Filter',
  moduleContent: 'Report Options',
  filterModuleResult: 'Filter Result',
  reports: 'Reports',
  // breadcrumbs
  companyBreadcrumb: 'Company',
  workspaceBreadcrumb: 'Workspace',
  folderBreadcrumb: 'Folder',
  campaignBreadcrumb: 'Campaign',
  orderBreadcrumb: 'Order',
  reportBreadcrumb: 'Report',
  // delete button modal
  deletePromptTitle: 'Delete prompt',
  deletePromptBody: 'You are trying to remove <strong>{entityName}</strong>. <br/> Are you sure about this?',
  confirm: 'Yes',
  // asides
  reportAccessControl: 'Access Control',
  makeReportGlobal: 'Share Globally',
  makeReportGlobalDescription: 'Share report with other companies',
  setReportMediaDescription: 'Define a media for this report',
  setReportMedia: 'Select media',
  makeReportPublic: 'Share with Company',
  makeReportPublicDescription: 'Share report with your coworkers',
  favoriteReport: 'Favorite',
  favoriteReportDescription: 'Set report as the folder default (specifically for your user)',
  unfavoriteReport: 'Unfavorite',
  unfavoriteReportDescription: 'Report will stop being your favorite',
  editReport: 'Edit Report',
  editReportPromptTitle: 'Confirm report edit',
  editReportPromptBody: 'You\'re about to open the shared report <strong>{name}</strong> for editing, are you\'re sure about this?',
  cloneReport: 'Clone Report',
  cloneModule: 'Clone Module',
  deleteReport: 'Delete Report',
  checkDefaultReport: 'Set as Default',
  checkDefaultReportDescription: 'Make Report the default',
  uncheckDefaultReport: 'Deselect Report',
  uncheckDefaultReportDescription: 'Report will cease to be the default',
  editOrder: 'Edit Order',
  autoBudgetLog: 'AutoBudget History',
  deleteOrder: 'Delete Order',
  folderOrders: 'Folder Orders',
  folderReport: 'Folder Report',
  editFolder: 'Edit Folder',
  deleteFolder: 'Delete Folder',
  editWorkspace: 'Edit Workspace',
  workspaceOrders: 'Workspace Orders',
  deleteWorkspace: 'Delete Workspace',
  manageCompany: 'Manage Company',
  companyOrders: 'Company Orders',
  // entity list headers
  workspaceList: 'Workspaces',
  folderList: 'Folders',
  companyList: 'Companies',
  emptyReportResult: 'Empty Report',
  invalidModuleConfig: 'Please select at least 1 item from: {entity}, Segments and Metrics',
  resultLimitLabel: 'Limit',
  all: 'All',
  // input errors
  requiredInput: 'Required field',
  invalidInput: 'Invalid input',
  greaterThanMax: 'Max value is {max}',
  lessThanMin: 'Min value is {min}',
  noBudgetRemaining: 'Not enough budget',
  refreshCampaigns: 'Update Campaigns',
  takenCampaign: 'The campaign is already linked to another folder',
  openFolderName: 'Go to folder "{name}"',
  doNotAskAgain: 'Do not ask again',
  manuallyRunAutoBudget: 'Run Auto-Budget',
  spawnAutoBudgetPromptTitle: 'Confirm Auto Budget execution',
  spawnAutoBudgetPromptBody: `You are about to manually run the Auto Budget.<br/>
        The routine will be started and by the end of it your team will receive an email informing about the new budgets.
        Are you sure about this?`,
  dashCampaignLabel: 'Campanha Dash',
  errorScreenTitle: 'Ops... we got an error!',
  errorScreenBody: `
      It was not possible to display the page you we're looking for.<br/>
      It could be anything really, you can contact support or try again later.`,
  errorScreenAuthTitle: 'Access Forbidden',
  errorScreenAuthBody: 'You are trying to access an area your user has no access to.<br/> You may want to check the URL or contact your administrator.',
  errorScreenExit: 'Ok, take me back!',
  messageFromServer: 'Message from server',
  pickReportTypePromptTitle: 'Pick an export format',
  reportTypeSpreadsheet: 'Spreadsheet',
  reportTypePdf: 'PDF',
  oneLevelUpNavigation: 'Back',
  containsOperator: 'Contains',
  equalsOperator: 'Equals',
  notEqualsOperator: 'Not equals',
  lessThanOperator: 'Less than',
  greaterThanOperator: 'Greater than',
  betweenOperator: 'Between',
  newFilter: 'Add filter',
  untitledModule: '[ untitled module ] ',
  emptyAccessControlOptions: 'Unfortunately, your user is not allowed to edit the access options for the current report.',
  hideNCampaigns: 'Hide {count} inactive campaign(s)',
  showNCampaigns: 'Show {count} inactive campaign(s)',
  globalAdmin: 'Global Admin',
  regularUser: 'Regular User',
  edit: 'Edit',
  companyName: 'Company name',
  recentWorkspace: 'Last Accessed Workspaces',
  faveWorkspace: 'Favorite',
  unfaveWorkspace: 'Unfavorite',
  faveWorkspaceList: 'Favorite Workspaces',
  workspaceFoldersSummary: 'Folders',
  recentFolder: 'Last Accessed Folders',
  creatives: 'Creatives',
  companyReport: 'Company Report',
  workspaceReport: 'Workspace Report',
  viewFullReport: 'More options',
  shareReportButton: 'Share',
  shareReportTitle: 'Share Report',
  shareReportLabel: 'Shareable URL',
  copyToClipboard: 'Copy',
  copySuccess: 'Copied to clipboard!',
  adwordsLevel: 'Adwords',
  facebookLevel: 'Facebook',
  sharedLevel: 'Shared',
  tooManyAccounts: 'You have selected {selected} accounts, the max is {max}',
  calculateKeywordsRelevance: 'Calculate relevance',
  calculateAdsKPI: 'Calculate {kpi}',
  reportMailing: 'Mailing',
  newMailing: 'New Mailing',
  mailingRangeLabel: 'Report date range',
  mailingEnabledSwitch: 'Enabled',
  mailingRecurrentSwitch: 'Recurrent',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  dayOfWeekLabel: 'Day of Week',
  dayOfMonthLabel: 'Day of Month',
  periodicityLabel: 'Periodicity',
  reportMailingFormTitle: 'Mailing report {report}',
  newEmailLabel: 'New email',
  disableMailing: 'Disable',
  enableMailing: 'Enable',
  mailingReportLink: 'Open report',
  unsubscriptionTitle: 'Mailing Unsubscription',
  unsubscriptionBody: 'Ok <strong>{email}</strong>, you have been unsubscribed from <em>{report}</em> emails.',
  newCommentPlaceholder: 'Type your comment here',
  newCommentButton: 'Send',
  commentDescription: 'Comment by {user}',
  moduleDescriptionTitle: 'Module Description',
  moduleDescriptionPlaceholder: 'Write a description for this module',
  reportDescriptionPlaceholder: 'Write a description for this report',
  croppedResultAlertTitle: 'Partial result',
  croppedResultAlertBody: `
        <strong>{module}</strong> result is too large and was cropped for performance reasons.
        The displayed result contains only the first thousand lines out of <strong>{size}</strong>.`,
  spawnMailing: 'Run mailing',
  saveAndRun: 'Save & Run',
  unsubscribedEmail: 'User has unsubscribed from list',
  emptyMailing: 'Your email list is empty',
  kpiGoalLabel: 'KPI Goal',
  kpiGoalMetricTitle: '{metric} Goal',
  kpiGoalMetricResult: '{currentValue} of {goal}',
  privateReportTooltip: 'Only you can see this report',
  companyReportTooltip: 'Anyone in your company can see this report',
  globalReportTooltip: 'This is a builtin report',
  createdByName: 'Created by <strong>{name}</strong>',
  updatedTimeAgo: 'Last update {timeago}',
  notFoundTitle: 'Not Found!',
  notFoundBody: 'The object you tried to access does not exist or you don\'t have permission to view it.',
  rolesLabel: 'Roles',
  leaveOrderPrompt: 'Your Order has unsaved changes, do you really want to leave?',
  newDashCampaign: 'New Dash Campaign',
  enabledFilterLabel: 'Enabled',
  enabledOrPausedFilterLabel: 'Enabled or Paused',
  allFilterLabel: 'All',
  noActiveOrder: 'No active Orders',
  lastActiveOrder: 'Last active Order',
  moduleIndexLabel: 'Index'
}
