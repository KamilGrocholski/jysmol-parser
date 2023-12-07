# jysmol-parser

## Like the JSON parser but not

To install dependencies:

```bash
bun install
```

To test:

```bash
bun test
```

## blazingly fast, at least 15 times slower
### time in ms

```bash
test/performance.test.ts:
{
  items: 1000,
  stringify: {
    JYSMOL: 1.5050059999999998,
    JSON: 0.3224010000000028,
    "JYSMOL - JSON": 1.182604999999997,
    "JYSMOL / JSON": 4.668118275067344
  },
  parse: {
    JYSMOL: 5.2678709999999995,
    JSON: 0.31655999999999906,
    "JYSMOL - JSON": 4.9513110000000005,
    "JYSMOL / JSON": 16.64098749052317
  }
}
{
  items: 10000,
  stringify: {
    JYSMOL: 6.959246,
    JSON: 4.548741000000007,
    "JYSMOL - JSON": 2.4105049999999935,
    "JYSMOL / JSON": 1.5299279514925097
  },
  parse: {
    JYSMOL: 47.927285,
    JSON: 2.980517000000006,
    "JYSMOL - JSON": 44.94676799999999,
    "JYSMOL / JSON": 16.0801917922293
  }
}
{
  items: 100000,
  stringify: {
    JYSMOL: 64.52480999999999,
    JSON: 45.61791000000005,
    "JYSMOL - JSON": 18.906899999999936,
    "JYSMOL / JSON": 1.4144622145117984
  },
  parse: {
    JYSMOL: 463.425443,
    JSON: 31.331074000000058,
    "JYSMOL - JSON": 432.0943689999999,
    "JYSMOL / JSON": 14.79124025560053
  }
}
```

This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh)
