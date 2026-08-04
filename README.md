# 🎰 RifaPremios

Plataforma web completa de rifas/sorteios online com sistema de gamificação por roletas, construída com **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM** e **MySQL**.

> Projeto pessoal desenvolvido como estudo aprofundado de arquitetura full-stack moderna, migrando um sistema legado em PHP para uma stack JavaScript/TypeScript de mercado.

---

## 📌 Sobre o Projeto

O RifaPremios nasceu da necessidade de modernizar um sistema de rifas online que originalmente rodava em PHP procedural legado. A proposta foi reconstruir a solução do zero, aplicando padrões atuais de desenvolvimento web: componentização, tipagem estática, ORM, autenticação por sessão via cookies, proteção de rotas via middleware e uma camada de API RESTful própria.

O grande diferencial da plataforma é o **sistema de "Roletas Instantâneas"**: a cada compra de bilhetes acima de determinados patamares (100, 200, 300 unidades), o cliente ganha giros em uma roleta de prêmios (descontos percentuais, números grátis, etc.), com sorteio ponderado por probabilidade e histórico de giros persistido no banco.

---

## 🚀 Stack Utilizada

**Frontend**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- Framer Motion (animações da roleta)

**Backend**
- Next.js API Routes (arquitetura modular, separada por domínio: `auth`, `orders`, `roleta`)
- Prisma ORM
- MySQL

**Infraestrutura & Ferramentas**
- Middleware de autenticação e proteção de rotas
- Sistema de cookies HTTP-only para sessão
- Versionamento com Git/GitHub

---

## ✨ Funcionalidades Implementadas

### Autenticação e Segurança
- Sistema de login/logout com validação de credenciais
- Sessão via cookie `httpOnly` (proteção contra XSS)
- Middleware do Next.js protegendo rotas `/dashboard/*` com redirecionamento automático para login
- Redirecionamento inteligente (usuário logado não acessa `/auth/login` novamente)

### Gestão de Campanhas
- Listagem de campanhas ativas na home
- Página de detalhes por campanha (via slug dinâmico)
- Exibição de preço por bilhete, quantidade disponível e status (com/sem roleta habilitada)

### Sistema de Pedidos
- Criação de pedidos com validação de quantidade e campanha
- Cálculo automático de roletas ganhas com base em regras configuráveis por campanha (ex.: `{"100":1,"200":3,"300":9}`)
- Listagem de pedidos via API

### Sistema de Roletas (Gamificação)
- Componente visual de roleta animada (Framer Motion)
- Sorteio de prêmios ponderado por probabilidade (weighted random)
- Persistência de giros disponíveis, usados e histórico completo por usuário
- Painel "Minhas Roletas" com contadores em tempo real, faixas de prêmio e histórico dos últimos giros

### Painel Administrativo
- Área `/dashboard/admin` para gestão de campanhas
- Estrutura preparada para CRUD completo (criação, edição, listagem)

### Modelagem de Dados (Prisma)
- Modelos relacionais completos: `User`, `Campaign`, `Order`, `Prize`, `CustomerRoleta`, `RoletaSpin`
- Uso de enums (`CampaignStatus`, `OrderStatus`, `PrizeType`) para consistência de estado
- Relacionamentos 1:N corretamente mapeados (usuário → pedidos → roletas → giros)
- Campos `Json` para regras dinâmicas (ex.: regras de roleta por campanha)

---

## 🗂️ Estrutura do Projeto

```
RifaPremios/
├── prisma/
│   └── schema.prisma          # Modelagem completa do banco
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── admin/campanhas/
│   │   │   └── minhas-roletas/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── pedidos/
│   │   │   └── roleta/
│   │   ├── auth/login/
│   │   ├── campanha/[slug]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── campanha/
│   │   ├── roleta/
│   │   └── ui/
│   ├── modules/
│   │   ├── auth/
│   │   └── orders/
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env
└── package.json
```

---

## 🧠 Decisões Técnicas e Aprendizados

- **Migração de arquitetura:** o projeto começou como um sistema PHP procedural legado e foi totalmente reprojetado em uma stack moderna, exigindo entendimento de ambos os paradigmas (imperativo vs. componentizado/declarativo).
- **App Router do Next.js:** uso de route groups (`(dashboard)`) para organizar rotas autenticadas sem afetar a URL pública.
- **Separação em módulos (`/modules`):** lógica de negócio (ex.: `createOrderForCurrentUser`, `listOrders`) isolada das rotas de API, aproximando o projeto de uma arquitetura em camadas (service layer).
- **Modelagem de dados relacional:** aplicação prática de ORM (Prisma), incluindo geração de client, migrations (`db push`) e resolução de erros reais de configuração de datasource.
- **Debugging de ambiente real:** resolução de problemas comuns do ecossistema (paths do TypeScript, diretivas `'use client'`, hidratação SSR/CSR, configuração de Tailwind v4 com PostCSS).

---

## 🔮 Roadmap (Próximos Passos)

- [ ] Integração de pagamentos (PIX/MercadoPago) com webhooks
- [ ] CRUD administrativo completo de campanhas e prêmios
- [ ] Testes automatizados (unitários e E2E)
- [ ] Sistema de afiliados
- [ ] Deploy em produção (Vercel + banco gerenciado)

---

## 👤 Autor

**Arthur Cruz Oliveira**
Estudante de Engenharia de Software — Jala University
[GitLab](https://gitlab.com/ArthurCzo) · [GitHub](https://github.com/arthurczo)

---

## 📝 Licença

Projeto pessoal para fins de estudo e portfólio. Uso comercial do código requer autorização do autor.
