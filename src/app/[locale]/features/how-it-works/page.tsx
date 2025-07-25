import React from 'react';

const steps = [
  { number: 1, title: '粘贴原始链接', desc: '将长链接粘贴到 tinyurlai' },
  { number: 2, title: '自定义设置', desc: '选择别名、标签或域名' },
  { number: 3, title: '生成 & 分享', desc: '一键生成短链接，即可分享' },
  { number: 4, title: '查看分析', desc: '实时查看短链接效果' },
];

const HowItWorks: React.FC = () => (
  <main className="feature-page">
    <div className="container">
      <h2 className="title text-gray-800">How It Works</h2>
      <div className="steps">
        {steps.map((s) => (
          <div key={s.number} className="step-card">
            <div className="step-number">{s.number}</div>
            <h3 className="step-title text-black">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </main>
);

export default HowItWorks; 