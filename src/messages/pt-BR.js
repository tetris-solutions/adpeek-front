module.exports = {
  welcomeMessage: 'Olá, {name}',
  linkCampaignsCallToAction: 'Associar',
  unlinkCampaignsCallToAction: 'Desassociar',
  nCampaigns: '{n} campanhas nesta pasta',
  nLooseCampaigns: '{n} campanhas fora da pasta',
  filterActiveOnly: 'Mostrar apenas ativas',
  selectAll: 'Selecionar todas',
  deselectAll: 'Deselecionar todas',
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
  isPrivateComment: 'Privado',
  newCampaignHeader: 'Nova campanha',
  newCampaignCallToAction: 'Criar campanha',
  newOrderHeader: 'Novo pedido',
  newOrderCallToAction: 'Criar pedido',
  save: 'Salvar',
  cancel: 'Cancelar',
  update: 'Atualizar',
  budgetNameLabel: 'Nome do Orçamento',
  orderNameLabel: 'Nome do Pedido',
  orders: 'Pedidos',
  dayLabel: 'Dia',
  nameLabel: 'Nome',
  platformLabel: 'Plataforma',
  entityLabel: 'Tipo de relatório',
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
  investmentDayLabel: 'Meta diária',
  startDateLabel: 'Data início',
  endDateLabel: 'Data final',
  dateLabel: 'Data',
  emptyBudgetSelectionTitle: 'Nenhum orçamento selecionado',
  emptyBudgetSelectionBody: `
      <p>
        Aqui você pode dizer como os <strong>R$ {amount}</strong> do seu PI vão ser distribuídos.
      </p>
      <p>
        Cada fatia do gráfico ao lado representa um orçamento, que é uma partição do budget total do pedido.
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
  loadingCampaignDetails: 'Carregando detalhes da campanha...',
  loadingCampaignOrder: 'Carregando Pedido da campamha...',
  loadingLanguages: 'Carregando lista de linguagens...',
  loading: 'Carregando...',
  calculating: 'Calculando...',
  extractReport: 'Baixar',
  creatingReport: 'Gerando Relatório...',

  // date ranges
  today: 'Hoje',
  yesterday: 'Ontém',
  pastWeek: 'Semana passada',
  currentMonth: 'Mês atual',
  last30Days: 'Últimos 30 dias',
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
  searchLevel: 'Search Query',
  locationLevel: 'Geolocation',
  audienceLevel: 'Audiência',
  adGroups: 'Ad Groups',
  videos: 'Vídeos',
  keywords: 'Palavras chaves',
  adSets: 'Ad Sets',
  ads: 'Anúncios',
  campaignEntity: 'Campanha',
  adEntity: 'Anúncio',
  adGroupEntity: 'Ad Group',
  videoEntity: 'Vídeo',
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
  setReportMediaDescription: 'Defina uma mídia para esse report',
  setReportMedia: 'Selecionar',
  makeReportPublic: 'Compartilhar com Empresa',
  makeReportPublicDescription: 'Compartilhar relatório com colegas de trabalho',
  favoriteReport: 'Favoritar',
  favoriteReportDescription: 'Seleciona relatório como o padrão da pasta (apenas para seu usuário)',
  unfavoriteReport: 'Desfavoritar',
  unfavoriteReportDescription: 'Relatório deixará de ser seu favorito',
  editReport: 'Editar Relatório',
  editReportPromptTitle: 'Confirmar edição de relatório',
  editReportPromptBody: 'Você está prestes a editar o relatório compartilhado <strong>{name}</strong>, tem certeza que é isso que você deseja fazer?',
  cloneReport: 'Clonar Relatório',
  cloneModule: 'Clonar Módulo',
  deleteReport: 'Remover Relatório',
  checkDefaultReport: 'Fazer Padrão',
  checkDefaultReportDescription: 'Seleciona relatório como padrão',
  uncheckDefaultReport: 'Desfazer Padrão',
  uncheckDefaultReportDescription: 'Relatório deixará de ser o padrão',
  editOrder: 'Editar Pedido',
  autoBudgetLog: 'Histórico AutoBudget',
  deleteOrder: 'Remover Pedido',
  folderOrders: 'Pedidos da pasta',
  folderReport: 'Relatório da pasta',
  editFolder: 'Editar Pasta',
  deleteFolder: 'Remover Pasta',
  editWorkspace: 'Editar área',
  workspaceOrders: 'Pedidos da área',
  deleteWorkspace: 'Remover área',
  manageCompany: 'Gerenciar Empresa',
  companyOrders: 'Pedidos da empresa',
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
  notEqualsOperator: 'Diferente',
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
  workspaceReport: 'Relatório da área',
  viewFullReport: 'Mais opções',
  shareReportButton: 'Compartilhar',
  shareReportTitle: 'Compartilhar Relatório',
  shareReportLabel: 'URL compartilhável',
  copyToClipboard: 'Copiar',
  copySuccess: 'Copiado para área de transferência!',
  adwordsLevel: 'Adwords',
  facebookLevel: 'Facebook',
  analyticsLevel: 'Analytics',
  sharedLevel: 'Comum',
  tooManyAccounts: 'O máximo de contas é {max}, você selecionou {selected}',
  calculateKeywordsRelevance: 'Calcular relevância',
  calculateAdsKPI: 'Calcular {kpi}',
  reportMailing: 'Agendamento',
  newMailing: 'Novo agendamento',
  mailingRangeLabel: 'Período do relatório',
  mailingEnabledSwitch: 'Ativo',
  mailingRecurrentSwitch: 'Recorrente',
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  dayOfWeekLabel: 'Dia da semana',
  dayOfMonthLabel: 'Dia do mês',
  periodicityLabel: 'Periodicidade',
  reportMailingFormTitle: 'Agendamento relatório {report}',
  newEmailLabel: 'Novo email',
  disableMailing: 'Desligar',
  enableMailing: 'Ligar',
  mailingReportLink: 'Abrir Relatório',
  unsubscriptionTitle: 'Desassinar Relatório',
  unsubscriptionBody: 'Ok <strong>{email}</strong>, nós te removemos do relatório <em>{report}</em>.',
  newCommentPlaceholder: 'Escreva seu comentário',
  newCommentButton: 'Enviar',
  commentDescription: 'Comentário de {user}',
  moduleDescriptionTitle: 'Descrição do Módulo',
  moduleDescriptionPlaceholder: 'Escreva uma descrição para este módulo',
  reportDescriptionPlaceholder: 'Escreva uma descrição para seu relatório',
  croppedResultAlertTitle: 'Resultado incompleto',
  croppedResultAlertBody: `
        O resultado de <strong>{module}</strong> é muito extenso e por questões de performance foi limitado.
        Você está visualizando apenas as primeiras 1.000 linhas do total de <strong>{size}</strong>.`,
  spawnMailing: 'Enviar agora',
  saveAndRun: 'Salvar & Enviar',
  unsubscribedEmail: 'Usuário saiu da lista',
  emptyMailing: 'Sua lista de emails está vazia',
  kpiGoalLabel: 'Meta KPI',
  kpiGoalMetricTitle: 'Meta - {metric}',
  kpiGoalMetricResult: '{currentValue} de {goal}',
  privateReportTooltip: 'Apenas você pode ver este relatório',
  companyReportTooltip: 'Relatório compartilhado com seus colegas de trabalho',
  globalReportTooltip: 'Esse é um relatório padrão do Manager',
  createdByName: 'Criado por <strong>{name}</strong>',
  updatedTimeAgo: 'Modificado {timeago}',
  notFoundTitle: 'Não encontrado!',
  notFoundBody: 'O objeto que você está tentando acessar não existe ou não é acessível para o seu usuário.',
  rolesLabel: 'Grupos',
  leaveOrderPrompt: 'Você tem alterações não salvas no Pedido, tem certeza que deseja sair?',
  newDashCampaign: 'Nova Campanha Dash',
  enabledFilterLabel: 'Ativo',
  enabledOrPausedFilterLabel: 'Ativo ou Pausado',
  allFilterLabel: 'Todos',
  noActiveOrder: 'Não há pedidos ativos',
  lastActiveOrder: 'Último pedido ativo',
  moduleIndexLabel: 'Índice',
  loadSearchTerms: 'Carregar Termos Pesquisados',
  searchTerms: 'Termos Pesquisados',
  expiredReportTitle: 'Acesso Expirado',
  expiredReportBody: `
    Oops, seu acesso ao report <code>{report}</code> não é válido.
    Isso acontece quando você tenta abrir um relatório utilizando um guest token expirado.`,
  selectIdDimension: 'Selecionar {entity}',
  missingIdAlert: 'Alguns atributos só podem ser adicionados <br/>' +
  'ao módulo após a seleção da dimensão <em>{entity}</em>.',
  invalidPermutation: 'Ooops, você não pode selecionar <strong>{first}</strong> e <strong>{second}</strong> ao mesmo tempo',
  gaPropertyLabel: 'Selecione a Propriedade GA',
  gaViewLabel: 'Selecione a View GA',
  gaSegmentLabel: 'Selecione o Segmento GA',
  newGASegmentLabel: 'Novo Segmento',
  gaSegmentDefinitionLabel: 'Definição Segmento GA',
  analyticsFolderTitle: 'Pasta GA "{name}"',
  analyticsFolderDescription: 'Pastas do Google Analytics não possuem campanhas, seu uso é predominantemente para extração de relatórios',
  hideWorkspace: 'Ocultar Área',
  showWorkspace: 'Exibir Área',
  hideFolder: 'Ocultar Pasta',
  showFolder: 'Exibir Pasta',
  tooManyMetrics: 'Por favor, selecione até {limit} métricas <strong>GA</strong>, você selecionou {selected}',
  tooManyDimensions: 'Por favor, selecione até {limit} dimensões <strong>GA</strong>, você selecionou {selected}',
  loadingEntity: 'Carregando {name}...',
  campaignDetailsTitle: 'Detalhes da campanha',
  targetNetworks: 'Redes de Campanha',
  googleSearchNetwork: 'Google Search',
  searchNetwork: 'Pesquisa',
  contentNetwork: 'Display',
  partnerNetwork: 'Parceiro',
  targetLocation: 'Segmentação Geográfica',
  targetLanguage: 'Idioma de destino',
  conversionTracker: 'Tag de conversão ativa',
  extensions: 'Extensões',
  siteLinks: 'SiteLinks',
  callOut: 'Frase de Destaque',
  targetService: 'Serviços',
  feedLocal: 'Local',
  targetApp: 'Aplicativos',
  targetNotSetForCampaign: 'Não possui',
  targetAudience: 'Público alvo',
  biddingConfiguration: 'Opção de lance',
  optimizationStatus: 'Rotação de anúncios',
  manualCpcLabel: 'CPC Manual',
  standardDelivery: 'Padrão',
  acceleratedDelivery: 'Acelerado',
  targetCpaLabel: 'CPA de destino',
  targetRoasLabel: 'ROAS desejado',
  targetSpendLabel: 'Maximizar cliques',
  enhancedCpcLabel: 'CPC otimizado',
  targetOutrankShareLabel: 'Parcela de vitórias desejadas',
  pageOnePromotedLabel: 'Localização da página segmentada para pesquisa',
  optimizeStatusLabel: 'Otimizado',
  conversionOptimizeStatusLabel: 'Otimizado para conversões',
  rotateStatusLabel: 'Alternar uniformemente',
  rotateIndefinitelyStatusLabel: 'Alternar indefinidamente',
  feedLocalBusiness: 'do MCC {email}',
  emptyCampaignDetails: 'Esse tipo de campanha ainda não permite edição',
  campaignOrderDeliveryMethod: 'A forma de entrega dessa campanha está associada ao orçamento <strong>"{budget}"</strong> do Pedido <strong>"{order}"</strong>',
  cannotEditDeliveryMethodWithoutOrder: 'Não é possível editar a forma de entrega dessa campanha pois ela não possui um Pedido associado',
  openOrders: 'Abrir Pedidos',
  editBudget: 'Editar Orçamento',
  locationCriteria: 'Localidade',
  proximityCriteria: 'Proximidade',
  locationLabel: 'Digite uma localidade',
  locationSearchResult: 'Resultado da busca',
  campaignLocations: 'Selecionados',
  radiusInKmLabel: 'Raio em Km',
  radiusInMilesLabel: 'Raio em milhas',
  newLocation: 'Novo Local',
  closeToLocation: 'próximo de {location}',
  locationDescription: 'Localidade',
  locationType: 'Tipo',
  bidModifier: 'Ajuste de Lance',
  everyLanguage: 'Todos idiomas',
  everyLocation: 'Qualquer localização',
  platformCriteria: 'Dispositivos',
  desktopDevice: 'Computadores',
  highEndMobileDevice: 'Smartphones',
  tabletDevice: 'Tablets',
  deviceDescription: 'Dispositivo'
}
