const jwt = require('jsonwebtoken');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTA1NTUwMzA4LCJleHAiOjE1MDU1NTIxMDh9.JnS73-Hjhnwwx5OfC7zYumURgxrLeskOVvwtCd3sdCE';

const decoded = jwt.decode(token, { complete: true });
Object.keys(decoded).forEach(function(key){
  console.log(key+','+decoded.key);
});

