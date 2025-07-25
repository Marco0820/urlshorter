import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';

const BrandedDomains: React.FC = () => (
  <main className="feature-page">
    <div className="container">
      <h2 className="title text-gray-800">Branded Domains</h2>
      <p className="subtitle">
        在 tinyurlai 上使用专属域名，提升品牌识别度。
      </p>
      <div className="features">
        <div className="feature-card">
          <Globe className="feature-icon" />
          <h3 className="feature-title text-black">绑定自有域名</h3>
          <p className="feature-desc">
            使用你的域名生成短链接，更专业、更可信。
          </p>
        </div>
        <div className="feature-card">
          <ShieldCheck className="feature-icon" />
          <h3 className="feature-title text-black">增强信任感</h3>
          <p className="feature-desc">
            用户一看链接就能识别品牌来源，点击率更高。
          </p>
        </div>
      </div>
      <button className="cta-button">绑定品牌域名</button>
    </div>
  </main>
);

export default BrandedDomains; 