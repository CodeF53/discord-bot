import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'antfu/if-newline': 'off',
    'antfu/no-top-level-await': 'off',
  },
})
