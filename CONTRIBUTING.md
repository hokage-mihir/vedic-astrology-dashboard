# Contributing to Moon Mood

First off, thank you for considering contributing to Moon Mood! It's people like you that make this project better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** and what actually happened
- **Screenshots** if applicable
- **Environment details** (browser, OS, device)
- **Console errors** if any

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why would this feature be useful?
- **Possible implementation** if you have ideas
- **Examples** from other projects if relevant

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** on multiple browsers/devices
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit your pull request**

## Development Process

### Setup Development Environment

```bash
git clone https://github.com/hokage-mihir/vedic-astrology-dashboard.git
cd vedic-astrology-dashboard
npm install
npm run dev
```

### Coding Standards

#### JavaScript/React
- Use functional components with hooks
- Use `const` and `let`, avoid `var`
- Use descriptive variable names
- Add JSDoc comments for complex functions
- Keep components focused and reusable

#### Styling
- Use Tailwind CSS utilities first
- Follow the existing color scheme (cosmic-purple, cosmic-blue, cosmic-gold)
- Ensure responsive design (mobile-first approach)
- Maintain dark/light mode compatibility

#### Accessibility
- Always add ARIA labels to icons
- Ensure keyboard navigation works
- Respect `prefers-reduced-motion`
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(notifications): add notification settings panel
fix(calculator): correct time calculation for Rashi transitions
docs(readme): update installation instructions
```

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code runs without errors
- [ ] No console.log statements (except in error handlers)
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Tested with screen reader (if UI changes)
- [ ] Tested with `prefers-reduced-motion` enabled
- [ ] PWA still installs correctly
- [ ] Offline mode still works
- [ ] Documentation updated if needed

## Project Structure

Understanding the codebase:

```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── *.jsx         # Feature components
├── contexts/         # React contexts (global state)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and calculations
│   ├── astro-calculator.js      # Astronomy logic
│   ├── chandrashtam-calendar.js # Chandrashtam logic
│   ├── vedic-constants.js       # Shared constants
│   └── sun-calculator.js        # Sun calculations
└── data/             # Pre-calculated data files
```

## Astronomical Calculations

If contributing to calculation logic:

### Ayanamsa
We use the Lahiri ayanamsa (23.85° base). Changes to ayanamsa should be well-documented.

### Precision
- Moon position: ±5 minutes accuracy
- Sun position: ±1 minute accuracy
- Times are in local timezone

### Resources
- [Astronomia library docs](https://github.com/commenthol/astronomia)
- [SunCalc algorithms](https://github.com/mourner/suncalc)
- Traditional Vedic astronomy texts

## Documentation

When adding features:

1. **Update README.md** with user-facing changes
2. **Add JSDoc comments** for new functions
3. **Update docs/** folder if needed
4. **Add inline comments** for complex logic

## Community

- 💬 [GitHub Discussions](https://github.com/hokage-mihir/vedic-astrology-dashboard/discussions) - Ask questions, share ideas
- 🐛 [Issue Tracker](https://github.com/hokage-mihir/vedic-astrology-dashboard/issues) - Report bugs, request features
- 📧 Email - For private concerns

## Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Forever appreciated! 🙏

## Questions?

Don't hesitate to ask! Open a discussion or issue if you're unsure about anything.

---

Thank you for contributing to Moon Mood! 🌙✨
