import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 匯入圖片
import logoImg from '/pixel_logo_pocketit_1769425713926.png'
import wishlistIcon from '/pixel_icon_wishlist_1769425744100.png'
import moviesIcon from '/pixel_icon_movies_1769425758554.png'
import cosmeticsIcon from '/pixel_icon_cosmetics_1769425778309.png'
import booksIcon from '/pixel_icon_books_1769425793471.png'
import tvIcon from '/pixel_icon_tv_1769425813315.png'
import mangaIcon from '/pixel_icon_manga_1769425831198.png'

export function LandingPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const navigate = useNavigate();

  const handleCTAClick = () => {
    // 暫時導向漫畫收藏功能作為示範
    navigate('/manga');
  };

  const handleFeatureClick = (title: string) => {
    if (title === '漫畫收藏') {
      navigate('/manga');
    } else if (title === '電影記錄') {
      navigate('/movie');
    } else {
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000);
    }
  };

  const features = [
    {
      icon: wishlistIcon,
      title: '願望清單',
      description: '記錄你想要的一切,夢想不再遺忘'
    },
    {
      icon: moviesIcon,
      title: '電影記錄',
      description: '追蹤看過的電影,評分與心得一次搞定'
    },
    {
      icon: cosmeticsIcon,
      title: '保養品 & 化妝品',
      description: '管理你的美妝收藏,不再重複購買'
    },
    {
      icon: booksIcon,
      title: '書籍閱讀',
      description: '建立個人書單,記錄閱讀歷程'
    },
    {
      icon: tvIcon,
      title: '電視劇追蹤',
      description: '追劇進度一目了然,不錯過任何精彩'
    },
    {
      icon: mangaIcon,
      title: '漫畫收藏',
      description: '整理漫畫清單,掌握最新連載'
    }
  ]

  const steps = [
    {
      number: '1',
      title: '建立帳號',
      description: '快速註冊,開始你的收藏之旅'
    },
    {
      number: '2',
      title: '新增項目',
      description: '輕鬆記錄各種生活收藏'
    },
    {
      number: '3',
      title: '分類管理',
      description: '智慧分類,隨時查看與編輯'
    },
    {
      number: '4',
      title: '隨時存取',
      description: '跨裝置同步,隨時隨地使用'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* 導覽列 */}
      <nav className="bg-bg-card-light dark:bg-bg-card-dark border-b-3 border-text-light dark:border-text-dark py-6 sticky top-0 z-50 shadow-[0_4px_0_rgba(0,0,0,0.08)]">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logoImg} alt="Pocketit Logo" className="w-12 h-12 rounded-pixel-md image-pixelated" />
              <span className="font-pixel text-lg text-pixel-primary">POCKETIT</span>
            </div>
            <div className="flex gap-8">
              <a href="#features" className="font-pixel text-xs text-text-light dark:text-text-dark px-4 py-2 border-2 border-transparent rounded-pixel-sm transition-all hover:border-pixel-primary hover:text-pixel-primary hover:bg-pixel-primary/10">功能</a>
              <a href="#how-it-works" className="font-pixel text-xs text-text-light dark:text-text-dark px-4 py-2 border-2 border-transparent rounded-pixel-sm transition-all hover:border-pixel-primary hover:text-pixel-primary hover:bg-pixel-primary/10">使用方式</a>
              <a href="#contact" className="font-pixel text-xs text-text-light dark:text-text-dark px-4 py-2 border-2 border-transparent rounded-pixel-sm transition-all hover:border-pixel-primary hover:text-pixel-primary hover:bg-pixel-primary/10">聯絡</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-center relative overflow-hidden">
        <div className="container relative z-10">
          <div className="fade-in">
            <h1 className="text-4xl text-pixel-primary mb-6" style={{ textShadow: '4px 4px 0 #9C8AA5' }}>POCKETIT</h1>
            <p className="font-pixel text-xl text-text-light dark:text-text-dark mb-6">你的生活收藏管家</p>
            <p className="text-base text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto mb-12 leading-relaxed">
              統一管理願望清單、電影、書籍、保養品、電視劇、漫畫等各種生活記錄
            </p>
            <button className="pixel-button pixel-button-large" onClick={handleCTAClick}>
              開始使用
            </button>
            {showComingSoon && (
              <div className="mt-6 p-6 bg-pixel-highlight border-3 border-text-light dark:border-text-dark rounded-pixel-md font-pixel text-sm fade-in">
                🎮 即將推出!敬請期待 🎮
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 8px)'
        }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-bg-card-light dark:bg-bg-card-dark border-y-3 border-text-light dark:border-text-dark py-16">
        <div className="container">
          <h2 className="text-center mb-12 text-pixel-primary text-2xl">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="pixel-card text-center cursor-pointer fade-in hover:-translate-y-1 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleFeatureClick(feature.title)}
              >
                <img src={feature.icon} alt={feature.title} className="w-16 h-16 mx-auto mb-6 rounded-pixel-md image-pixelated" />
                <h3 className="text-lg mb-4 text-pixel-secondary">{feature.title}</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container">
          <h2 className="text-center mb-12 text-pixel-primary text-2xl">使用方式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-8 fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="w-16 h-16 mx-auto mb-6 bg-pixel-primary text-white font-pixel text-2xl flex items-center justify-center border-3 border-text-light dark:border-text-dark rounded-full shadow-pixel">
                  {step.number}
                </div>
                <h3 className="text-lg mb-4 text-text-light dark:text-text-dark">{step.title}</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pixel-primary text-white py-16 text-center border-y-3 border-text-light dark:border-text-dark">
        <div className="container max-w-2xl">
          <h2 className="text-2xl mb-6 text-white">準備好開始了嗎?</h2>
          <p className="text-base mb-12 leading-relaxed">
            立即加入 Pocketit,讓生活收藏井然有序
          </p>
          <button className="pixel-button pixel-button-large pixel-button-accent" onClick={handleCTAClick}>
            立即開始
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-bg-card-light dark:bg-bg-card-dark py-16 border-t-3 border-text-light dark:border-text-dark mt-auto">
        <div className="container">
          <div className="flex flex-wrap justify-between items-start gap-8 mb-12">
            <div className="flex items-center gap-4">
              <img src={logoImg} alt="Pocketit Logo" className="w-12 h-12 rounded-pixel-md image-pixelated" />
              <span className="font-pixel text-lg text-pixel-primary">POCKETIT</span>
            </div>
            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="text-sm mb-4 text-pixel-secondary">聯絡我們</h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  <a href="mailto:elvina861924@gmail.com" className="text-pixel-primary hover:underline">elvina861924@gmail.com</a>
                </p>
              </div>
              <div>
                <h4 className="text-sm mb-4 text-pixel-secondary">關於</h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">統一管理你的生活收藏</p>
              </div>
              <div>
                <h4 className="text-sm mb-4 text-pixel-secondary">社群媒體</h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark opacity-60">即將推出</p>
              </div>
            </div>
          </div>
          <hr className="pixel-divider" />
          <div className="text-center text-xs text-text-muted-light dark:text-text-muted-dark">
            <p className="my-2">&copy; 2026 Pocketit. All rights reserved.</p>
            <p className="font-pixel my-2">Made with ❤️ and pixels</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
