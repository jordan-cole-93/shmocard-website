// review-cart.jsx — slide-in cart drawer
const { useEffect: useEffectC } = React;

function ReviewCart({ open, items, onClose, onRemove, onQty }) {
  useEffectC(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const FREE_SHIP_THRESHOLD = 55;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const qualified = subtotal >= FREE_SHIP_THRESHOLD;

  return (
    <>
      <div
        className={`cart-scrim${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      ></div>
      <aside
        className={`cart-drawer${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-label="Cart"
      >
        <header className="cart-drawer__head">
          <div className="cart-drawer__title">Your cart</div>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </header>

        <div className={`cart-ship-bar${qualified ? ' is-qualified' : ''}`}>
          <div className="cart-ship-bar__msg">
            {qualified ? (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6, verticalAlign:'-3px'}}><polyline points="20 6 9 17 4 12"/></svg>
                You unlocked free shipping
              </>
            ) : (
              <>Add <b>${remaining.toFixed(2)}</b> more for free shipping</>
            )}
          </div>
          <div className="cart-ship-bar__track">
            <div className="cart-ship-bar__fill" style={{width: `${progressPct}%`}}></div>
          </div>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 && (
            <div className="cart-empty">
              <div className="cart-empty__icon">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h3l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21.6 9H6.6"/><circle cx="9" cy="22" r="1"/><circle cx="19" cy="22" r="1"/></svg>
              </div>
              <div className="cart-empty__title">Your cart is empty</div>
              <p className="cart-empty__sub">Add a CR-80 pack to get started.</p>
              <button className="shm-btn shm-btn--primary" onClick={onClose}>Keep shopping</button>
            </div>
          )}
          {items.map((it, idx) => (
            <article className="cart-item" key={idx}>
              <div className="cart-item__thumb">
                <img src={it.art} alt="" />
              </div>
              <div className="cart-item__main">
                <div className="cart-item__name">{it.name}</div>
                <div className="cart-item__variant">{it.packLabel}</div>
                {it.gInput && (
                  <div className="cart-item__config">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4, verticalAlign:'-1px'}}><polyline points="20 6 9 17 4 12"/></svg>
                    Pre-programmed for "{it.gInput}"
                  </div>
                )}
                <div className="cart-item__row">
                  <div className="shm-qty shm-qty--sm">
                    <button className="shm-qty__btn" onClick={() => onQty(idx, it.qty - 1)} disabled={it.qty <= 1}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span className="shm-qty__val">{it.qty}</span>
                    <button className="shm-qty__btn" onClick={() => onQty(idx, it.qty + 1)}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
                    </button>
                  </div>
                  <button className="cart-item__remove" onClick={() => onRemove(idx)}>Remove</button>
                </div>
              </div>
              <div className="cart-item__price">${it.total.toFixed(2)}</div>
            </article>
          ))}
        </div>

        {items.length > 0 && (
          <footer className="cart-drawer__foot">
            <div className="cart-foot-row">
              <span>Subtotal</span>
              <span><b>${subtotal.toFixed(2)}</b></span>
            </div>
            <div className="cart-foot-row cart-foot-row--muted">
              <span>Shipping</span>
              <span>{qualified ? 'Free' : 'Calculated at checkout'}</span>
            </div>
            <button className="shm-btn shm-btn--primary shm-btn--xl cart-checkout">
              Checkout — ${subtotal.toFixed(2)}
            </button>
            <div className="cart-foot-meta">60-day returns · ships in 3 days</div>
          </footer>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { ReviewCart });
