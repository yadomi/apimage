const { parse, validate } = require('../helpers/query');

it('should parse query string to object', () => {
  expect(parse('w_100', 'jpeg')).toMatchObject({
    width: '100',
    extension: 'jpeg',
  });

  expect(parse('w_100,h_200,f_cover,q_100,p_west', 'jpeg')).toMatchObject({
    width: '100',
    height: '200',
    fit: 'cover',
    quality: '100',
    position: 'west',
    extension: 'jpeg',
  });

  expect(parse('w_100,h_200,f_cover,q_100,p_west', 'jpeg')).toMatchSnapshot();
});

it('should return an error when validating invalid query', () => {
  const parsed = parse('w_4000', 'jpeg');
  const result = validate(parsed);
  expect(result).toHaveProperty('error');
  expect(result).toHaveProperty('error.name', 'ValidationError');
});

it('should convert string to number for specific properties', () => {
  const parsed = parse('w_100', 'jpeg');
  const result = validate(parsed);
  expect(result.value).toMatchObject({ width: 100, extension: 'jpeg' });
  expect(typeof result.value.width).toBe('number');
  expect(result.value).toMatchSnapshot();
});
