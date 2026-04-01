require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
    // Prêmios
    await prisma.prize.createMany({
        data: [
            { name: '5% OFF', type: 'DISCOUNT_PERCENT', value: 5, probability: 30, color: '#FF6B6B', active: true },
            { name: '10% OFF', type: 'DISCOUNT_PERCENT', value: 10, probability: 25, color: '#4ECDC4', active: true },
            { name: '20% OFF', type: 'DISCOUNT_PERCENT', value: 20, probability: 15, color: '#FFD93D', active: true },
            { name: '10 números grátis', type: 'FREE_NUMBERS', value: 10, probability: 20, color: '#6BCF7F', active: true },
            { name: 'Tente novamente', type: 'NONE', value: 0, probability: 10, color: '#C77DFF', active: true },
        ],
        skipDuplicates: true,
    });

    // Usuário
    const user = await prisma.user.create({
        data: {
            email: 'teste@teste.com',
            name: 'Usuário Teste',
            phone: '11999999999',
            password: 'senha123',
        },
    });

    // Campanha
    const campaign = await prisma.campaign.create({
        data: {
            name: 'Honda Civic 2020',
            slug: 'honda-civic-2020',
            description: 'Sorteio de Honda Civic 0km',
            price: 0.07,
            totalNumbers: 1000,
            roletaEnabled: true,
            roletaRules: { "100": 1, "200": 3, "300": 9 },
        },
    });

    // Pedido
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            campaignId: campaign.id,
            code: 'TEST-001',
            quantity: 100,
            totalAmount: 7.00,
            status: 'PAID',
            numbers: ['0001', '0002', '0003'],
        },
    });

    // Roletas para o usuário
    await prisma.customerRoleta.create({
        data: {
            userId: user.id,
            orderId: order.id,
            campaignId: campaign.id,
            quantity: 1,
            available: 1,
        },
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });