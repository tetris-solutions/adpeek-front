module.exports = {
  en: {
    welcomeMessage: 'Hey, {name}',
    linkCampaignsCallToAction: 'Link selected',
    unlinkCampaignsCallToAction: 'Unlink selected',
    nCampaigns: '{n} linked campaigns',
    nLooseCampaigns: '{n} loose campaigns',
    filterActiveCampaigns: 'Filter active campaigns',
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
    newOrderHeader: 'New order',
    newOrderCallToAction: 'Create order',
    newCampaignHeader: 'New campaign',
    newCampaignCallToAction: 'Create campaign',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    budgetNameLabel: 'Budget name',
    nameLabel: 'Name',
    entityLabel: 'Report entity',
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
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
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
    campaignAdsTitle: 'Campaign "{campaign}" Ads',
    finalUrl: 'Final URL',
    folderAdsTitle: 'Folder "{folder}" Ads',
    cloneOrders: 'Clone Orders',
    cloneSingleOrder: 'Clone Order',
    selectOrders: 'Select',
    applyToSelectedOrders: 'Apply',
    copyOfOrderName: 'Copy of {name}',
    biddableKeywords: 'Keywords',
    negativeKeywords: 'Negative Keywords',
    notYetImplemented: 'Not yet implemented',
    loadingAds: 'Loading Ads...',
    loadingReport: 'Loading Report...',
    loadingCampaigns: 'Loading Campaigns...',
    extractReport: 'Download Report',
    creatingReport: 'Creating Report...',
    today: 'Today',
    yesterday: 'Yesterday',
    pastWeek: 'Past week',
    currentMonth: 'Current month',
    pastMonth: 'Past month',
    reportBuilder: 'Report Builder',
    dateRangeLabel: 'from {startDate} until {endDate}',
    reportRangeTitle: 'Report date range',
    campaigns: 'Campaigns',
    adGroups: 'AdGroups',
    keywords: 'Keywords',
    adSets: 'Ad Sets',
    ads: 'Ads',
    campaignEntity: 'Campaign',
    adEntity: 'Ad',
    adgroupEntity: 'Ad Group',
    adsetEntity: 'Ad Set',
    accountEntity: 'Account',
    keywordEntity: 'Keyword',
    newModule: 'New module',
    moduleTypeLabel: 'Module type',
    lineChart: 'Line chart',
    columnChart: 'Column chart',
    pieChart: 'Pie chart',
    table: 'Table',
    metrics: 'Metrics',
    dimensions: 'Segments',
    module: 'Module',
    invalidAttributePermutation: 'Selection canceled - {inserted} can not be used with {list}',
    filterLabel: 'Filter',
    moduleContent: 'Setup Module Report',
    moduleSize: 'Module Size',
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
    makeReportGlobal: 'Make Global',
    makeReportPublic: 'Make Public',
    favoriteReport: 'Favorite Report',
    editReport: 'Edit Report',
    deleteReport: 'Delete Report',
    checkFolderReport: 'Set as Folder Default',
    uncheckFolderReport: 'Deselect Report',
    editOrder: 'Edit Order',
    autoBudgetLog: 'AutoBudget History',
    deleteOrder: 'Delete Order',
    folderAds: 'Folder Ads',
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
    emptyReportResult: 'Empty Report',
    invalidModuleConfig: 'Please select at least 1 item from: {entity}, Segments and Metrics',
    resultLimitLabel: 'Limit',
    all: 'All',
    // input errors
    requiredInput: 'Required field',
    invalidInput: 'Invalid input',
    greaterThanMax: 'Max value is {max}',
    lessThanMin: 'Min value is {min}',
    noBudgetRemaining: 'Not enough budget'
  },
  'pt-BR': {
    welcomeMessage: 'Olá, {name}',
    linkCampaignsCallToAction: 'Associar',
    unlinkCampaignsCallToAction: 'Desassociar',
    nCampaigns: '{n} campanhas nesta pasta',
    nLooseCampaigns: '{n} campanhas soltas',
    filterActiveCampaigns: 'Filtrar campanhas ativas',
    selectAllCampaigns: 'Selecionar todas',
    deselectAllCampaigns: 'Deselecionar todas',
    navLogout: 'Sair',
    navLogin: 'Entrar',
    navSignup: 'Cadastrar',
    editCallToAction: 'Editar',
    editWorkspaceHeader: 'Editar área de trabalho',
    newWorkspaceHeader: 'Nova área de trabalho',
    newWorkspaceCallToAction: 'Criar',
    newFolderHeader: 'Nova pasta',
    newReportHeader: 'Novo relatório',
    editFolderHeader: 'Editar pasta',
    editBudgetHeader: 'Editar orçamento',
    newFolderCallToAction: 'Criar pasta',
    newReportCallToAction: 'Criar relatório',
    isPrivateReport: 'Relatório privado',
    newCampaignHeader: 'Nova campanha',
    newCampaignCallToAction: 'Criar campanha',
    newOrderHeader: 'Nova ordem',
    newOrderCallToAction: 'Criar ordem',
    save: 'Salvar',
    cancel: 'Cancelar',
    update: 'Atualizar',
    budgetNameLabel: 'Nome do orçamento',
    orderNameLabel: 'Nome do Pedido',
    orders: 'Pedidos',
    dayLabel: 'Dia',
    nameLabel: 'Nome',
    entityLabel: 'Nível de relatório',
    mediaLabel: 'Pilar de mídia',
    kpiLabel: 'KPI',
    folderTagLabel: 'Tag para auto-adicionar campanhas',
    autoLinkRightAway: 'Adicionar campanhas contendo tag ao salvar',
    externalAccountLabel: 'Conta externa',
    accountSelectorPlaceholder: 'Selecione a conta {platform}',
    onSuccessAlert: 'Operação realizada com sucesso!',
    budgetLabel: 'Orçamento',
    availableBudget: 'Não orçado',
    percentageLabel: 'Porcentagem',
    amountLabel: 'Valor Exato',
    valueLabel: 'Valor',
    investmentLabel: 'Investimento',
    startDateLabel: 'Data início',
    endDateLabel: 'Data final',
    emptyBudgetSelectionTitle: 'Nenhum orçamento selecionado',
    emptyBudgetSelectionBody: `
      <p>
        Aqui você pode dizer como os <strong>R$ {amount}</strong> do seu PI vão ser distribuídos.
      </p>
      <p>
        Cada fatia do gráfico ao lado representa um orçamento, que é uma partição do budget total da ordem.
        É possível associar quantas campanhas você quiser a um orçamento, de forma que o valor será distribuído entre elas.
      </p>
      <p>
        Você ainda tem <strong>R$ {available}</strong> disponíveis.
      </p>`,
    createBudget: 'Separar novo orçamento',
    folderCampaignsTitle: 'Campanhas da pasta',
    budgetCampaignsTitle: 'Campanhas do orçamento',
    maxCampaignsPerBudgetReached: '<p>Você não pode adicionar mais campanhas neste orçamento.</p>',
    budgetWithoutCampaigns: '<p>Você ainda não incluiu nenhuma campanha neste orçamento.</p>',
    newOrderName: 'PI de {month}',
    deliveryMethodLabel: 'Forma de entrega',
    close: 'Fechar',

    calculateBudgetAmountTitle: 'Calculado valor do orçamento',
    calculateAdsetAmountTitle: 'Calculado orçamento do adset',
    totalAmountTitle: 'Total',
    averageAmountTitle: 'Média',
    previousAmountTitle: 'Anterior',
    todayAmountTitle: 'Do dia',
    loadCampaignBudgetTitle: 'Carregado orçamento da campanha',
    loadCampaignCostTitle: 'Carregado custo da campanha',
    loadAdsetCostTitle: 'Carregado custo do Ad Set',
    loadAdsetInfoTitle: 'Carregados dados do Ad Set',
    closedCostTitle: 'Fechado',
    totalCostTitle: 'Total',
    todayCostTitle: 'Do dia',
    campaignTitle: 'Campanha {name}',
    budgetTitle: 'Orçamento {name}',
    adsetTitle: 'Ad Set {name}',

    dailyBudgetTitle: 'Orçamento diário',
    lifetimeBudgetTitle: 'Orçamento vitalício',
    budgetRemainingTitle: 'Orçamento restante',

    createBudgetTitle: 'Criado novo orçamento',
    setCampaignBudgetTitle: 'Alterado orçamento da campanha',
    updateBudgetTitle: 'Orçamento atualizado',
    updateAdsetTitle: 'Ad Set atualizado',
    remove: 'Remover',
    campaignAdsTitle: 'Criativos da campanha "{campaign}"',
    finalUrl: 'URL de destino',
    folderAdsTitle: 'Criativos da pasta "{folder}"',
    cloneOrders: 'Clonar Pedidos',
    cloneSingleOrder: 'Clonar PI',
    selectOrders: 'Selecionar',
    applyToSelectedOrders: 'Aplicar',
    copyOfOrderName: 'Cópia de {name}',
    biddableKeywords: 'Palavras chaves',
    negativeKeywords: 'Palavras chaves negativas',
    notYetImplemented: 'Em construção',
    loadingAds: 'Carregando criativos...',
    loadingReport: 'Carregando relatório...',
    loadingCampaigns: 'Carregando campanhas...',
    extractReport: 'Extrair Relatório',
    creatingReport: 'Gerando Relatório...',
    today: 'Hoje',
    yesterday: 'Ontém',
    pastWeek: 'Semana passada',
    currentMonth: 'Mês atual',
    pastMonth: 'Mês passado',
    reportBuilder: 'Criação de Relatórios',
    dateRangeLabel: 'de {startDate} até {endDate}',
    reportRangeTitle: 'Intervalo do relatório',
    campaigns: 'Campanhas',
    adGroups: 'Ad Groups',
    keywords: 'Palavras chaves',
    adSets: 'Ad Sets',
    ads: 'Anúncios',
    campaignEntity: 'Campanha',
    adEntity: 'Anúncio',
    adGroupEntity: 'Ad Group',
    adSetEntity: 'Ad Set',
    accountEntity: 'Conta',
    keywordEntity: 'Palavra chave',
    newModule: 'Novo módulo',
    moduleTypeLabel: 'Tipo de módulo',
    lineChart: 'Gráfico em linha',
    columnChart: 'Gráfico em coluna',
    pieChart: 'Gráfico de pizza',
    table: 'Tabela',
    metrics: 'Métricas',
    dimensions: 'Dimensões',
    module: 'Módulo',
    invalidAttributePermutation: 'Erro - {inserted} não pode ser selecionado junto com {list}',
    filterLabel: 'Filtrar',
    moduleContent: 'Configurar Relatório',
    moduleSize: 'Configurar Tamanho',
    reports: 'Relatórios',
    // breadcrumbs
    companyBreadcrumb: 'Empresa',
    workspaceBreadcrumb: 'Área de trabalho',
    folderBreadcrumb: 'Pasta',
    campaignBreadcrumb: 'Campanha',
    orderBreadcrumb: 'Pedido',
    reportBreadcrumb: 'Relatório',
    // delete button modal
    deletePromptTitle: 'Confirmar remoção',
    deletePromptBody: 'Você está prestes a remover <strong>{entityName}</strong>. <br/> Tem certeza que deseja continuar?',
    confirm: 'Sim',
    // asides
    makeReportGlobal: 'Expor Globalmente',
    makeReportPublic: 'Expor pra Empresa',
    favoriteReport: 'Favoritar Relatório',
    editReport: 'Editar Relatório',
    deleteReport: 'Remover Relatório',
    checkFolderReport: 'Fazer Padrão',
    uncheckFolderReport: 'Desfazer Padrão',
    editOrder: 'Editar Ordem',
    autoBudgetLog: 'Histórico AutoBudget',
    deleteOrder: 'Remover Ordem',
    folderAds: 'Criativos',
    folderOrders: 'Pedidos',
    folderReport: 'Relatório',
    editFolder: 'Editar Pasta',
    deleteFolder: 'Remover Pasta',
    editWorkspace: 'Editar',
    workspaceOrders: 'Pedidos',
    deleteWorkspace: 'Remover',
    manageCompany: 'Gerenciar Empresa',
    companyOrders: 'Pedidos',
    // entity list headers
    workspaceList: 'Áreas de Trabalho',
    folderList: 'Pastas',
    emptyReportResult: 'Relatório Vazio',
    invalidModuleConfig: 'Selecione ao menos 1 de cada: {entity}, Dimensões e Métricas',
    resultLimitLabel: 'Limite de linhas',
    all: 'Todos',
    // input errors
    requiredInput: 'Campo obrigatório',
    invalidInput: 'Valor inválido',
    greaterThanMax: 'O valor máximo é {max}',
    lessThanMin: 'O valor mínimo é {min}',
    noBudgetRemaining: 'Não há orçamento suficiente restante'
  }
}
