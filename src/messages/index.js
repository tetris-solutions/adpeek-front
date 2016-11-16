module.exports = {
  en: {
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
    extractReport: 'Download',
    creatingReport: 'Creating Report...',

    // date ranges
    today: 'Today',
    yesterday: 'Yesterday',
    pastWeek: 'Past week',
    currentMonth: 'Current month',
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
    adGroups: 'AdGroups',
    keywords: 'Keywords',
    adSets: 'Ad Sets',
    ads: 'Ads',
    campaignEntity: 'Campaign',
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
    moduleSize: 'Module Size',
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
    makeReportPublic: 'Share with Company',
    makeReportPublicDescription: 'Share report with your colleagues',
    favoriteReport: 'Favorite Report',
    favoriteReportDescription: 'Set report as the folder default (specifically for your user)',
    unfavoriteReport: 'Unfavorite Report',
    unfavoriteReportDescription: 'Report will stop being your favorite',
    editReport: 'Edit Report',
    editReportPromptTitle: 'Confirm report edit',
    editReportPromptBody: 'You\'re about to open the shared report <strong>{name}</strong> for editing, are you\'re sure about this?',
    cloneReport: 'Clone Report',
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
    viewFullReport: 'View Full Report',
    shareReportButton: 'Share',
    shareReportTitle: 'Share Report',
    shareReportLabel: 'Shareable URL',
    copyToClipboard: 'Copy',
    copySuccess: 'Copied to clipboard!',
    adwordsLevel: 'Adwords',
    facebookLevel: 'Facebook',
    sharedLevel: 'Shared'
  },
  'pt-BR': {
    welcomeMessage: 'Olá, {name}',
    linkCampaignsCallToAction: 'Associar',
    unlinkCampaignsCallToAction: 'Desassociar',
    nCampaigns: '{n} campanhas nesta pasta',
    nLooseCampaigns: '{n} campanhas fora da pasta',
    filterActiveOnly: 'Mostrar apenas ativas',
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
    budgetNameLabel: 'Nome do Orçamento',
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
    finalUrl: 'URL de destino',
    cloneOrders: 'Clonar Pedidos',
    cloneSingleOrder: 'Clonar PI',
    selectOrders: 'Selecionar',
    applyToSelectedOrders: 'Aplicar',
    copyOfName: 'Cópia de {name}',
    biddableKeywords: 'Palavras chaves',
    negativeKeywords: 'Palavras chaves negativas',
    notYetImplemented: 'Em construção',
    loadingAds: 'Carregando criativos...',
    loadingReport: 'Carregando relatório...',
    loadingCampaigns: 'Carregando campanhas...',
    extractReport: 'Baixar',
    creatingReport: 'Gerando Relatório...',

    // date ranges
    today: 'Hoje',
    yesterday: 'Ontém',
    pastWeek: 'Semana passada',
    currentMonth: 'Mês atual',
    pastMonth: 'Mês passado',
    nextWeek: 'Próxima semana',
    nextMonth: 'Próximo mês',
    nextSemester: 'Próximo semestre',
    nextYear: 'Próximo ano',

    orderRangeTitle: 'Período do Pedido',
    reportBuilder: 'Criação de Relatórios',
    dateRangeLabel: 'de {startDate} até {endDate}',
    reportRangeTitle: 'Intervalo do relatório',
    campaigns: 'Campanhas',
    placementLevel: 'Placement',
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
    totalChart: 'Total',
    metrics: 'Métricas',
    dimensions: 'Dimensões',
    module: 'Módulo',
    invalidAttributePermutation: 'Erro - {inserted} não pode ser selecionado junto com {list}',
    filterLabel: 'Filtrar',
    moduleContent: 'Configurar Relatório',
    moduleSize: 'Configurar Tamanho',
    filterModuleResult: 'Filtrar Resultado',
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
    reportAccessControl: 'Controle de Acesso',
    makeReportGlobal: 'Compartilhar Globalmente',
    makeReportGlobalDescription: 'Compartilhar relatório para todas empresas',
    makeReportPublic: 'Compartilhar com Empresa',
    makeReportPublicDescription: 'Compartilhar relatório com colegas de trabalho',
    favoriteReport: 'Favoritar Relatório',
    favoriteReportDescription: 'Seleciona relatório como o padrão da pasta (apenas para seu usuário)',
    unfavoriteReport: 'Desfavoritar Relatório',
    unfavoriteReportDescription: 'Relatório deixará de ser seu favorito',
    editReport: 'Editar Relatório',
    editReportPromptTitle: 'Confirmar edição de relatório',
    editReportPromptBody: 'Você está prestes a editar o relatório compartilhado <strong>{name}</strong>, tem certeza que é isso que você deseja fazer?',
    cloneReport: 'Clonar Relatório',
    deleteReport: 'Remover Relatório',
    checkDefaultReport: 'Fazer Padrão',
    checkDefaultReportDescription: 'Seleciona relatório como padrão',
    uncheckDefaultReport: 'Desfazer Padrão',
    uncheckDefaultReportDescription: 'Relatório deixará de ser o padrão',
    editOrder: 'Editar Ordem',
    autoBudgetLog: 'Histórico AutoBudget',
    deleteOrder: 'Remover Ordem',
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
    companyList: 'Empresas',
    emptyReportResult: 'Relatório Vazio',
    invalidModuleConfig: 'Selecione ao menos 1 de cada: {entity}, Dimensões e Métricas',
    resultLimitLabel: 'Limite de linhas',
    all: 'Todos',
    // input errors
    requiredInput: 'Campo obrigatório',
    invalidInput: 'Valor inválido',
    greaterThanMax: 'O valor máximo é {max}',
    lessThanMin: 'O valor mínimo é {min}',
    noBudgetRemaining: 'Não há orçamento suficiente restante',
    refreshCampaigns: 'Atualizar campanhas',
    takenCampaign: 'A campanha já foi associada a uma pasta',
    openFolderName: 'Abrir pasta "{name}"',
    doNotAskAgain: 'Não perguntar novamente',
    manuallyRunAutoBudget: 'Executar Auto-Budget',
    spawnAutoBudgetPromptTitle: 'Confirmar execução',
    spawnAutoBudgetPromptBody: `Você está prestes a executar manualmente o Auto Budget.<br/>
        A rotina será iniciada agora e ao término da execução você e seu time receberão um email informando dos novos orçamentos.<br/>
        Deseja prosseguir?`,
    dashCampaignLabel: 'Campanha Dash',
    errorScreenTitle: 'Ops... encontramos um erro!',
    errorScreenBody: `
      Não foi possível exibir a tela que você estava tentando acessar.<br/>
      Você pode contatar o suporte ou tentar novamente mais tarde.`,
    errorScreenAuthTitle: 'Acesso Negado',
    errorScreenAuthBody: `Você está tentando acessar uma área do sistema a qual seu usuário não tem acesso.<br/>
        Certifique-se que você tem a URL correta ou contate seu administrador.`,
    errorScreenExit: 'OK, voltar!',
    messageFromServer: 'Mensagem do servidor',
    pickReportTypePromptTitle: 'Escolha o formato',
    reportTypeSpreadsheet: 'Planilha',
    reportTypePdf: 'PDF',
    oneLevelUpNavigation: 'Fechar',
    containsOperator: 'Contém',
    equalsOperator: 'Igual',
    lessThanOperator: 'Menor ou igual',
    greaterThanOperator: 'Maior ou igual',
    betweenOperator: 'Entre',
    newFilter: 'Adicionar filtro',
    untitledModule: '[ módulo sem nome ] ',
    emptyAccessControlOptions: 'Infelizmente, seu usuário não tem permissões para alterar as opções de acesso deste relatório.',
    hideNCampaigns: 'Ocultar {count} campanha(s) inativa(s)',
    showNCampaigns: 'Exibir {count} campanha(s) inativa(s)',
    globalAdmin: 'Administrador geral',
    regularUser: 'Usuário regular',
    edit: 'Editar',
    companyName: 'Nome da Empresa',
    recentWorkspace: 'Áreas de Trabalho Recentes',
    faveWorkspace: 'Favoritar',
    unfaveWorkspace: 'Desfavoritar',
    faveWorkspaceList: 'Áreas de Trabalho Favoritas',
    workspaceFoldersSummary: 'Pastas',
    recentFolder: 'Pastas recentes',
    creatives: 'Criativos',
    companyReport: 'Relatório',
    workspaceReport: 'Relatório',
    viewFullReport: 'Ver Relatório Completo',
    shareReportButton: 'Compartilhar',
    shareReportTitle: 'Compartilhar Relatório',
    shareReportLabel: 'URL compartilhável',
    copyToClipboard: 'Copiar',
    copySuccess: 'Copiado para área de transferência!',
    adwordsLevel: 'Adwords',
    facebookLevel: 'Facebook',
    sharedLevel: 'Comum'
  }
}
