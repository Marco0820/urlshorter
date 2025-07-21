import React from 'react';
import { Settings, VenetianMask } from 'lucide-react';

const CustomLinks: React.FC = () => (
  <main className="feature-page">
    <div className="container">
      <h2 className="title text-gray-800">Custom Links</h2>
      <p className="subtitle">
        在 tinyurlai 上创建完全自定义的短链接，让品牌形象随链接传播。
      </p>
      <div className="features">
        <div className="feature-card">
          <Settings className="feature-icon" />
          <h3 className="feature-title text-black">自定义后缀</h3>
          <p className="feature-desc">
            使用你喜欢的关键词作为短链接后缀，提升可读性。
          </p>
        </div>
        <div className="feature-card">
          <VenetianMask className="feature-icon" />
          <h3 className="feature-title text-black">设置别名</h3>
          <p className="feature-desc">
            创建有意义的别名，方便记忆和识别。
          </p>
        </div>
      </div>
      <button className="cta-button">立即创建自定义链接</button>
    </div>
  </main>
);

export default CustomLinks; 