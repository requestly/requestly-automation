const {
  modifyQueryParamUrl,
  modifyQueryParamsUrl,
  removeQueryParamUrl,
  removeQueryParamsUrl,
} = require('../index');

describe('Query Parameter Manipulation', () => {
  describe('modifyQueryParamUrl', () => {
    test('should create URL with single query parameter', () => {
      const result = modifyQueryParamUrl('testParam', 'testValue');
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?testParam=testValue');
    });

    test('should handle special characters in parameter name and value', () => {
      const result = modifyQueryParamUrl('test&param', 'test=value&more');
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?test%26param=test%3Dvalue%26more');
    });

    test('should handle Unicode characters', () => {
      const result = modifyQueryParamUrl('测试', '值');
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?%E6%B5%8B%E8%AF%95=%E5%80%BC');
    });

    test('should create URL with multiple query parameters using params object', () => {
      const params = {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3'
      };
      const result = modifyQueryParamUrl(null, null, params);
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?param1=value1&param2=value2&param3=value3');
    });

    test('should handle empty string values', () => {
      const result = modifyQueryParamUrl('emptyParam', '');
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?emptyParam=');
    });

    test('should handle numeric values as strings', () => {
      const result = modifyQueryParamUrl('numericParam', '123');
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?numericParam=123');
    });

    // Error cases
    test('should throw error when no parameters are provided', () => {
      expect(() => modifyQueryParamUrl()).toThrow('Provide either params object or paramName and paramValue');
    });

    test('should throw error when paramName is empty string', () => {
      expect(() => modifyQueryParamUrl('', 'value')).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when paramName is not a string', () => {
      expect(() => modifyQueryParamUrl(123, 'value')).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when paramValue is not a string', () => {
      expect(() => modifyQueryParamUrl('param', 123)).toThrow('Parameter value must be a string');
    });

    test('should throw error when params object contains invalid parameter name', () => {
      const params = {
        '': 'value1',
        param2: 'value2'
      };
      expect(() => modifyQueryParamUrl(null, null, params)).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when params object contains invalid parameter value', () => {
      const params = {
        param1: 'value1',
        param2: 123
      };
      expect(() => modifyQueryParamUrl(null, null, params)).toThrow('Parameter value must be a string');
    });
  });

  describe('modifyQueryParamsUrl', () => {
    test('should create URL with multiple query parameters', () => {
      const params = {
        userId: '12345',
        sessionId: 'abc-def-ghi',
        debug: 'true'
      };
      const result = modifyQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?userId=12345&sessionId=abc-def-ghi&debug=true');
    });

    test('should handle single parameter object', () => {
      const params = { singleParam: 'singleValue' };
      const result = modifyQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?singleParam=singleValue');
    });

    test('should handle parameters with special characters', () => {
      const params = {
        'param with spaces': 'value with spaces',
        'param&special': 'value=special'
      };
      const result = modifyQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/modify-query-param?param%20with%20spaces=value%20with%20spaces&param%26special=value%3Dspecial');
    });

    // Error cases
    test('should throw error when params is null', () => {
      expect(() => modifyQueryParamsUrl(null)).toThrow('params parameter is required and must be an object');
    });

    test('should throw error when params is undefined', () => {
      expect(() => modifyQueryParamsUrl(undefined)).toThrow('params parameter is required and must be an object');
    });

    test('should throw error when params is not an object', () => {
      expect(() => modifyQueryParamsUrl('not an object')).toThrow('params parameter is required and must be an object');
    });

    test('should throw error when params is an array', () => {
      expect(() => modifyQueryParamsUrl(['param1', 'param2'])).toThrow('params parameter is required and must be an object');
    });
  });

  describe('removeQueryParamUrl', () => {
    test('should create URL to remove single query parameter', () => {
      const result = removeQueryParamUrl('paramToRemove');
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=paramToRemove');
    });

    test('should handle parameter name with special characters', () => {
      const result = removeQueryParamUrl('param&special');
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=param%26special');
    });

    test('should create URL to remove multiple query parameters using array', () => {
      const params = ['param1', 'param2', 'param3'];
      const result = removeQueryParamUrl(null, params);
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=param1&param=param2&param=param3');
    });

    test('should handle Unicode parameter names', () => {
      const result = removeQueryParamUrl('测试参数');
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=%E6%B5%8B%E8%AF%95%E5%8F%82%E6%95%B0');
    });

    // Error cases
    test('should throw error when no parameters are provided', () => {
      expect(() => removeQueryParamUrl()).toThrow('Provide either paramName or params array');
    });

    test('should throw error when paramName is empty string', () => {
      expect(() => removeQueryParamUrl('')).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when paramName is not a string', () => {
      expect(() => removeQueryParamUrl(123)).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when params array is empty', () => {
      expect(() => removeQueryParamUrl(null, [])).toThrow('params array cannot be empty');
    });

    test('should throw error when params array contains invalid parameter name', () => {
      const params = ['param1', '', 'param3'];
      expect(() => removeQueryParamUrl(null, params)).toThrow('Parameter name must be a non-empty string');
    });

    test('should throw error when params array contains non-string parameter name', () => {
      const params = ['param1', 123, 'param3'];
      expect(() => removeQueryParamUrl(null, params)).toThrow('Parameter name must be a non-empty string');
    });
  });

  describe('removeQueryParamsUrl', () => {
    test('should create URL to remove multiple query parameters', () => {
      const params = ['sessionId', 'debug', 'timestamp'];
      const result = removeQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=sessionId&param=debug&param=timestamp');
    });

    test('should handle single parameter in array', () => {
      const params = ['singleParam'];
      const result = removeQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=singleParam');
    });

    test('should handle parameters with special characters', () => {
      const params = ['param with spaces', 'param&special'];
      const result = removeQueryParamsUrl(params);
      expect(result).toBe('https://app.requestly.io/automation/remove-query-param?param=param%20with%20spaces&param=param%26special');
    });

    // Error cases
    test('should throw error when params is not an array', () => {
      expect(() => removeQueryParamsUrl('not an array')).toThrow('params parameter must be an array');
    });

    test('should throw error when params is null', () => {
      expect(() => removeQueryParamsUrl(null)).toThrow('params parameter must be an array');
    });

    test('should throw error when params is undefined', () => {
      expect(() => removeQueryParamsUrl(undefined)).toThrow('params parameter must be an array');
    });

    test('should throw error when params is an object', () => {
      expect(() => removeQueryParamsUrl({ param1: 'value1' })).toThrow('params parameter must be an array');
    });
  });

  describe('Integration scenarios', () => {
    test('should handle common e-commerce tracking parameters', () => {
      const trackingParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'summer_sale',
        gclid: 'CjwKCAjw...',
        fbclid: 'IwAR0...'
      };
      const result = modifyQueryParamsUrl(trackingParams);
      expect(result).toContain('utm_source=google');
      expect(result).toContain('utm_medium=cpc');
      expect(result).toContain('utm_campaign=summer_sale');
    });

    test('should handle API pagination parameters', () => {
      const paginationParams = {
        page: '2',
        limit: '50',
        sort: 'created_at',
        order: 'desc'
      };
      const result = modifyQueryParamsUrl(paginationParams);
      expect(result).toContain('page=2');
      expect(result).toContain('limit=50');
      expect(result).toContain('sort=created_at');
      expect(result).toContain('order=desc');
    });

    test('should handle removing sensitive parameters', () => {
      const sensitiveParams = ['api_key', 'session_token', 'user_secret'];
      const result = removeQueryParamsUrl(sensitiveParams);
      expect(result).toContain('param=api_key');
      expect(result).toContain('param=session_token');
      expect(result).toContain('param=user_secret');
    });

    test('should handle search and filter parameters', () => {
      const searchParams = {
        q: 'javascript automation',
        category: 'programming',
        price_min: '10',
        price_max: '100',
        in_stock: 'true'
      };
      const result = modifyQueryParamsUrl(searchParams);
      expect(result).toContain('q=javascript%20automation');
      expect(result).toContain('category=programming');
      expect(result).toContain('price_min=10');
    });
  });
});