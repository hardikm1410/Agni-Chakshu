export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="hero-overlay"></div>
      
      <div className="hero-container">
        <h1 className="hero-title">
          Welcome to <span className="text-thermal">Thermoscope AI</span>
        </h1>
        
        <p className="hero-description">
          Your advanced thermal imaging and analytics dashboard. This platform is configured 
          with high-performance tracking, intelligent alerting, and real-time data visualization 
          to keep your critical infrastructure safe.
        </p>
        
        <div className="features-grid">
          <div className="feature-card tracking">
            <h3 className="feature-title">Thermal Tracking</h3>
            <p className="feature-desc">
              Real-time heat signatures and anomaly detection across all registered sensor nodes. 
              Identify hotspots before they escalate.
            </p>
          </div>
          
          <div className="feature-card analytics">
            <h3 className="feature-title">Analytics Engine</h3>
            <p className="feature-desc">
              Deep predictive insights driven by AI to monitor thermal thresholds and trends. 
              Optimize performance with actionable data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
