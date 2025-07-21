import React from 'react';

const LinkAnalytics: React.FC = () => (
  <main className="feature-page">
    <div className="container">
      <h2 className="title text-gray-800">Link Analytics</h2>
      <p className="subtitle">
        通过 tinyurlai 实时跟踪短链接表现：点击量、地域分布、来源渠道。
      </p>
      <div className="charts">
        <div className="w-full max-w-2xl h-96 bg-gray-200 flex items-center justify-center rounded-lg mx-auto">
          <p className="text-gray-500">Analytics Chart Placeholder</p>
        </div>
      </div>
      <button className="cta-button">查看详细统计</button>
    </div>
  </main>
);

export default LinkAnalytics;