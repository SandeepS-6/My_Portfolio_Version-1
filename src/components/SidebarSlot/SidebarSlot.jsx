import "./SidebarSlot.css";

/*
  Empty reserved column for the future Sidebar.
  No real nav yet — only layout + fade/slide presence.
*/

function SidebarSlot({ visible }) {
  return (
    <aside
      className={`sidebar-slot${visible ? " sidebar-slot--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="sidebar-slot__inner">
        <p className="sidebar-slot__label">Sidebar</p>
        <p className="sidebar-slot__hint">Coming soon</p>
      </div>
    </aside>
  );
}

export default SidebarSlot;
