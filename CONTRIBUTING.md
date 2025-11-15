# Contributing Guide

## Development Process

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Run tests and linters:
```bash
pnpm test
pnpm lint
pnpm format
```

4. Commit your changes:
```bash
git commit -m "feat: add new feature"
```

5. Push and create a pull request

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Request review from team members
5. Address review feedback
6. Merge after approval

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write unit tests for business logic
- Write integration tests for APIs
- Aim for >80% code coverage
- Test edge cases and error handling
