import { dateTimeFmt } from '../utils/format.js';

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const LABELS = { Pending: 'Order Placed' };

export default function OrderTimeline({ order }) {
  if (order.orderStatus === 'Cancelled') {
    return <div className="notice notice-error">This order was cancelled. Any stock was returned and no further updates will follow.</div>;
  }
  const current = STEPS.indexOf(order.orderStatus);
  const at = (s) => order.statusHistory?.find((h) => h.status === s)?.at;

  return (
    <ol className="timeline">
      {STEPS.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li key={s} className={`tl-step ${state}`}>
            <span className="tl-dot">{i < current ? '✓' : ''}</span>
            <div>
              <strong>{LABELS[s] || s}</strong>
              {at(s) ? <p className="small muted">{dateTimeFmt(at(s))}</p> : state === 'todo' ? <p className="small muted">Upcoming</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
