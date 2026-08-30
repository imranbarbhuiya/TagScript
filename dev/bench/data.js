window.BENCHMARK_DATA = {
  "lastUpdate": 1788117473120,
  "repoUrl": "https://github.com/imranbarbhuiya/TagScript",
  "entries": {
    "TagScript": [
      {
        "commit": {
          "author": {
            "email": "imranbarbhuiya.fsd@gmail.com",
            "name": "parbez",
            "username": "imranbarbhuiya"
          },
          "committer": {
            "email": "imranbarbhuiya.fsd@gmail.com",
            "name": "parbez",
            "username": "imranbarbhuiya"
          },
          "distinct": true,
          "id": "d4962d5d331425dd2b75c18c3cca7218e8ce9608",
          "message": "ci: build packages before running benchmarks\n\nThe plugin benchmarks import `tagscript` by name, which resolves to the\nworkspace package's dist. `scripts/bench.mjs` runs each package directly\nrather than through turbo, so nothing built them first and the job failed with\n`Cannot find package 'tagscript'`. The test and typecheck tasks avoid this\nbecause turbo gives them `dependsOn: [\"^build\"]`.",
          "timestamp": "2026-08-31T00:35:36+05:30",
          "tree_id": "3969b9aa21fa70f8d3f8d808e9f427025971f807",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/d4962d5d331425dd2b75c18c3cca7218e8ce9608"
        },
        "date": 1788117024823,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 293.181,
            "range": "± 3.773",
            "unit": "ns/op",
            "extra": "avg 307.4ns, min 287.6ns, p99 572.1ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 444.725,
            "range": "± 3.915",
            "unit": "ns/op",
            "extra": "avg 455.7ns, min 438.3ns, p99 535.8ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 582.347,
            "range": "± 5.942",
            "unit": "ns/op",
            "extra": "avg 594.8ns, min 575.8ns, p99 666.7ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 686.909,
            "range": "± 33.872",
            "unit": "ns/op",
            "extra": "avg 704.9ns, min 673.0ns, p99 817.6ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 648.871,
            "range": "± 9.617",
            "unit": "ns/op",
            "extra": "avg 661.7ns, min 638.0ns, p99 725.8ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2213.611,
            "range": "± 11.749",
            "unit": "ns/op",
            "extra": "avg 2198.8ns, min 2140.8ns, p99 2276.0ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1111.985,
            "range": "± 46.268",
            "unit": "ns/op",
            "extra": "avg 1177.2ns, min 1045.8ns, p99 1812.3ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 84.321,
            "range": "± 3.002",
            "unit": "ns/op",
            "extra": "avg 91.0ns, min 81.2ns, p99 180.0ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 87.233,
            "range": "± 2.653",
            "unit": "ns/op",
            "extra": "avg 93.5ns, min 81.2ns, p99 170.1ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 159.61,
            "range": "± 1.856",
            "unit": "ns/op",
            "extra": "avg 164.8ns, min 154.7ns, p99 227.1ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2218.269,
            "range": "± 26.837",
            "unit": "ns/op",
            "extra": "avg 2185.3ns, min 2065.0ns, p99 2288.3ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5268,
            "range": "± 671.000",
            "unit": "ns/op",
            "extra": "avg 6061.9ns, min 4096.0ns, p99 15824.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2123.671,
            "range": "± 16.920",
            "unit": "ns/op",
            "extra": "avg 2132.7ns, min 2018.3ns, p99 2465.7ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1741.158,
            "range": "± 27.845",
            "unit": "ns/op",
            "extra": "avg 1733.7ns, min 1651.9ns, p99 1935.8ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 4764.177,
            "range": "± 44.684",
            "unit": "ns/op",
            "extra": "avg 4734.4ns, min 4548.2ns, p99 4999.8ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 2896.696,
            "range": "± 33.620",
            "unit": "ns/op",
            "extra": "avg 2900.9ns, min 2785.6ns, p99 3013.0ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4174.673,
            "range": "± 185.827",
            "unit": "ns/op",
            "extra": "avg 4229.1ns, min 3973.7ns, p99 4466.6ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 5991.524,
            "range": "± 54.582",
            "unit": "ns/op",
            "extra": "avg 6010.5ns, min 5863.0ns, p99 6233.9ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1892.881,
            "range": "± 40.491",
            "unit": "ns/op",
            "extra": "avg 1889.3ns, min 1770.5ns, p99 2095.3ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2056.58,
            "range": "± 28.194",
            "unit": "ns/op",
            "extra": "avg 2064.6ns, min 1963.6ns, p99 2344.6ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2512.79,
            "range": "± 28.588",
            "unit": "ns/op",
            "extra": "avg 2515.6ns, min 2406.3ns, p99 2650.0ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2355.397,
            "range": "± 17.120",
            "unit": "ns/op",
            "extra": "avg 2342.5ns, min 2254.1ns, p99 2428.1ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3339.372,
            "range": "± 32.217",
            "unit": "ns/op",
            "extra": "avg 3312.9ns, min 3142.9ns, p99 3501.9ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3247.925,
            "range": "± 24.823",
            "unit": "ns/op",
            "extra": "avg 3246.1ns, min 3150.4ns, p99 3333.5ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 4738.692,
            "range": "± 49.014",
            "unit": "ns/op",
            "extra": "avg 4758.1ns, min 4702.5ns, p99 4869.3ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1881.954,
            "range": "± 37.789",
            "unit": "ns/op",
            "extra": "avg 1872.7ns, min 1770.0ns, p99 2003.4ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2337.584,
            "range": "± 18.742",
            "unit": "ns/op",
            "extra": "avg 2322.5ns, min 2251.1ns, p99 2400.2ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4326.968,
            "range": "± 176.836",
            "unit": "ns/op",
            "extra": "avg 4382.3ns, min 4174.0ns, p99 4550.7ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 2852.896,
            "range": "± 21.788",
            "unit": "ns/op",
            "extra": "avg 2848.6ns, min 2754.3ns, p99 2939.6ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 2905.214,
            "range": "± 24.771",
            "unit": "ns/op",
            "extra": "avg 2908.1ns, min 2816.7ns, p99 3040.9ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.06,
            "range": "± 0.570",
            "unit": "ns/op",
            "extra": "avg 35.0ns, min 32.5ns, p99 76.0ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.54,
            "range": "± 0.000",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.871,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 15.5ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.841,
            "range": "± 0.010",
            "unit": "ns/op",
            "extra": "avg 4.9ns, min 4.2ns, p99 6.9ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 428.881,
            "range": "± 39.378",
            "unit": "ns/op",
            "extra": "avg 447.6ns, min 420.9ns, p99 540.5ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4270.853,
            "range": "± 62.210",
            "unit": "ns/op",
            "extra": "avg 4285.2ns, min 4124.2ns, p99 4476.9ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 20729.132,
            "range": "± 262.820",
            "unit": "ns/op",
            "extra": "avg 21038.7ns, min 20404.4ns, p99 22339.8ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 14301.005,
            "range": "± 100.009",
            "unit": "ns/op",
            "extra": "avg 14321.6ns, min 14213.5ns, p99 14431.3ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 16319.556,
            "range": "± 59.756",
            "unit": "ns/op",
            "extra": "avg 16321.4ns, min 16020.2ns, p99 16475.0ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 198600,
            "range": "± 7911.000",
            "unit": "ns/op",
            "extra": "avg 206293.2ns, min 188134.0ns, p99 319782.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 15759.917,
            "range": "± 291.100",
            "unit": "ns/op",
            "extra": "avg 16108.1ns, min 15716.9ns, p99 16541.9ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1917.583,
            "range": "± 13.680",
            "unit": "ns/op",
            "extra": "avg 1940.9ns, min 1898.1ns, p99 2148.7ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4135.004,
            "range": "± 26.216",
            "unit": "ns/op",
            "extra": "avg 4112.4ns, min 4000.7ns, p99 4273.8ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 141.383,
            "range": "± 4.521",
            "unit": "ns/op",
            "extra": "avg 156.1ns, min 133.8ns, p99 224.3ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 2934,
            "range": "± 441.000",
            "unit": "ns/op",
            "extra": "avg 3426.3ns, min 2293.0ns, p99 10236.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3172.654,
            "range": "± 73.509",
            "unit": "ns/op",
            "extra": "avg 3214.7ns, min 3075.6ns, p99 3475.2ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1733.656,
            "range": "± 31.649",
            "unit": "ns/op",
            "extra": "avg 1735.4ns, min 1642.1ns, p99 1917.0ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3008.219,
            "range": "± 33.028",
            "unit": "ns/op",
            "extra": "avg 3020.0ns, min 2913.5ns, p99 3167.3ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2275.959,
            "range": "± 19.284",
            "unit": "ns/op",
            "extra": "avg 2263.4ns, min 2173.9ns, p99 2400.6ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3410.365,
            "range": "± 29.945",
            "unit": "ns/op",
            "extra": "avg 3415.0ns, min 3326.3ns, p99 3512.5ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1797.976,
            "range": "± 37.016",
            "unit": "ns/op",
            "extra": "avg 1801.4ns, min 1701.3ns, p99 1969.9ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6099,
            "range": "± 662.000",
            "unit": "ns/op",
            "extra": "avg 6897.1ns, min 4997.0ns, p99 20471.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3223.379,
            "range": "± 94.065",
            "unit": "ns/op",
            "extra": "avg 3245.4ns, min 3091.7ns, p99 3433.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3601.356,
            "range": "± 25.047",
            "unit": "ns/op",
            "extra": "avg 3612.6ns, min 3532.0ns, p99 3703.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 9546.948,
            "range": "± 55.760",
            "unit": "ns/op",
            "extra": "avg 9579.7ns, min 9451.3ns, p99 9758.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13085.602,
            "range": "± 170.093",
            "unit": "ns/op",
            "extra": "avg 13235.5ns, min 12947.3ns, p99 13723.6ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.533,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 2.5ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.643,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 5.5ns, p99 11.4ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.154,
            "range": "± 0.020",
            "unit": "ns/op",
            "extra": "avg 2.8ns, min 2.1ns, p99 6.2ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.712,
            "range": "± 1.418",
            "unit": "ns/op",
            "extra": "avg 8.6ns, min 5.9ns, p99 12.3ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.127,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 8.2ns, min 6.1ns, p99 10.5ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.878,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 11.0ns, min 10.5ns, p99 13.4ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 4.897,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.8ns, p99 7.0ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.957,
            "range": "± 0.056",
            "unit": "ns/op",
            "extra": "avg 11.2ns, min 10.7ns, p99 13.8ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.46,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 5.5ns, min 5.4ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.827,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 8.9ns, min 8.6ns, p99 11.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.069,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 6.2ns, min 6.0ns, p99 8.4ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.401,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 9.6ns, min 9.3ns, p99 13.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 525.768,
            "range": "± 4.120",
            "unit": "ns/op",
            "extra": "avg 538.3ns, min 519.6ns, p99 665.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 836.954,
            "range": "± 14.949",
            "unit": "ns/op",
            "extra": "avg 847.1ns, min 795.3ns, p99 976.6ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.303,
            "range": "± 0.017",
            "unit": "ns/op",
            "extra": "avg 12.4ns, min 12.2ns, p99 14.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 105.422,
            "range": "± 1.663",
            "unit": "ns/op",
            "extra": "avg 107.7ns, min 102.5ns, p99 185.5ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13441,
            "range": "± 1101.000",
            "unit": "ns/op",
            "extra": "avg 14465.0ns, min 11147.0ns, p99 32709.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 5981.722,
            "range": "± 35.918",
            "unit": "ns/op",
            "extra": "avg 5983.5ns, min 5907.1ns, p99 6095.0ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 13942.414,
            "range": "± 37.860",
            "unit": "ns/op",
            "extra": "avg 13940.0ns, min 13824.7ns, p99 13996.3ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 17790.075,
            "range": "± 50.792",
            "unit": "ns/op",
            "extra": "avg 17831.1ns, min 17741.1ns, p99 17967.2ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "imranbarbhuiya.fsd@gmail.com",
            "name": "parbez",
            "username": "imranbarbhuiya"
          },
          "committer": {
            "email": "imranbarbhuiya.fsd@gmail.com",
            "name": "parbez",
            "username": "imranbarbhuiya"
          },
          "distinct": true,
          "id": "5860ac4f6fe797b386a2fdebf781e6831911c5d5",
          "message": "docs: correct the benchmark dashboard url in the workflow comment",
          "timestamp": "2026-08-31T00:46:21+05:30",
          "tree_id": "759e3554072746e4ea1f73f18ed0364967c96b47",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/5860ac4f6fe797b386a2fdebf781e6831911c5d5"
        },
        "date": 1788117472187,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 301.432,
            "range": "± 5.178",
            "unit": "ns/op",
            "extra": "avg 322.4ns, min 295.6ns, p99 600.5ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 461.103,
            "range": "± 4.664",
            "unit": "ns/op",
            "extra": "avg 474.0ns, min 455.1ns, p99 564.5ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 607.132,
            "range": "± 45.891",
            "unit": "ns/op",
            "extra": "avg 629.1ns, min 591.5ns, p99 845.2ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 733.143,
            "range": "± 53.878",
            "unit": "ns/op",
            "extra": "avg 756.0ns, min 719.4ns, p99 923.3ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 703.88,
            "range": "± 20.326",
            "unit": "ns/op",
            "extra": "avg 720.3ns, min 693.8ns, p99 794.9ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2348.426,
            "range": "± 21.847",
            "unit": "ns/op",
            "extra": "avg 2343.2ns, min 2266.9ns, p99 2443.0ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1194.104,
            "range": "± 50.14",
            "unit": "ns/op",
            "extra": "avg 1210.2ns, min 1158.9ns, p99 1292.3ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 82.595,
            "range": "± 1.884",
            "unit": "ns/op",
            "extra": "avg 84.9ns, min 80.4ns, p99 150.9ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 70.358,
            "range": "± 2.177",
            "unit": "ns/op",
            "extra": "avg 74.1ns, min 68.7ns, p99 139.8ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 134.541,
            "range": "± 3.571",
            "unit": "ns/op",
            "extra": "avg 146.1ns, min 130.4ns, p99 289.2ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 1928.879,
            "range": "± 246.028",
            "unit": "ns/op",
            "extra": "avg 2085.7ns, min 1867.2ns, p99 3127.5ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 6002,
            "range": "± 1541",
            "unit": "ns/op",
            "extra": "avg 7604.7ns, min 4708.0ns, p99 26260.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2195.242,
            "range": "± 41.591",
            "unit": "ns/op",
            "extra": "avg 2210.9ns, min 2087.1ns, p99 2396.4ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1715.389,
            "range": "± 70.101",
            "unit": "ns/op",
            "extra": "avg 1733.5ns, min 1571.3ns, p99 2010.2ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 5041.326,
            "range": "± 98.487",
            "unit": "ns/op",
            "extra": "avg 5048.4ns, min 4758.1ns, p99 5239.8ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3079.54,
            "range": "± 56.182",
            "unit": "ns/op",
            "extra": "avg 3094.5ns, min 2972.0ns, p99 3246.8ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4337.101,
            "range": "± 78.893",
            "unit": "ns/op",
            "extra": "avg 4375.1ns, min 4292.6ns, p99 4571.2ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6630.924,
            "range": "± 27.299",
            "unit": "ns/op",
            "extra": "avg 6634.9ns, min 6509.8ns, p99 6770.2ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1967.312,
            "range": "± 42.144",
            "unit": "ns/op",
            "extra": "avg 1977.5ns, min 1830.5ns, p99 2337.7ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2112.39,
            "range": "± 35.525",
            "unit": "ns/op",
            "extra": "avg 2112.0ns, min 1992.5ns, p99 2268.9ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2639.487,
            "range": "± 46.633",
            "unit": "ns/op",
            "extra": "avg 2652.5ns, min 2512.7ns, p99 2855.0ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2513.661,
            "range": "± 68.776",
            "unit": "ns/op",
            "extra": "avg 2529.0ns, min 2369.9ns, p99 2701.3ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3598.357,
            "range": "± 42.43",
            "unit": "ns/op",
            "extra": "avg 3564.7ns, min 3376.2ns, p99 3692.4ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3613.713,
            "range": "± 73.551",
            "unit": "ns/op",
            "extra": "avg 3639.4ns, min 3527.7ns, p99 3786.8ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5106.973,
            "range": "± 52.645",
            "unit": "ns/op",
            "extra": "avg 5129.9ns, min 5003.4ns, p99 5382.9ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1953.942,
            "range": "± 37.037",
            "unit": "ns/op",
            "extra": "avg 1952.0ns, min 1817.5ns, p99 2114.2ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2425.068,
            "range": "± 33.913",
            "unit": "ns/op",
            "extra": "avg 2423.3ns, min 2315.6ns, p99 2568.7ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4709.838,
            "range": "± 117.14",
            "unit": "ns/op",
            "extra": "avg 4718.0ns, min 4426.7ns, p99 4950.2ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 3031.119,
            "range": "± 43.719",
            "unit": "ns/op",
            "extra": "avg 3042.4ns, min 2917.3ns, p99 3187.1ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3125.003,
            "range": "± 58.251",
            "unit": "ns/op",
            "extra": "avg 3136.8ns, min 3006.9ns, p99 3314.8ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.884,
            "range": "± 0.453",
            "unit": "ns/op",
            "extra": "avg 36.2ns, min 33.3ns, p99 81.5ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.555,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.6ns, p99 4.8ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.495,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 9.7ns, min 9.5ns, p99 14.3ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.344,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 4.4ns, min 4.3ns, p99 6.5ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 429.08,
            "range": "± 59.555",
            "unit": "ns/op",
            "extra": "avg 455.2ns, min 418.0ns, p99 743.1ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4498.824,
            "range": "± 59.112",
            "unit": "ns/op",
            "extra": "avg 4506.6ns, min 4371.0ns, p99 4594.2ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 22034.608,
            "range": "± 157.21",
            "unit": "ns/op",
            "extra": "avg 22371.0ns, min 21849.1ns, p99 22922.6ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 15274.371,
            "range": "± 188.692",
            "unit": "ns/op",
            "extra": "avg 15344.6ns, min 15150.1ns, p99 15510.4ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 17564.204,
            "range": "± 229.273",
            "unit": "ns/op",
            "extra": "avg 17637.7ns, min 17125.4ns, p99 17853.6ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 213428,
            "range": "± 11021",
            "unit": "ns/op",
            "extra": "avg 227394.6ns, min 186518.0ns, p99 506235.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 16261.159,
            "range": "± 115.298",
            "unit": "ns/op",
            "extra": "avg 16405.0ns, min 15922.1ns, p99 16642.1ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1980.983,
            "range": "± 51.568",
            "unit": "ns/op",
            "extra": "avg 1999.6ns, min 1958.8ns, p99 2088.1ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4057.913,
            "range": "± 137.202",
            "unit": "ns/op",
            "extra": "avg 4090.4ns, min 3804.4ns, p99 4365.8ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 125.769,
            "range": "± 5.724",
            "unit": "ns/op",
            "extra": "avg 141.2ns, min 115.6ns, p99 219.9ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 3286,
            "range": "± 531",
            "unit": "ns/op",
            "extra": "avg 3865.2ns, min 2515.0ns, p99 12303.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3205.45,
            "range": "± 49.538",
            "unit": "ns/op",
            "extra": "avg 3231.1ns, min 3099.5ns, p99 3471.8ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1805.105,
            "range": "± 37.188",
            "unit": "ns/op",
            "extra": "avg 1809.7ns, min 1712.0ns, p99 1990.4ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3064.338,
            "range": "± 73.753",
            "unit": "ns/op",
            "extra": "avg 3092.5ns, min 2944.3ns, p99 3356.7ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2391.617,
            "range": "± 43.979",
            "unit": "ns/op",
            "extra": "avg 2395.0ns, min 2258.1ns, p99 2549.9ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3505.596,
            "range": "± 36.841",
            "unit": "ns/op",
            "extra": "avg 3528.0ns, min 3391.8ns, p99 3804.2ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1831.294,
            "range": "± 37.115",
            "unit": "ns/op",
            "extra": "avg 1824.9ns, min 1724.4ns, p99 1929.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 7063,
            "range": "± 872",
            "unit": "ns/op",
            "extra": "avg 7968.7ns, min 5821.0ns, p99 21931.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3302.533,
            "range": "± 37.878",
            "unit": "ns/op",
            "extra": "avg 3303.0ns, min 3149.4ns, p99 3453.9ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3709.851,
            "range": "± 43.096",
            "unit": "ns/op",
            "extra": "avg 3726.4ns, min 3605.6ns, p99 3896.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 10729.287,
            "range": "± 89.647",
            "unit": "ns/op",
            "extra": "avg 10772.8ns, min 10625.6ns, p99 10886.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13709.392,
            "range": "± 96.205",
            "unit": "ns/op",
            "extra": "avg 13865.2ns, min 13555.9ns, p99 14323.7ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.551,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.4ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.031,
            "range": "± 0.081",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 4.9ns, p99 8.7ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 1.942,
            "range": "± 0.042",
            "unit": "ns/op",
            "extra": "avg 2.6ns, min 1.9ns, p99 10.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.147,
            "range": "± 1.81",
            "unit": "ns/op",
            "extra": "avg 8.1ns, min 5.3ns, p99 18.3ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.187,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 6.8ns, p99 11.0ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.439,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 10.6ns, min 10.3ns, p99 14.7ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 5.283,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 5.3ns, min 5.0ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.466,
            "range": "± 0.024",
            "unit": "ns/op",
            "extra": "avg 10.6ns, min 10.3ns, p99 12.9ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.291,
            "range": "± 0.025",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 5.2ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.157,
            "range": "± 0.017",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 8.1ns, p99 10.8ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.526,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 6.6ns, min 6.5ns, p99 8.9ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 8.475,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 8.6ns, min 8.4ns, p99 12.4ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 597.834,
            "range": "± 4.371",
            "unit": "ns/op",
            "extra": "avg 609.3ns, min 589.2ns, p99 713.6ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 924.203,
            "range": "± 30.426",
            "unit": "ns/op",
            "extra": "avg 957.5ns, min 890.8ns, p99 1338.6ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.697,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 12.9ns, min 12.7ns, p99 15.5ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 99.245,
            "range": "± 1.883",
            "unit": "ns/op",
            "extra": "avg 101.6ns, min 97.0ns, p99 177.9ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 15459,
            "range": "± 1222",
            "unit": "ns/op",
            "extra": "avg 16656.5ns, min 12584.0ns, p99 37700.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 5976.419,
            "range": "± 53.726",
            "unit": "ns/op",
            "extra": "avg 5980.9ns, min 5834.0ns, p99 6235.1ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 14125.309,
            "range": "± 87.492",
            "unit": "ns/op",
            "extra": "avg 14125.0ns, min 13878.3ns, p99 14334.3ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 18695.397,
            "range": "± 95.063",
            "unit": "ns/op",
            "extra": "avg 18712.0ns, min 18511.0ns, p99 18832.8ns"
          }
        ]
      }
    ]
  }
}