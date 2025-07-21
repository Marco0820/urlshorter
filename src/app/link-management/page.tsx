import React from 'react';
import { Settings, Tag, FilePenLine } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: '短链接管理',
    description: '通过强大的搜索、过滤和标签功能，快速查找并管理大量短链接。',
    icon: <Settings className="w-12 h-12 mx-auto mb-4 text-tinyurl-blue" />,
  },
  {
    title: '自定义标签',
    description: '为链接添加标签分类，轻松组织不同类型链接。',
    icon: <Tag className="w-12 h-12 mx-auto mb-4 text-tinyurl-blue" />,
  },
  {
    title: '链接编辑',
    description: '实时修改目标 URL，应对突发情况，一键危机控制。',
    icon: <FilePenLine className="w-12 h-12 mx-auto mb-4 text-tinyurl-blue" />,
  },
];

const LinkManagementPage: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-5">Short Link Management</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          在 tinyurlai 上管理成千上万条短链接：强大的搜索、筛选、标签和编辑功能。
        </p>
        <div className="flex gap-8 justify-center flex-wrap">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-lg w-full sm:w-80 shadow-lg text-center">
              {f.icon}
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
        <Link href="/" passHref>
          <button className="mt-12 py-3 px-8 bg-tinyurl-blue text-white text-lg font-semibold rounded-lg shadow-md hover:bg-tinyurl-dark transition-colors">
            立即试用 tinyurlai 管理功能
          </button>
        </Link>
      </div>
    </section>
  );
};

export default LinkManagementPage; 