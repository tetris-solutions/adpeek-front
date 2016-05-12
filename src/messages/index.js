export default {
  en: {
    welcomeMessage: 'Hey, {name}',
    linkCampaignsCallToAction: 'Link selected',
    unlinkCampaignsCallToAction: 'Unlink selected',
    budgetCampaigns: 'Budget campaigns',
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
    editFolderHeader: 'Edit folder',
    editBudgetHeader: 'Edit budget',
    newFolderCallToAction: 'Create folder',
    newOrderHeader: 'New order',
    newOrderCallToAction: 'Create order',
    newCampaignHeader: 'New campaign',
    newCampaignCallToAction: 'Create campaign',
    saveCallToAction: 'Save',
    budgetNameLabel: 'Budget name',
    nameLabel: 'Name',
    orderNameLabel: 'Order name',
    mediaLabel: 'Media',
    tagLabel: 'Tag',
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
    budgetWithoutCampaigns: `
    <p>
        You still did not include any campaign in this budget. To remedy that, select some of those campaigns in the list below and click on "Link Selected".
    </p>`,
    newOrderName: '{month}',
    deliveryMethodLabel: 'Delivery method',
    closeBudget: 'Close'
  },
  'pt-BR': {
    welcomeMessage: 'Olá, {name}',
    linkCampaignsCallToAction: 'Associar',
    unlinkCampaignsCallToAction: 'Desassociar',
    budgetCampaigns: 'Campanhas neste orçamento',
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
    editFolderHeader: 'Editar pasta',
    editBudgetHeader: 'Editar orçamento',
    newFolderCallToAction: 'Criar pasta',
    newCampaignHeader: 'Nova campanha',
    newCampaignCallToAction: 'Criar campanha',
    newOrderHeader: 'Nova ordem',
    newOrderCallToAction: 'Criar ordem',
    saveCallToAction: 'Salvar',
    budgetNameLabel: 'Nome do orçamento',
    orderNameLabel: 'Nome do Pedido',
    nameLabel: 'Nome',
    mediaLabel: 'Pilar de mídia',
    tagLabel: 'Tag',
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
    budgetWithoutCampaigns: `
    <p>
        Você ainda não incluiu nenhuma campanha neste orçamento, pra fazer isso você só precisa selecionar alguma das campanhas na lista abaixo e clicar em "Associar".
    </p>`,
    newOrderName: 'PI de {month}',
    deliveryMethodLabel: 'Forma de entrega',
    closeBudget: 'Fechar'
  }
}
