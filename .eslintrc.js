module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
  
  ],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
  
  ],
  'rules': {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'max-len': ['error', {
      'tabWidth': 2,
      'code': 180
    }],
    'indent': ['error', 2]
    //'max-line-length': [true, 180]
  }
};