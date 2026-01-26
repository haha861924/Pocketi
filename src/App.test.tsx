import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('應該渲染 Pocketit 標題', () => {
    render(<App />)

    // 檢查主標題是否存在
    const heading = screen.getAllByText(/POCKETIT/i)
    expect(heading.length).toBeGreaterThan(0)
  })

  it('應該渲染導覽列', () => {
    render(<App />)

    // 檢查導覽連結 - 使用 getAllByRole 來找到所有連結
    const links = screen.getAllByRole('link')
    const linkTexts = links.map(link => link.textContent)

    expect(linkTexts).toContain('功能')
    expect(linkTexts).toContain('使用方式')
    expect(linkTexts).toContain('聯絡')
  })

  it('應該渲染 Hero Section', () => {
    render(<App />)

    // 檢查副標題
    expect(screen.getByText('你的生活收藏管家')).toBeInTheDocument()

    // 檢查 CTA 按鈕
    expect(screen.getByText('開始使用')).toBeInTheDocument()
  })

  it('應該渲染六大核心功能', () => {
    render(<App />)

    // 檢查功能標題
    expect(screen.getByText('願望清單')).toBeInTheDocument()
    expect(screen.getByText('電影記錄')).toBeInTheDocument()
    expect(screen.getByText('保養品 & 化妝品')).toBeInTheDocument()
    expect(screen.getByText('書籍閱讀')).toBeInTheDocument()
    expect(screen.getByText('電視劇追蹤')).toBeInTheDocument()
    expect(screen.getByText('漫畫收藏')).toBeInTheDocument()
  })

  it('應該渲染使用流程', () => {
    render(<App />)

    // 檢查步驟標題
    expect(screen.getByText('建立帳號')).toBeInTheDocument()
    expect(screen.getByText('新增項目')).toBeInTheDocument()
    expect(screen.getByText('分類管理')).toBeInTheDocument()
    expect(screen.getByText('隨時存取')).toBeInTheDocument()
  })

  it('應該渲染頁尾聯絡資訊', () => {
    render(<App />)

    // 檢查聯絡信箱
    expect(screen.getByText(/elvina861924@gmail.com/i)).toBeInTheDocument()
  })
})
