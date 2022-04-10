// Import stylesheets
import './style.css';

function convertAnyToHttp(params: Record<string, any>, isRoot: boolean = true): {
  [param: string]: string | string[];
} {
  const returnParams = {};
  Object.keys(params).forEach(paramKey => {
    const paramValue = params[paramKey];
    paramKey = isRoot ? paramKey : `[${paramKey}]`;
    if (typeof paramValue === 'object') {
      const queryStringArray = convertAnyToHttp(paramValue, false);
      Object.keys(queryStringArray).forEach(queryStringArrayKey => {
        returnParams[`${paramKey}${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
      });
    } else if (Array.isArray(paramValue)) {
      paramValue.forEach((paramSubValue, paramSubValueIndex) => {
        const queryStringArray = convertAnyToHttp(paramSubValue, false);
        Object.keys(queryStringArray).forEach(queryStringArrayKey => {
          returnParams[`[${paramSubValueIndex}]${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
        });
      });
    } else {
      returnParams[paramKey] = paramValue;
    }
  });
  return returnParams;
}

const result = convertAnyToHttp({
  filters: {
    a: {
      asdf: 1,
      asdf2: 2,
    },
    b: [
      "value1",
      [3, "value22"],
    ]
  }
});

const expected = {
  "filters[a][asdf]": 1,
  "filters[a][asdf2]": 2,
  "filters[b][0]": "value1",
  "filters[b][1][0]": 3,
  "filters[b][1][1]": "value22"
}

// Write TypeScript code!
const expectedPre: HTMLElement = document.getElementById('expected');
expectedPre.innerHTML = JSON.stringify(expected, null, 2);

const resultPre: HTMLElement = document.getElementById('result');
resultPre.innerHTML = JSON.stringify(result, null, 2);