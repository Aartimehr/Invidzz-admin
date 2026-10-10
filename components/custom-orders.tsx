"use client";

import { useState } from "react";
import { CustomOrderForm } from "@/components/custom-order-form";
import { data } from "@/lib/data";
import { sampleCustomOrders } from "@/lib/data/sample-orders";
import { customStatuses, formatPrice, type CustomOrder, type CustomStatus } from "@/lib/types";
import { useTable } from "@/lib/use-table";

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

// The Customised orders tab of the Orders page: pieces customers drew on the website's Try Customise page.
export function CustomOrders({ tabs }: { tabs: React.ReactNode }) {
  const { rows, error, save, remove } = useTable(data.customOrders);
  const [status, setStatus] = useState<CustomStatus | "all">("all");
  const [open, setOpen] = useState("");
  // undefined: form closed. null: adding a new one.
  const [editing, setEditing] = useState<CustomOrder | null | undefined>(undefined);

  const all = [...(rows ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const orders = all.filter((order) => status === "all" || order.status === status);

  async function loadSamples() {
    for (const order of sampleCustomOrders()) await save(order);
  }

  function confirmRemove(order: CustomOrder) {
    if (window.confirm(`Delete customised order ${order.id}? This cannot be undone.`)) remove(order.id);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Orders</h1>
          <p className="page-sub">{rows ? `${all.length} customised. Look at the drawing, send the customer a price on WhatsApp, then move it along.` : "Loading…"}</p>
        </div>
        <button type="button" className="button button-dark" onClick={() => setEditing(null)}>Add a customised order</button>
      </header>

      {tabs}

      {error && <p className="notice-error">{error}</p>}

      <div className="toolbar">
        <div className="chips">
          {[{ id: "all" as const, title: "All" }, ...customStatuses].map((option) => {
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
          <p>No customised orders yet. Until the database is connected, drawings reach you on WhatsApp: add each one here with its picture to keep track of it.</p>
          <button type="button" className="button button-outline" onClick={loadSamples}>Show sample customised orders</button>
        </div>
      )}
      {all.length > 0 && orders.length === 0 && <p className="empty">No customised orders with this status.</p>}

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order">
            <div className="order-row has-design">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="design-thumb" src={order.design} alt="" />
              <div>
                <strong>{order.id}</strong>
                <span className="order-dim">{dateTime.format(new Date(order.createdAt))}</span>
              </div>
              <div>
                {order.customer.name}
                <span className="order-dim">{order.customer.phone}</span>
              </div>
              <div className="order-items">{[order.garment, order.fabric, `size ${order.size}`].filter(Boolean).join(" / ")}</div>
              <div>
                <strong>{order.quote ? formatPrice(order.quote) : "No price yet"}</strong>
              </div>
              <select className={`status status-${order.status}`} value={order.status} aria-label={`Status of ${order.id}`} onChange={(event) => save({ ...order, status: event.target.value as CustomStatus })}>
                {customStatuses.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
              </select>
              <button type="button" className="order-toggle" aria-expanded={open === order.id} onClick={() => setOpen(open === order.id ? "" : order.id)}>
                {open === order.id ? "Hide" : "Details"}
              </button>
            </div>

            {open === order.id && (
              <div className="order-detail design-detail">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="design-full" src={order.design} alt={`Drawing for ${order.id}`} />
                <div>
                  <h4>Customer</h4>
                  <p>{order.customer.name}<br />{order.customer.phone}</p>
                  <h4>Piece</h4>
                  <p>{order.garment}{order.fabric ? `, ${order.fabric} fabric` : ""}, size {order.size}</p>
                  <h4>Notes</h4>
                  <p>{order.notes || "None"}</p>
                  <h4>Price told to the customer</h4>
                  <p>{order.quote ? formatPrice(order.quote) : "Not sent yet"}</p>
                </div>
                <div className="card-actions">
                  <button type="button" onClick={() => setEditing(order)}>Edit</button>
                  <a href={order.design} download={`${order.id}-drawing`}>Download drawing</a>
                  <button type="button" className="is-danger" onClick={() => confirmRemove(order)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {editing !== undefined && (
        <CustomOrderForm order={editing} takenIds={all.map((order) => order.id)} onSave={save} onClose={() => setEditing(undefined)} />
      )}
    </>
  );
}
