function isStringNotNumberAndNotEmpty(value) {
  if (value === null) throw new Error('Null value is not allowed');
  if (value === undefined) throw new Error('Undefined value is not allowed');
  const isValueString = typeof value === 'string';
  const isValueNotNumber = isNaN(parseInt(value));
  const isStringNotEmpty = value.length > 0;

  const result = isValueString && isValueNotNumber && isStringNotEmpty;

  console.log('> isStringNotNumberAndNotEmpty -> result:', {
    result,
    isValueString,
    isStringNotEmpty,
    isValueNotNumber,
  });
  return result;
}

export { isStringNotNumberAndNotEmpty };
