import _ from 'lodash';

const hasBoth = (firstObj, secondObj, key) => _.has(firstObj, key) && _.has(secondObj, key);
// eslint-disable-next-line max-len
const areBothObject = (firstObj, secondObj, key) => _.isPlainObject(firstObj[key]) && _.isPlainObject(secondObj[key]);
const areKeysIndetity = (firstObj, secondObj, key) => firstObj[key] === secondObj[key];
const isAdded = (firstObj, secondObj, key) => !_.has(firstObj, key) && _.has(secondObj, key);


const genAst = (beforeObj, afterObj) => {
  const keys = _.union(Object.keys(beforeObj), Object.keys(afterObj)).sort();
  const result = keys.reduce((acc, key) => {
    if (hasBoth(beforeObj, afterObj, key)) {
      if (areBothObject(beforeObj, afterObj, key)) {
        return [...acc, { name: key, type: 'parents', children: genAst(beforeObj[key], afterObj[key]) }];
      }
      if (areKeysIndetity(beforeObj, afterObj, key)) {
        return [...acc, { name: key, type: 'unchanged', value: afterObj[key] }];
      }
      return [...acc, {
        name: key, type: 'changed', valueBefore: beforeObj[key], valueAfter: afterObj[key],
      }];
    }

    return isAdded(beforeObj, afterObj, key) ? [...acc, { name: key, type: 'added', value: afterObj[key] }] : [...acc, { name: key, type: 'deleted', value: beforeObj[key] }];
  }, []);

  return result;
};


export default genAst;
