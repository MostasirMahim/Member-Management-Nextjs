import "./DashbaordLoader.css";

function DashboardLoader() {
  return (
    <div>
      <div className="loader_container">
        <div className="folder">
          <div className="top"></div>
          <div className="bottom"></div>
        </div>
        <div className="title">getting data ready...</div>
      </div>
    </div>
  );
}

export default DashboardLoader;
