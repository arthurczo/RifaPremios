import { getOrders } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export default async function AdminPedidosPage() {
  const orders = getOrders().slice(0, 30);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-slate-400">Consulta rapida de pedidos criados pela aplicacao.</p>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{order.code}</h2>
                  <p className="text-sm text-slate-400">
                    {order.user.name} - {order.campaign?.name}
                  </p>
                </div>
                <div className="text-sm text-slate-300">
                  {order.status} - {order.quantity} numeros - R$ {order.totalAmount.toFixed(2)}
                </div>
              </div>
            </article>
          ))}
          {orders.length === 0 ? <p className="text-slate-400">Nenhum pedido encontrado.</p> : null}
        </div>
      </div>
    </main>
  );
}
