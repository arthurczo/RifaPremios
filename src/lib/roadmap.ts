export type RoadmapTaskStatus = 'done' | 'next' | 'pending';

export interface RoadmapTask {
  label: string;
  status: RoadmapTaskStatus;
}

export interface RoadmapPhase {
  title: string;
  items: RoadmapTask[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    title: 'Base de execução',
    items: [
      { label: 'Aplicação sobe sem dependência obrigatória de banco local', status: 'done' },
      { label: 'Fallback demo para campanhas, pedidos e roletas', status: 'done' },
    ],
  },
  {
    title: 'Dia 1',
    items: [
      { label: 'Finalizar integração MercadoPago', status: 'next' },
      { label: 'Testar pagamento real (comprar R$ 1)', status: 'pending' },
    ],
  },
  {
    title: 'Dia 2',
    items: [
      { label: 'Criar landing page de vendas', status: 'pending' },
      { label: 'Registrar domínio (rifapro.com.br ou similar)', status: 'pending' },
    ],
  },
  {
    title: 'Dia 3',
    items: [
      { label: 'Sistema de multi-tenant básico', status: 'pending' },
      { label: 'Permitir cadastro de novos clientes', status: 'pending' },
    ],
  },
  {
    title: 'Dia 4',
    items: [
      { label: 'Customização de logo/cores', status: 'pending' },
      { label: 'Testes com 2 tenants diferentes', status: 'pending' },
    ],
  },
  {
    title: 'Dia 5',
    items: [
      { label: 'Publicar landing page', status: 'pending' },
      { label: 'Começar divulgação', status: 'pending' },
    ],
  },
  {
    title: 'Final de semana',
    items: [
      { label: 'Prospectar primeiros 10 leads', status: 'pending' },
      { label: 'Fazer 3 demonstrações', status: 'pending' },
    ],
  },
];
