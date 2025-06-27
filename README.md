# 🔴⚫ Othello Game

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?style=for-the-badge&logo=github)](https://salujayatharth.github.io/othello/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A modern, responsive implementation of the classic Othello (Reversi) board game with beautiful animations and dark mode support.

## 🎮 Play Now

**[🚀 Live Demo](https://salujayatharth.github.io/othello/)**

## ✨ Features

- 🎯 **Classic Othello Gameplay** - Full implementation of traditional Othello rules
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Automatic dark/light theme adaptation
- 💡 **Move Hints** - Toggle-able valid move indicators for beginners
- ⚡ **Smooth Animations** - Fluid piece placement and flipping animations
- 🎨 **Modern UI** - Clean, professional interface built with Tailwind CSS
- 🔄 **New Game** - Quick restart functionality
- 📊 **Live Score Tracking** - Real-time score updates for both players
- 🎪 **Turn Indicators** - Clear visual indication of current player

## 🎯 How to Play

Othello (also known as Reversi) is a strategy board game for two players. Here's how to play:

### Objective
Have the majority of your colored pieces on the board when the game ends.

### Rules
1. **Starting Position**: The game begins with 4 pieces in the center - two black and two white arranged diagonally
2. **Taking Turns**: Black always goes first, then players alternate turns
3. **Valid Moves**: You must place your piece adjacent to an opponent's piece, with at least one of your pieces on the opposite side (horizontally, vertically, or diagonally)
4. **Capturing**: All opponent pieces between your new piece and existing piece get flipped to your color
5. **Passing**: If you have no valid moves, your turn is skipped
6. **Game End**: When the board is full or no valid moves exist for either player
7. **Winner**: Player with the most pieces on the board wins

### Controls
- **Click** any highlighted cell to place your piece
- **New Game** button to restart
- **Show valid moves** checkbox to toggle move hints

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Fonts**: Inter (Google Fonts)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🚀 Local Development

### Prerequisites
- A modern web browser
- Basic web server (optional, for local development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/salujayatharth/othello.git
   cd othello
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # or
   npx serve .
   ```

3. **Access the game**
   - Direct file: `file:///path/to/othello/index.html`
   - Local server: `http://localhost:8000`

### Development Notes
- No build process required - it's a pure client-side application
- All game logic is contained in `index.html`
- Responsive design works on all screen sizes
- Dark mode adapts to system preferences automatically

## 📁 Project Structure

```
othello/
├── index.html          # Complete game implementation
├── README.md          # This file
└── .github/
    └── workflows/
        └── static.yml # GitHub Pages deployment
```

## 🎨 Design Features

- **Color Scheme**: Professional green game board with contrasting pieces
- **Typography**: Inter font family for clean, modern text
- **Animations**: CSS keyframes for smooth piece placement
- **Responsive Grid**: CSS Grid for perfect board scaling
- **Hover Effects**: Interactive feedback for better UX
- **Theme Support**: Automatic dark/light mode detection

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions
- 🤖 AI opponent implementation
- 📊 Game statistics and history
- 🔊 Sound effects
- 🎵 Background music
- 🏆 Achievement system
- 💾 Save/load game state
- 🌐 Multiplayer support
- 📱 PWA (Progressive Web App) features

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Classic Othello game rules and design inspiration
- Tailwind CSS for the excellent utility-first framework
- Google Fonts for the beautiful Inter typeface
- GitHub Pages for free hosting

---

<div align="center">

**Enjoy playing Othello! 🎮**

[⭐ Star this repo](https://github.com/salujayatharth/othello) if you found it helpful!

</div>