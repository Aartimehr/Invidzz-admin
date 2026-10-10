"use client";

import { useState } from "react";
import { CustomOrders } from "@/components/custom-orders";
import { data } from "@/lib/data";
import { sampleOrders } from "@/lib/data/sample-orders";
import { formatPrice, orderStatuses, type Order, type OrderStatus } from "@/lib/types";
import { useTable } from "@/lib/use-table";

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

const tabList = [
  { id: "shop", title: "Orders" },
  { id: "custom", title: "Customised orders" },
] as const;

export default function OrdersPage() {
  const [tab, setTab] = useState<(typeof tabList)[number]["id"]>("shop");

  const tabs = (
    <div className="tabs" role="tablist">
      {tabList.map((option) => (
        <button key={option.id} type="button" role="tab" aria-selected={tab === option.id} className={tab === option.id ? "tab is-current" : "tab"} onClick={() => setTab(option.id)}>{option.title}</button>
      ))}
    </div>
  );

  return tab === "shop" ? <ShopOrders tabs={tabs} /> : <CustomOrders tabs={tabs} />;
}

// Orders for pieces from the catalogue, placed through the website's checkout.
function ShopOrders({ tabs }: { tabs: React.ReactNode }) {
  const { rows, error, save, remove } = useTable(data.orders);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState("");

  const all = [...(rows ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const orders = all.filter((order) => status === "all" || order.status === status);

  async function loadSamples() {
    for (const order of sampleOrders()) await save(order);
  }

  function confirmRemove(order: Order) {
    if (window.confirm(`Delete order ${order.id}? This cannot be undone.`)) remove(order.id);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Orders</h1>
          <p className="page-sub">{rows ? `${all.length} received. Check the payment in your UPI app, then move the order along.` : "Loading…"}</p>
        </div>
      </header>

      {tabs}

      {error && <p className="notice-error">{error}</p>}

      <div className="toolbar">
        <div className="chips">
          {[{ id: "all" as const, title: "All" }, ...orderStatuses].map((option) => {
            const count = option.id === "all" ? all.length : all.filter((order) => order.status === option.id).length;
            return (
              <button key={option.id} type="button" className={status === option.id ? "chip is-current" : "chip"} onClick={() => setStatus(option.id)}>
                {option.title} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {rows && all.length === 0 && (
        <div className="empty">
          <p>No orders yet. Orders placed on the website will be listed here once the database is connected.</p>
          <button type="button" className="button button-outline" onClick={loadSamples}>Show sample orders</button>
        </div>
      )}
      {all.length > 0 && orders.length === 0 && <p className="empty">No orders with this status.</p>}

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order">
            <div className="order-row">
              <div>
                <strong>{order.id}</strong>
                <span className="order-dim">{dateTime.format(new Date(order.createdAt))}</span>
              </div>
              <div>
                {order.customer.name}
                <span className="order-dim">{order.customer.city} · {order.customer.phone}</span>
              </div>
              <div className="order-items">{order.items.map((item) => `${item.name} / ${item.size} × ${item.quantity}`).join(", ")}</div>
              <div>
                <strong>{formatPrice(order.total)}</strong>
                <span className="order-dim">{order.paidWith}</span>
              </div>
              <select className={`status status-${order.status}`} value={order.status} aria-label={`Status of ${order.id}`} onChange={(event) => save({ ...order, status: event.target.value as OrderStatus })}>
                {orderStatuses.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
              </select>
              <button type="button" className="order-toggle" aria-expanded={open === order.id} onClick={() => setOpen(open === order.id ? "" : order.id)}>
                {open === order.id ? "Hide" : "Details"}
              </button>
            </div>

            {open === order.id && (
              <div className="order-detail">
                <div>
                  <h4>Deliver to</h4>
                  <p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.city} {order.customer.pincode}<br />{order.customer.phone}</p>
                </div>
                <div>
                  <h4>Items</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}><span>{item.name} / {item.size} × {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></li>
                    ))}
                    <li><span>Delivery</span><span>{order.shipping ? formatPrice(order.shipping) : "Free"}</span></li>
                    <li className="order-total"><span>Amount to match in UPI</span><span>{formatPrice(order.total)}</span></li>
                  </ul>
                </div>
                <div className="card-actions">
                  <button type="button" className="is-danger" onClick={() => confirmRemove(order)}>Delete order</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
