# Phase 11Q — Launch Freeze Rules

1. No major new feature work.
2. No schema redesign unless a real blocking defect requires it.
3. No secret keys in chat, Git, screenshots, or public logs.
4. One bug at a time.
5. Preserve working routes while fixing unrelated failures.
6. Every fix must be tied to:
   - exact role
   - exact route
   - exact error
   - expected behavior
7. After each fix:
   - run `npm run build`
   - redeploy
   - retest the exact failed path
8. Mark release PASS only after all blockers are cleared.
