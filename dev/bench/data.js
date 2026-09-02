window.BENCHMARK_DATA = {
  "lastUpdate": 1788316567701,
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
          "id": "314ba716ecc0b28d2798bba57997ddf11f1a47d6",
          "message": "test: cover the effect entry point, and fix an off by one it found\n\n104 tests across the interpreter, the ported parsers and the interop adapters.\n\nTwo bugs came out of writing them. Effect's `Random.nextIntBetween` includes\nboth bounds, unlike the `Math.floor(Math.random() * n)` idiom the classic\nparsers use, so `{range:5-7}` could return 8 and `{random:a,b}` could index one\npast the end and hand back undefined, which the interpreter then read as \"not\nhandled\" and left the tag unrendered. Both are fixed and both now have a test.\n\n`@effect/vitest` is not used. Its `it.effect` is the only thing it adds over\n`bun:test`, and a second runner means a second config and a second coverage\nreport. A wrapper was tried and dropped as well, because every test here reads\nbetter as `await body(...)` than as one effect with assertions piped through it.\nThree small helpers in tests/effect/helpers.ts cover what is actually needed.\n\nDocs get a new Effect page, and the earlier ones lose their em dashes to match\nthe writing rules now in use.",
          "timestamp": "2026-08-31T01:04:47+05:30",
          "tree_id": "1b2e2c6e44ed2b4d4d4637ac263831dab56ecc45",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/314ba716ecc0b28d2798bba57997ddf11f1a47d6"
        },
        "date": 1788118759018,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 302.525,
            "range": "± 3.695",
            "unit": "ns/op",
            "extra": "avg 315.1ns, min 293.1ns, p99 545.8ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 452.929,
            "range": "± 7.993",
            "unit": "ns/op",
            "extra": "avg 466.2ns, min 446.3ns, p99 561.7ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 606.589,
            "range": "± 38.146",
            "unit": "ns/op",
            "extra": "avg 638.3ns, min 586.1ns, p99 1023.5ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 715.563,
            "range": "± 40.796",
            "unit": "ns/op",
            "extra": "avg 733.0ns, min 694.3ns, p99 886.1ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 668.725,
            "range": "± 12.369",
            "unit": "ns/op",
            "extra": "avg 682.0ns, min 654.4ns, p99 762.7ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2268.448,
            "range": "± 17.353",
            "unit": "ns/op",
            "extra": "avg 2253.9ns, min 2193.7ns, p99 2317.3ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1108.967,
            "range": "± 55.41",
            "unit": "ns/op",
            "extra": "avg 1131.4ns, min 1075.8ns, p99 1290.4ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 84.582,
            "range": "± 1.719",
            "unit": "ns/op",
            "extra": "avg 87.1ns, min 81.8ns, p99 156.2ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 82.455,
            "range": "± 4.807",
            "unit": "ns/op",
            "extra": "avg 86.3ns, min 78.1ns, p99 157.8ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 153.212,
            "range": "± 1.705",
            "unit": "ns/op",
            "extra": "avg 157.8ns, min 137.6ns, p99 227.5ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2141.211,
            "range": "± 16.357",
            "unit": "ns/op",
            "extra": "avg 2136.3ns, min 2041.7ns, p99 2178.5ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5518,
            "range": "± 922",
            "unit": "ns/op",
            "extra": "avg 6936.2ns, min 4157.0ns, p99 31207.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2344.942,
            "range": "± 75.395",
            "unit": "ns/op",
            "extra": "avg 2389.3ns, min 2225.2ns, p99 2842.6ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1884.2,
            "range": "± 27.36",
            "unit": "ns/op",
            "extra": "avg 1874.8ns, min 1781.0ns, p99 2009.8ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 5063.586,
            "range": "± 44.772",
            "unit": "ns/op",
            "extra": "avg 5060.5ns, min 4842.7ns, p99 5328.2ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3105.676,
            "range": "± 29.16",
            "unit": "ns/op",
            "extra": "avg 3098.9ns, min 2988.2ns, p99 3208.6ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4351.629,
            "range": "± 77.691",
            "unit": "ns/op",
            "extra": "avg 4381.6ns, min 4223.1ns, p99 4595.8ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6411.275,
            "range": "± 56.565",
            "unit": "ns/op",
            "extra": "avg 6443.7ns, min 6344.6ns, p99 6651.2ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 2074.434,
            "range": "± 38.943",
            "unit": "ns/op",
            "extra": "avg 2071.1ns, min 1900.0ns, p99 2321.0ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2265.56,
            "range": "± 39.743",
            "unit": "ns/op",
            "extra": "avg 2268.3ns, min 2164.5ns, p99 2444.0ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2770.475,
            "range": "± 78.859",
            "unit": "ns/op",
            "extra": "avg 2781.6ns, min 2592.7ns, p99 2960.6ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2545.504,
            "range": "± 100.54",
            "unit": "ns/op",
            "extra": "avg 2570.7ns, min 2412.1ns, p99 2775.7ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3575.663,
            "range": "± 35.104",
            "unit": "ns/op",
            "extra": "avg 3556.1ns, min 3422.6ns, p99 3657.2ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3574.145,
            "range": "± 47.973",
            "unit": "ns/op",
            "extra": "avg 3568.3ns, min 3397.4ns, p99 3694.7ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5023.232,
            "range": "± 130.622",
            "unit": "ns/op",
            "extra": "avg 5074.5ns, min 4875.0ns, p99 5361.0ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 2068.676,
            "range": "± 32.625",
            "unit": "ns/op",
            "extra": "avg 2056.1ns, min 1930.4ns, p99 2189.1ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2528.148,
            "range": "± 26.033",
            "unit": "ns/op",
            "extra": "avg 2519.3ns, min 2408.2ns, p99 2614.1ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4718.482,
            "range": "± 80.864",
            "unit": "ns/op",
            "extra": "avg 4723.3ns, min 4476.5ns, p99 4914.1ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 3098.84,
            "range": "± 48.606",
            "unit": "ns/op",
            "extra": "avg 3104.4ns, min 2962.5ns, p99 3280.7ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3092.301,
            "range": "± 108.452",
            "unit": "ns/op",
            "extra": "avg 3126.4ns, min 2993.1ns, p99 3328.6ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.244,
            "range": "± 0.621",
            "unit": "ns/op",
            "extra": "avg 35.4ns, min 32.3ns, p99 78.2ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.541,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.91,
            "range": "± 0.015",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 15.2ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.844,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 4.9ns, min 4.2ns, p99 6.8ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 434.044,
            "range": "± 34.048",
            "unit": "ns/op",
            "extra": "avg 453.6ns, min 424.1ns, p99 546.6ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4522.245,
            "range": "± 70.773",
            "unit": "ns/op",
            "extra": "avg 4525.0ns, min 4365.8ns, p99 4692.4ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 22297.753,
            "range": "± 256.63",
            "unit": "ns/op",
            "extra": "avg 22449.9ns, min 21754.6ns, p99 22781.9ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 15578.862,
            "range": "± 32.882",
            "unit": "ns/op",
            "extra": "avg 15574.3ns, min 15285.8ns, p99 15736.4ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 17415.089,
            "range": "± 113.049",
            "unit": "ns/op",
            "extra": "avg 17414.0ns, min 17069.1ns, p99 17633.5ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 215165,
            "range": "± 7842",
            "unit": "ns/op",
            "extra": "avg 223147.6ns, min 197879.0ns, p99 321966.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 16970.685,
            "range": "± 495.392",
            "unit": "ns/op",
            "extra": "avg 17140.8ns, min 16074.3ns, p99 17691.7ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1951.69,
            "range": "± 26.454",
            "unit": "ns/op",
            "extra": "avg 1975.6ns, min 1922.2ns, p99 2155.2ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4318.027,
            "range": "± 129.05",
            "unit": "ns/op",
            "extra": "avg 4351.5ns, min 4135.9ns, p99 4579.4ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 154.633,
            "range": "± 5.978",
            "unit": "ns/op",
            "extra": "avg 169.4ns, min 141.1ns, p99 254.1ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 2945,
            "range": "± 590",
            "unit": "ns/op",
            "extra": "avg 3673.8ns, min 2313.0ns, p99 11778.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3378.522,
            "range": "± 46.455",
            "unit": "ns/op",
            "extra": "avg 3385.9ns, min 3237.1ns, p99 3511.5ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1897.127,
            "range": "± 51.633",
            "unit": "ns/op",
            "extra": "avg 1899.4ns, min 1759.8ns, p99 2032.8ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3248.316,
            "range": "± 48.787",
            "unit": "ns/op",
            "extra": "avg 3248.0ns, min 3078.9ns, p99 3405.8ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2461.454,
            "range": "± 40.782",
            "unit": "ns/op",
            "extra": "avg 2459.2ns, min 2324.1ns, p99 2650.1ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3580.817,
            "range": "± 119.886",
            "unit": "ns/op",
            "extra": "avg 3650.9ns, min 3450.5ns, p99 4089.8ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1890.655,
            "range": "± 33.481",
            "unit": "ns/op",
            "extra": "avg 1885.1ns, min 1793.4ns, p99 1992.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6109,
            "range": "± 822",
            "unit": "ns/op",
            "extra": "avg 7078.1ns, min 4937.0ns, p99 21783.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3341.158,
            "range": "± 54.545",
            "unit": "ns/op",
            "extra": "avg 3351.5ns, min 3209.8ns, p99 3610.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3783.049,
            "range": "± 47.875",
            "unit": "ns/op",
            "extra": "avg 3787.3ns, min 3648.1ns, p99 3913.2ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 9871.94,
            "range": "± 43.124",
            "unit": "ns/op",
            "extra": "avg 9887.6ns, min 9710.7ns, p99 9984.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13415.727,
            "range": "± 479.33",
            "unit": "ns/op",
            "extra": "avg 13715.8ns, min 13277.6ns, p99 14241.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.621,
            "range": "± 0",
            "unit": "ns/op",
            "extra": "avg 0.7ns, min 0.6ns, p99 4.0ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.651,
            "range": "± 0.042",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 5.6ns, p99 13.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.159,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 2.9ns, min 2.1ns, p99 10.8ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.741,
            "range": "± 1.404",
            "unit": "ns/op",
            "extra": "avg 9.3ns, min 5.8ns, p99 23.1ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.074,
            "range": "± 0.073",
            "unit": "ns/op",
            "extra": "avg 8.2ns, min 6.6ns, p99 10.6ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.874,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 11.1ns, min 10.6ns, p99 14.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 4.907,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.8ns, p99 7.0ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.788,
            "range": "± 0.063",
            "unit": "ns/op",
            "extra": "avg 11.0ns, min 10.6ns, p99 13.2ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.475,
            "range": "± 0.042",
            "unit": "ns/op",
            "extra": "avg 5.6ns, min 5.4ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.937,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 9.1ns, min 8.8ns, p99 13.5ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.081,
            "range": "± 0.054",
            "unit": "ns/op",
            "extra": "avg 6.3ns, min 6.0ns, p99 11.9ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.406,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 9.5ns, min 9.3ns, p99 11.9ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 522.403,
            "range": "± 7.333",
            "unit": "ns/op",
            "extra": "avg 537.5ns, min 509.4ns, p99 779.8ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 863.707,
            "range": "± 13.583",
            "unit": "ns/op",
            "extra": "avg 882.7ns, min 838.7ns, p99 1050.3ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.34,
            "range": "± 0.017",
            "unit": "ns/op",
            "extra": "avg 12.5ns, min 12.2ns, p99 17.0ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 106.77,
            "range": "± 1.626",
            "unit": "ns/op",
            "extra": "avg 110.2ns, min 103.7ns, p99 204.3ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13521,
            "range": "± 1141",
            "unit": "ns/op",
            "extra": "avg 14763.1ns, min 11067.0ns, p99 34251.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6468.948,
            "range": "± 57.386",
            "unit": "ns/op",
            "extra": "avg 6479.2ns, min 6319.3ns, p99 6673.1ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 14313.117,
            "range": "± 527.464",
            "unit": "ns/op",
            "extra": "avg 14810.5ns, min 13916.4ns, p99 15078.9ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 18515.291,
            "range": "± 147.42",
            "unit": "ns/op",
            "extra": "avg 18552.4ns, min 18300.1ns, p99 18840.1ns"
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
          "id": "2df1df52bb66d5df37cc31ef624e2b437c0df4c2",
          "message": "style: brace the bodies oxfmt wraps, and stop the lint fight causing it\n\n`curly: multi-or-nest` from the shared config and oxfmt disagreed about who\nowns line breaking, so a statement past `printWidth` got braces from the\nformatter and had them reported by the linter. Three files carried hand\nshortened lines written to dodge that.\n\nThe real fix is `curly: multi-line` in @imranbarbhuiya/oxc-config, committed\nthere. This adds it as a local override until that release lands, and takes the\nformatting that follows from it. Lexer and Slice had bodies on their own line\nwithout braces already, which is the shape the rule is meant to catch.",
          "timestamp": "2026-08-31T01:13:45+05:30",
          "tree_id": "35105284dccb75ba2c62c684bc52766978a01d21",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/2df1df52bb66d5df37cc31ef624e2b437c0df4c2"
        },
        "date": 1788150879487,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 295.814,
            "range": "± 4.308",
            "unit": "ns/op",
            "extra": "avg 310.7ns, min 288.3ns, p99 610.7ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 448.608,
            "range": "± 3.729",
            "unit": "ns/op",
            "extra": "avg 458.2ns, min 442.0ns, p99 532.2ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 585.904,
            "range": "± 5.237",
            "unit": "ns/op",
            "extra": "avg 597.3ns, min 579.1ns, p99 661.7ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 690.105,
            "range": "± 50.133",
            "unit": "ns/op",
            "extra": "avg 707.9ns, min 681.1ns, p99 810.9ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 662.556,
            "range": "± 12.131",
            "unit": "ns/op",
            "extra": "avg 676.7ns, min 652.4ns, p99 748.8ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2227.544,
            "range": "± 34.5",
            "unit": "ns/op",
            "extra": "avg 2310.3ns, min 2139.8ns, p99 3129.8ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1081.627,
            "range": "± 57.756",
            "unit": "ns/op",
            "extra": "avg 1103.8ns, min 1060.9ns, p99 1239.1ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 97.436,
            "range": "± 1.582",
            "unit": "ns/op",
            "extra": "avg 97.5ns, min 81.4ns, p99 162.7ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 86.612,
            "range": "± 1.995",
            "unit": "ns/op",
            "extra": "avg 89.7ns, min 81.5ns, p99 152.2ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 160.638,
            "range": "± 2.55",
            "unit": "ns/op",
            "extra": "avg 168.8ns, min 154.8ns, p99 246.9ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2214.287,
            "range": "± 43.494",
            "unit": "ns/op",
            "extra": "avg 2187.3ns, min 2062.7ns, p99 2279.2ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5288,
            "range": "± 651",
            "unit": "ns/op",
            "extra": "avg 6079.9ns, min 4166.0ns, p99 16095.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2209.708,
            "range": "± 112.344",
            "unit": "ns/op",
            "extra": "avg 2372.5ns, min 2089.0ns, p99 3609.6ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1796.838,
            "range": "± 23.771",
            "unit": "ns/op",
            "extra": "avg 1800.3ns, min 1701.6ns, p99 1996.2ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 4850.555,
            "range": "± 84.211",
            "unit": "ns/op",
            "extra": "avg 4847.0ns, min 4660.6ns, p99 5067.1ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3004.717,
            "range": "± 25.498",
            "unit": "ns/op",
            "extra": "avg 3003.4ns, min 2892.6ns, p99 3122.5ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4162.249,
            "range": "± 43.712",
            "unit": "ns/op",
            "extra": "avg 4174.1ns, min 4030.6ns, p99 4255.1ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6186.68,
            "range": "± 142.331",
            "unit": "ns/op",
            "extra": "avg 6215.4ns, min 6022.1ns, p99 6475.3ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1979.013,
            "range": "± 53.998",
            "unit": "ns/op",
            "extra": "avg 1986.8ns, min 1827.2ns, p99 2196.7ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2157.674,
            "range": "± 35.797",
            "unit": "ns/op",
            "extra": "avg 2165.2ns, min 2022.3ns, p99 2430.6ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2586.705,
            "range": "± 34.838",
            "unit": "ns/op",
            "extra": "avg 2584.0ns, min 2476.3ns, p99 2701.6ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2416.196,
            "range": "± 24.933",
            "unit": "ns/op",
            "extra": "avg 2415.2ns, min 2317.3ns, p99 2518.8ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3370.143,
            "range": "± 61.85",
            "unit": "ns/op",
            "extra": "avg 3376.1ns, min 3263.4ns, p99 3515.9ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3384.764,
            "range": "± 32.719",
            "unit": "ns/op",
            "extra": "avg 3386.4ns, min 3262.4ns, p99 3503.1ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 4911.594,
            "range": "± 32.611",
            "unit": "ns/op",
            "extra": "avg 4912.4ns, min 4822.3ns, p99 5067.8ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1925.998,
            "range": "± 35.024",
            "unit": "ns/op",
            "extra": "avg 1914.2ns, min 1819.6ns, p99 2075.1ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2384.916,
            "range": "± 29.875",
            "unit": "ns/op",
            "extra": "avg 2380.5ns, min 2293.5ns, p99 2456.0ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4413.981,
            "range": "± 97.8",
            "unit": "ns/op",
            "extra": "avg 4437.9ns, min 4210.6ns, p99 4665.9ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 2936.357,
            "range": "± 26.053",
            "unit": "ns/op",
            "extra": "avg 2932.8ns, min 2824.7ns, p99 3027.5ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3005.537,
            "range": "± 41.264",
            "unit": "ns/op",
            "extra": "avg 3017.3ns, min 2884.6ns, p99 3209.5ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.315,
            "range": "± 1.404",
            "unit": "ns/op",
            "extra": "avg 35.8ns, min 32.5ns, p99 87.6ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.538,
            "range": "± 0",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.935,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 12.6ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.88,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.2ns, p99 6.9ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 435.178,
            "range": "± 40.509",
            "unit": "ns/op",
            "extra": "avg 457.3ns, min 423.7ns, p99 688.9ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4300.445,
            "range": "± 72.241",
            "unit": "ns/op",
            "extra": "avg 4315.6ns, min 4165.4ns, p99 4534.2ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 20950.82,
            "range": "± 435.228",
            "unit": "ns/op",
            "extra": "avg 21302.5ns, min 20608.5ns, p99 22380.5ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 14563.724,
            "range": "± 62.974",
            "unit": "ns/op",
            "extra": "avg 14597.7ns, min 14408.3ns, p99 14707.3ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 16460.142,
            "range": "± 96.734",
            "unit": "ns/op",
            "extra": "avg 16457.6ns, min 16106.0ns, p99 16708.8ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 201327,
            "range": "± 7370",
            "unit": "ns/op",
            "extra": "avg 209103.1ns, min 183380.0ns, p99 324334.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 16150.862,
            "range": "± 277.138",
            "unit": "ns/op",
            "extra": "avg 16414.1ns, min 15970.3ns, p99 17245.6ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1940.218,
            "range": "± 21.258",
            "unit": "ns/op",
            "extra": "avg 1956.1ns, min 1921.7ns, p99 2044.3ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4248.51,
            "range": "± 81.352",
            "unit": "ns/op",
            "extra": "avg 4251.8ns, min 4061.0ns, p99 4463.6ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 143.104,
            "range": "± 5.242",
            "unit": "ns/op",
            "extra": "avg 157.5ns, min 133.3ns, p99 223.7ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 2854,
            "range": "± 621",
            "unit": "ns/op",
            "extra": "avg 3692.7ns, min 2253.0ns, p99 12519.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3125.706,
            "range": "± 57.817",
            "unit": "ns/op",
            "extra": "avg 3180.8ns, min 3037.9ns, p99 3585.4ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1756.009,
            "range": "± 42.912",
            "unit": "ns/op",
            "extra": "avg 1764.6ns, min 1662.7ns, p99 1948.9ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3025.412,
            "range": "± 38.479",
            "unit": "ns/op",
            "extra": "avg 3031.4ns, min 2943.8ns, p99 3157.3ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2295.712,
            "range": "± 25.738",
            "unit": "ns/op",
            "extra": "avg 2291.6ns, min 2187.7ns, p99 2468.2ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3376.604,
            "range": "± 45.765",
            "unit": "ns/op",
            "extra": "avg 3392.5ns, min 3324.8ns, p99 3515.3ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1768.791,
            "range": "± 18.414",
            "unit": "ns/op",
            "extra": "avg 1755.5ns, min 1686.8ns, p99 1856.3ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6079,
            "range": "± 782",
            "unit": "ns/op",
            "extra": "avg 6989.4ns, min 4947.0ns, p99 20611.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3267.172,
            "range": "± 38.54",
            "unit": "ns/op",
            "extra": "avg 3260.4ns, min 3143.0ns, p99 3427.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3596.534,
            "range": "± 50.531",
            "unit": "ns/op",
            "extra": "avg 3624.5ns, min 3562.2ns, p99 3790.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 9580.552,
            "range": "± 24.351",
            "unit": "ns/op",
            "extra": "avg 9616.9ns, min 9420.3ns, p99 9974.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13320.267,
            "range": "± 112.581",
            "unit": "ns/op",
            "extra": "avg 13306.7ns, min 13004.8ns, p99 13482.9ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.621,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 0.7ns, min 0.6ns, p99 5.2ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.644,
            "range": "± 0.041",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 5.5ns, p99 9.2ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.152,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 2.8ns, min 2.1ns, p99 6.1ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.727,
            "range": "± 1.426",
            "unit": "ns/op",
            "extra": "avg 8.6ns, min 5.9ns, p99 12.4ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.145,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 8.2ns, min 6.1ns, p99 10.7ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.869,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 11.0ns, min 10.5ns, p99 14.3ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 4.9,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.8ns, p99 8.4ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.944,
            "range": "± 0.056",
            "unit": "ns/op",
            "extra": "avg 11.1ns, min 10.8ns, p99 14.0ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.467,
            "range": "± 0.046",
            "unit": "ns/op",
            "extra": "avg 5.6ns, min 5.4ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.822,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 8.9ns, min 8.6ns, p99 11.4ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.047,
            "range": "± 0.054",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 6.0ns, p99 8.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.411,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 9.5ns, min 9.3ns, p99 11.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 510.65,
            "range": "± 6.02",
            "unit": "ns/op",
            "extra": "avg 525.5ns, min 504.8ns, p99 628.2ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 803.502,
            "range": "± 22.133",
            "unit": "ns/op",
            "extra": "avg 822.1ns, min 786.0ns, p99 924.7ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.304,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 12.4ns, min 12.2ns, p99 15.2ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 104.546,
            "range": "± 1.519",
            "unit": "ns/op",
            "extra": "avg 107.2ns, min 101.8ns, p99 186.5ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13230,
            "range": "± 1182",
            "unit": "ns/op",
            "extra": "avg 14538.3ns, min 10987.0ns, p99 34552.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6070.604,
            "range": "± 54.969",
            "unit": "ns/op",
            "extra": "avg 6075.2ns, min 5932.2ns, p99 6310.8ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 13884.805,
            "range": "± 18.089",
            "unit": "ns/op",
            "extra": "avg 13889.8ns, min 13813.2ns, p99 13992.0ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 17861.899,
            "range": "± 157.996",
            "unit": "ns/op",
            "extra": "avg 18064.2ns, min 17717.0ns, p99 18082.4ns"
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
          "id": "3ecd8e1abb5834ae92dea3689dfe2fb199c556c3",
          "message": "feat!: give the discord plugin an effect entry point, and let cooldowns work\n\n`@tagscript/plugin-discord/effect`, same subpath shape as core, with `effect`\nas an optional peer so the classic entry point is untouched.\n\n`cooldownParser` is why this exists. The classic one cannot enforce anything,\nbecause a parser has no way to reach a store, so it writes what the template\nasked for to `response.actions.cooldown` and leaves the job to the bot author.\nThis one asks for a `CooldownStore` and does it, failing with `OnCooldown` and\nfilling `{retryAfter}` and `{name}` into the message the template wrote. An\nin-memory layer ships; a Redis layer is documented rather than shipped, because\nthe service is one method and `SET NX EX` is not ours to depend on.\n\n`hit` records the use and reports what is left in one call, so two concurrent\nrenders cannot both pass the check.\n\n`dateFormatParser` reads the clock through `DateTime`, so `TestClock.setTime`\npins it. The classic parser calls `Date.now()` and cannot be pinned.\n\n`embedParser` reports malformed JSON as a `TemplateError` and checks the four\nlength limits Discord enforces, so a template author reads `embed title is 300\ncharacters, and Discord allows 256` at render time instead of the bot author\nreading an API rejection later. `Schema` was measured for this at +12.3 KB\ngzipped and rejected: for a shape as fixed as `APIEmbed` it buys generic\nmessages that read worse than four hand-written checks.\n\nThe plugin declares `tagName` on `IKeyValues` so cooldown keys are typed.\n\nBREAKING CHANGE: `engines.node` is `^20.19.0 || >=22.12.0`, up from `>=18.0.0`.\nThat is the floor for `require(esm)`, which is how the CommonJS build reaches\nthe ESM-only `effect`.",
          "timestamp": "2026-08-31T21:16:46+05:30",
          "tree_id": "99692d01be8f4855982f07ca0d530d00cee85ebb",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/3ecd8e1abb5834ae92dea3689dfe2fb199c556c3"
        },
        "date": 1788191600367,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 237.854,
            "range": "± 6.193",
            "unit": "ns/op",
            "extra": "avg 251.0ns, min 230.2ns, p99 490.5ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 362.035,
            "range": "± 2.699",
            "unit": "ns/op",
            "extra": "avg 374.1ns, min 356.2ns, p99 446.9ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 477.675,
            "range": "± 5.137",
            "unit": "ns/op",
            "extra": "avg 489.9ns, min 465.4ns, p99 567.8ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 572.152,
            "range": "± 9.482",
            "unit": "ns/op",
            "extra": "avg 589.3ns, min 563.7ns, p99 689.9ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 542.912,
            "range": "± 8.218",
            "unit": "ns/op",
            "extra": "avg 555.7ns, min 530.6ns, p99 628.0ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 1814.67,
            "range": "± 53.989",
            "unit": "ns/op",
            "extra": "avg 1835.2ns, min 1769.0ns, p99 1926.7ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 896.008,
            "range": "± 62.583",
            "unit": "ns/op",
            "extra": "avg 943.6ns, min 865.6ns, p99 1648.9ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 64.537,
            "range": "± 1.23",
            "unit": "ns/op",
            "extra": "avg 66.1ns, min 61.9ns, p99 135.0ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 57.585,
            "range": "± 1.303",
            "unit": "ns/op",
            "extra": "avg 60.2ns, min 54.9ns, p99 126.2ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 107.74,
            "range": "± 1.905",
            "unit": "ns/op",
            "extra": "avg 113.1ns, min 103.5ns, p99 183.1ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 1550.679,
            "range": "± 66.295",
            "unit": "ns/op",
            "extra": "avg 1568.7ns, min 1450.5ns, p99 1685.4ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 4306,
            "range": "± 571",
            "unit": "ns/op",
            "extra": "avg 4932.7ns, min 3164.0ns, p99 12229.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 1960.348,
            "range": "± 39.14",
            "unit": "ns/op",
            "extra": "avg 1962.5ns, min 1852.1ns, p99 2220.2ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1602.238,
            "range": "± 45.113",
            "unit": "ns/op",
            "extra": "avg 1608.1ns, min 1494.0ns, p99 1784.9ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 4322.207,
            "range": "± 190.463",
            "unit": "ns/op",
            "extra": "avg 4385.4ns, min 4095.3ns, p99 4751.0ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 2642.65,
            "range": "± 62.84",
            "unit": "ns/op",
            "extra": "avg 2648.6ns, min 2479.7ns, p99 2841.5ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 3875.56,
            "range": "± 199.51",
            "unit": "ns/op",
            "extra": "avg 3901.0ns, min 3550.4ns, p99 4327.0ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 5386.048,
            "range": "± 105.921",
            "unit": "ns/op",
            "extra": "avg 5394.4ns, min 5196.5ns, p99 5626.5ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1799.134,
            "range": "± 99.442",
            "unit": "ns/op",
            "extra": "avg 1822.3ns, min 1621.4ns, p99 2165.5ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 1896.554,
            "range": "± 51.708",
            "unit": "ns/op",
            "extra": "avg 1899.9ns, min 1767.3ns, p99 2117.2ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2338.451,
            "range": "± 54.361",
            "unit": "ns/op",
            "extra": "avg 2363.5ns, min 2206.5ns, p99 2681.0ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2151.897,
            "range": "± 36.705",
            "unit": "ns/op",
            "extra": "avg 2145.3ns, min 2055.0ns, p99 2249.9ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 2966.616,
            "range": "± 77.315",
            "unit": "ns/op",
            "extra": "avg 2970.5ns, min 2793.6ns, p99 3161.5ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 2983.643,
            "range": "± 44.593",
            "unit": "ns/op",
            "extra": "avg 2976.7ns, min 2807.2ns, p99 3069.8ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 4298.628,
            "range": "± 45.008",
            "unit": "ns/op",
            "extra": "avg 4298.2ns, min 4194.5ns, p99 4397.6ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1701.015,
            "range": "± 63.236",
            "unit": "ns/op",
            "extra": "avg 1711.9ns, min 1618.4ns, p99 1839.9ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2197.791,
            "range": "± 47.402",
            "unit": "ns/op",
            "extra": "avg 2196.5ns, min 2062.4ns, p99 2317.4ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 3872.495,
            "range": "± 280.532",
            "unit": "ns/op",
            "extra": "avg 3953.9ns, min 3661.7ns, p99 4206.6ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 2644.612,
            "range": "± 56.033",
            "unit": "ns/op",
            "extra": "avg 2644.0ns, min 2490.8ns, p99 2763.8ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 2627.435,
            "range": "± 33.243",
            "unit": "ns/op",
            "extra": "avg 2623.5ns, min 2512.9ns, p99 2758.6ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 26.057,
            "range": "± 0.384",
            "unit": "ns/op",
            "extra": "avg 27.2ns, min 25.3ns, p99 41.9ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.418,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.5ns, min 0.4ns, p99 4.0ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 7.712,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 7.8ns, min 7.7ns, p99 9.7ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 3.8,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 3.8ns, min 3.4ns, p99 5.3ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 373.9,
            "range": "± 16.289",
            "unit": "ns/op",
            "extra": "avg 391.8ns, min 365.1ns, p99 479.1ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 3760.336,
            "range": "± 61.825",
            "unit": "ns/op",
            "extra": "avg 3753.0ns, min 3548.9ns, p99 3888.3ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 18166.461,
            "range": "± 133.961",
            "unit": "ns/op",
            "extra": "avg 18400.5ns, min 17791.1ns, p99 19238.6ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 12504.662,
            "range": "± 20.01",
            "unit": "ns/op",
            "extra": "avg 12526.2ns, min 12376.5ns, p99 12637.6ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 14542.114,
            "range": "± 96.852",
            "unit": "ns/op",
            "extra": "avg 14543.0ns, min 14129.7ns, p99 14750.8ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 176162,
            "range": "± 5658",
            "unit": "ns/op",
            "extra": "avg 183047.0ns, min 160828.0ns, p99 254929.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 14253.212,
            "range": "± 55.781",
            "unit": "ns/op",
            "extra": "avg 14448.4ns, min 14190.8ns, p99 14706.6ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1677.57,
            "range": "± 21.8",
            "unit": "ns/op",
            "extra": "avg 1695.2ns, min 1661.2ns, p99 1798.4ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 3558.146,
            "range": "± 52.187",
            "unit": "ns/op",
            "extra": "avg 3562.9ns, min 3398.4ns, p99 3721.0ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 134.954,
            "range": "± 4.206",
            "unit": "ns/op",
            "extra": "avg 148.1ns, min 127.5ns, p99 218.8ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 351.183,
            "range": "± 8.357",
            "unit": "ns/op",
            "extra": "avg 369.4ns, min 341.2ns, p99 559.2ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 2594,
            "range": "± 490.000",
            "unit": "ns/op",
            "extra": "avg 3143.4ns, min 1643.0ns, p99 9354.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 3893.361,
            "range": "± 70.131",
            "unit": "ns/op",
            "extra": "avg 3873.8ns, min 3717.6ns, p99 4070.9ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 6249,
            "range": "± 901.000",
            "unit": "ns/op",
            "extra": "avg 7278.0ns, min 4367.0ns, p99 16956.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 18191.865,
            "range": "± 135.922",
            "unit": "ns/op",
            "extra": "avg 18223.9ns, min 17969.8ns, p99 18368.1ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 25087,
            "range": "± 2624.000",
            "unit": "ns/op",
            "extra": "avg 27196.9ns, min 19720.0ns, p99 44556.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 12583.715,
            "range": "± 109.552",
            "unit": "ns/op",
            "extra": "avg 12606.8ns, min 12423.7ns, p99 12774.7ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 17628.025,
            "range": "± 357.780",
            "unit": "ns/op",
            "extra": "avg 17839.2ns, min 17238.3ns, p99 18586.4ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 178345,
            "range": "± 5478.000",
            "unit": "ns/op",
            "extra": "avg 184497.8ns, min 152206.0ns, p99 236882.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 212245,
            "range": "± 8002.000",
            "unit": "ns/op",
            "extra": "avg 222753.7ns, min 188090.0ns, p99 783574.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 2303,
            "range": "± 361",
            "unit": "ns/op",
            "extra": "avg 2700.7ns, min 1733.0ns, p99 7501.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 2647.624,
            "range": "± 43.891",
            "unit": "ns/op",
            "extra": "avg 2664.5ns, min 2550.5ns, p99 2892.0ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1534.264,
            "range": "± 31.328",
            "unit": "ns/op",
            "extra": "avg 1534.8ns, min 1445.0ns, p99 1630.5ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 2560.906,
            "range": "± 27.602",
            "unit": "ns/op",
            "extra": "avg 2575.0ns, min 2490.7ns, p99 2721.0ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 1960.295,
            "range": "± 31.287",
            "unit": "ns/op",
            "extra": "avg 1954.9ns, min 1863.4ns, p99 2057.6ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 2916.246,
            "range": "± 39.602",
            "unit": "ns/op",
            "extra": "avg 2924.2ns, min 2843.0ns, p99 3017.8ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1530.513,
            "range": "± 18.685",
            "unit": "ns/op",
            "extra": "avg 1516.8ns, min 1448.5ns, p99 1584.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 5071.823,
            "range": "± 51.652",
            "unit": "ns/op",
            "extra": "avg 5076.7ns, min 4922.0ns, p99 5177.7ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 2765.001,
            "range": "± 28.443",
            "unit": "ns/op",
            "extra": "avg 2777.6ns, min 2641.9ns, p99 2935.2ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3108.331,
            "range": "± 34.365",
            "unit": "ns/op",
            "extra": "avg 3115.0ns, min 3035.9ns, p99 3205.9ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 8490.39,
            "range": "± 83.178",
            "unit": "ns/op",
            "extra": "avg 8527.1ns, min 8308.8ns, p99 8694.3ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 11118.112,
            "range": "± 80.669",
            "unit": "ns/op",
            "extra": "avg 11193.3ns, min 10910.8ns, p99 11618.4ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.484,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.5ns, min 0.5ns, p99 2.1ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 4.382,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 4.6ns, min 4.3ns, p99 7.0ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 1.675,
            "range": "± 0.012",
            "unit": "ns/op",
            "extra": "avg 2.1ns, min 1.7ns, p99 6.7ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 6.685,
            "range": "± 1.196",
            "unit": "ns/op",
            "extra": "avg 6.2ns, min 4.5ns, p99 13.1ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 6.318,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 6.4ns, min 4.8ns, p99 8.1ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 8.21,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 8.1ns, p99 10.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 3.878,
            "range": "± 0.036",
            "unit": "ns/op",
            "extra": "avg 3.9ns, min 3.8ns, p99 5.6ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 8.201,
            "range": "± 0.073",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 8.1ns, p99 10.3ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 4.325,
            "range": "± 0.024",
            "unit": "ns/op",
            "extra": "avg 4.4ns, min 4.3ns, p99 6.2ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 6.934,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 7.0ns, min 6.8ns, p99 8.7ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 4.721,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 4.8ns, min 4.7ns, p99 6.5ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 7.325,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 7.4ns, min 7.2ns, p99 9.1ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 402.478,
            "range": "± 5.279",
            "unit": "ns/op",
            "extra": "avg 411.9ns, min 390.8ns, p99 495.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 680.092,
            "range": "± 20.792",
            "unit": "ns/op",
            "extra": "avg 696.5ns, min 656.0ns, p99 814.4ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 9.558,
            "range": "± 0.012",
            "unit": "ns/op",
            "extra": "avg 9.6ns, min 9.5ns, p99 11.6ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 83.513,
            "range": "± 1.335",
            "unit": "ns/op",
            "extra": "avg 85.9ns, min 81.2ns, p99 162.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 11007,
            "range": "± 881",
            "unit": "ns/op",
            "extra": "avg 11850.0ns, min 8873.0ns, p99 27741.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 4890.267,
            "range": "± 66.923",
            "unit": "ns/op",
            "extra": "avg 4909.0ns, min 4791.9ns, p99 5038.1ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 11960.773,
            "range": "± 18.037",
            "unit": "ns/op",
            "extra": "avg 11935.0ns, min 11754.4ns, p99 12076.2ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 14867.696,
            "range": "± 215.141",
            "unit": "ns/op",
            "extra": "avg 14976.7ns, min 14694.7ns, p99 15308.3ns"
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
          "id": "ce1450d40343b11dec44d1cbfe73201c3f8fed5f",
          "message": "fix: pin the plugin's peer on tagscript, and order releases by dependency\n\nThe plugin declared `\"tagscript\": \"*\"`, which was fine while it only used the\nclassic entry point. Its Effect entry imports `tagscript/effect`, which does not\nexist before 3.0.0, so someone could install this alongside tagscript 2 and get\na module resolution failure at runtime with no warning at install time.\n\n`workspace:^` instead, which the release workflow already rewrites to the\nconcrete version for the published manifest.\n\nThat rewrite reads the version at the tag's commit, so a package has to be\nbumped after anything it depends on. The order was whatever `readdir` returned,\nwhich happens to be right for these two names and is not promised by anything.\nSorted by workspace dependency now.",
          "timestamp": "2026-08-31T21:24:31+05:30",
          "tree_id": "bd2131094fd5b39064e2269ef95633cc84493391",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/ce1450d40343b11dec44d1cbfe73201c3f8fed5f"
        },
        "date": 1788191822667,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 297.908,
            "range": "± 4.768",
            "unit": "ns/op",
            "extra": "avg 315.3ns, min 288.8ns, p99 584.2ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 467.031,
            "range": "± 8.17",
            "unit": "ns/op",
            "extra": "avg 480.1ns, min 447.5ns, p99 585.4ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 596.134,
            "range": "± 9.868",
            "unit": "ns/op",
            "extra": "avg 612.1ns, min 584.7ns, p99 687.8ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 693.87,
            "range": "± 58.222",
            "unit": "ns/op",
            "extra": "avg 716.3ns, min 677.1ns, p99 831.0ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 668.341,
            "range": "± 61.469",
            "unit": "ns/op",
            "extra": "avg 697.4ns, min 645.0ns, p99 1002.3ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2206.098,
            "range": "± 22.411",
            "unit": "ns/op",
            "extra": "avg 2210.3ns, min 2101.3ns, p99 2364.4ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1107.072,
            "range": "± 34.556",
            "unit": "ns/op",
            "extra": "avg 1157.9ns, min 1036.9ns, p99 1844.6ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 81.716,
            "range": "± 1.834",
            "unit": "ns/op",
            "extra": "avg 84.9ns, min 78.2ns, p99 154.8ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 87.714,
            "range": "± 1.765",
            "unit": "ns/op",
            "extra": "avg 92.0ns, min 83.9ns, p99 167.4ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 160.146,
            "range": "± 3.21",
            "unit": "ns/op",
            "extra": "avg 168.5ns, min 153.7ns, p99 242.6ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2256.461,
            "range": "± 49.197",
            "unit": "ns/op",
            "extra": "avg 2274.2ns, min 2224.0ns, p99 2355.6ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5239,
            "range": "± 640",
            "unit": "ns/op",
            "extra": "avg 6027.6ns, min 3996.0ns, p99 14965.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2151.489,
            "range": "± 82.292",
            "unit": "ns/op",
            "extra": "avg 2203.2ns, min 2004.7ns, p99 2806.7ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1798.118,
            "range": "± 39.542",
            "unit": "ns/op",
            "extra": "avg 1825.1ns, min 1690.1ns, p99 2317.9ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 4770.242,
            "range": "± 148.862",
            "unit": "ns/op",
            "extra": "avg 4800.4ns, min 4539.8ns, p99 5225.1ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 2918.2,
            "range": "± 28.987",
            "unit": "ns/op",
            "extra": "avg 2935.5ns, min 2855.7ns, p99 3116.4ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4058.069,
            "range": "± 104.843",
            "unit": "ns/op",
            "extra": "avg 4101.0ns, min 3955.0ns, p99 4527.5ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6043.567,
            "range": "± 319.141",
            "unit": "ns/op",
            "extra": "avg 6135.1ns, min 5878.0ns, p99 6481.4ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1918.256,
            "range": "± 41.075",
            "unit": "ns/op",
            "extra": "avg 1930.6ns, min 1775.3ns, p99 2169.2ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2084.772,
            "range": "± 71.01",
            "unit": "ns/op",
            "extra": "avg 2108.5ns, min 1958.2ns, p99 2338.5ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2534.024,
            "range": "± 43.66",
            "unit": "ns/op",
            "extra": "avg 2549.8ns, min 2425.5ns, p99 2720.8ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2552.284,
            "range": "± 41.099",
            "unit": "ns/op",
            "extra": "avg 2524.0ns, min 2267.7ns, p99 2677.1ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3494.966,
            "range": "± 84.544",
            "unit": "ns/op",
            "extra": "avg 3484.9ns, min 3222.7ns, p99 3704.3ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3434.941,
            "range": "± 53.731",
            "unit": "ns/op",
            "extra": "avg 3436.9ns, min 3233.2ns, p99 3640.6ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5059.47,
            "range": "± 137.958",
            "unit": "ns/op",
            "extra": "avg 5098.4ns, min 4900.9ns, p99 5360.4ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1903.642,
            "range": "± 52.929",
            "unit": "ns/op",
            "extra": "avg 1913.4ns, min 1772.0ns, p99 2133.0ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2401.706,
            "range": "± 39.295",
            "unit": "ns/op",
            "extra": "avg 2401.5ns, min 2277.4ns, p99 2526.2ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4319.573,
            "range": "± 197.706",
            "unit": "ns/op",
            "extra": "avg 4368.8ns, min 4024.3ns, p99 4715.7ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 2842.313,
            "range": "± 34.63",
            "unit": "ns/op",
            "extra": "avg 2864.9ns, min 2799.9ns, p99 3030.2ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 2863.101,
            "range": "± 46.748",
            "unit": "ns/op",
            "extra": "avg 2886.8ns, min 2821.5ns, p99 3062.0ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 32.887,
            "range": "± 0.596",
            "unit": "ns/op",
            "extra": "avg 35.1ns, min 32.3ns, p99 78.5ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.538,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.873,
            "range": "± 0.012",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 15.1ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.91,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.5ns, p99 6.9ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 447.957,
            "range": "± 69.58",
            "unit": "ns/op",
            "extra": "avg 477.3ns, min 436.0ns, p99 598.4ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4256.58,
            "range": "± 105.23",
            "unit": "ns/op",
            "extra": "avg 4277.9ns, min 4154.4ns, p99 4451.3ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 21106.338,
            "range": "± 369.704",
            "unit": "ns/op",
            "extra": "avg 21475.2ns, min 20563.5ns, p99 23102.3ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 14302.519,
            "range": "± 94.268",
            "unit": "ns/op",
            "extra": "avg 14425.5ns, min 14117.0ns, p99 14977.3ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 16420.265,
            "range": "± 183.979",
            "unit": "ns/op",
            "extra": "avg 16492.6ns, min 16163.7ns, p99 16689.8ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 204178,
            "range": "± 6580",
            "unit": "ns/op",
            "extra": "avg 213851.0ns, min 188515.0ns, p99 415157.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 19977.464,
            "range": "± 37.918",
            "unit": "ns/op",
            "extra": "avg 20116.0ns, min 19662.0ns, p99 20306.3ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 2444.826,
            "range": "± 29.608",
            "unit": "ns/op",
            "extra": "avg 2466.9ns, min 2412.2ns, p99 2576.4ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4170.801,
            "range": "± 93.992",
            "unit": "ns/op",
            "extra": "avg 4193.7ns, min 4013.1ns, p99 4391.4ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 134.979,
            "range": "± 12.309",
            "unit": "ns/op",
            "extra": "avg 154.5ns, min 124.1ns, p99 238.8ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 496.814,
            "range": "± 27.324",
            "unit": "ns/op",
            "extra": "avg 517.1ns, min 483.8ns, p99 619.4ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 2914,
            "range": "± 551",
            "unit": "ns/op",
            "extra": "avg 3621.8ns, min 1913.0ns, p99 11378.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 4500.706,
            "range": "± 52.826",
            "unit": "ns/op",
            "extra": "avg 4500.0ns, min 4321.3ns, p99 4695.6ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 7392,
            "range": "± 970",
            "unit": "ns/op",
            "extra": "avg 8578.5ns, min 5379.0ns, p99 19951.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 21890.612,
            "range": "± 103.927",
            "unit": "ns/op",
            "extra": "avg 21936.6ns, min 21274.8ns, p99 22442.6ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 29965,
            "range": "± 2895",
            "unit": "ns/op",
            "extra": "avg 33205.5ns, min 24126.0ns, p99 63916.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 15161.941,
            "range": "± 218.11",
            "unit": "ns/op",
            "extra": "avg 15301.5ns, min 14931.0ns, p99 15795.1ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 19416.244,
            "range": "± 778.372",
            "unit": "ns/op",
            "extra": "avg 19790.8ns, min 18681.7ns, p99 21385.5ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 206711,
            "range": "± 7462",
            "unit": "ns/op",
            "extra": "avg 217200.7ns, min 192550.0ns, p99 389097.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 237929,
            "range": "± 10025",
            "unit": "ns/op",
            "extra": "avg 250196.8ns, min 211940.0ns, p99 871144.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 2945,
            "range": "± 651",
            "unit": "ns/op",
            "extra": "avg 3792.1ns, min 2293.0ns, p99 12819.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3169.101,
            "range": "± 49.953",
            "unit": "ns/op",
            "extra": "avg 3200.0ns, min 3097.2ns, p99 3452.9ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1760.023,
            "range": "± 38.86",
            "unit": "ns/op",
            "extra": "avg 1762.2ns, min 1634.8ns, p99 1910.5ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 2994.029,
            "range": "± 55.505",
            "unit": "ns/op",
            "extra": "avg 3012.7ns, min 2909.8ns, p99 3187.7ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2236.487,
            "range": "± 28.317",
            "unit": "ns/op",
            "extra": "avg 2234.0ns, min 2127.2ns, p99 2347.7ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3423.77,
            "range": "± 73.903",
            "unit": "ns/op",
            "extra": "avg 3437.0ns, min 3294.8ns, p99 3619.2ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1847.675,
            "range": "± 25.764",
            "unit": "ns/op",
            "extra": "avg 1838.8ns, min 1742.2ns, p99 1940.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6159,
            "range": "± 811",
            "unit": "ns/op",
            "extra": "avg 7106.7ns, min 4837.0ns, p99 21793.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3216.902,
            "range": "± 64.34",
            "unit": "ns/op",
            "extra": "avg 3258.5ns, min 3095.9ns, p99 3784.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3624.263,
            "range": "± 58.191",
            "unit": "ns/op",
            "extra": "avg 3644.6ns, min 3537.9ns, p99 3793.7ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 9832.444,
            "range": "± 43.034",
            "unit": "ns/op",
            "extra": "avg 9853.2ns, min 9608.4ns, p99 10081.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13142.788,
            "range": "± 373.841",
            "unit": "ns/op",
            "extra": "avg 13305.2ns, min 12942.3ns, p99 13664.6ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.621,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.7ns, min 0.6ns, p99 5.2ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.643,
            "range": "± 0.04",
            "unit": "ns/op",
            "extra": "avg 6.2ns, min 5.5ns, p99 11.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.154,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 2.9ns, min 2.1ns, p99 10.6ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.692,
            "range": "± 1.506",
            "unit": "ns/op",
            "extra": "avg 8.7ns, min 5.8ns, p99 17.5ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 7.873,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 8.0ns, min 6.3ns, p99 10.7ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.9,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 11.1ns, min 10.6ns, p99 13.6ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 4.888,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.8ns, p99 7.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.971,
            "range": "± 0.054",
            "unit": "ns/op",
            "extra": "avg 11.1ns, min 10.7ns, p99 14.2ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.47,
            "range": "± 0.037",
            "unit": "ns/op",
            "extra": "avg 5.6ns, min 5.4ns, p99 7.7ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.876,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 9.0ns, min 8.7ns, p99 11.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.054,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 6.0ns, p99 8.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.401,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 9.5ns, min 9.3ns, p99 11.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 511.827,
            "range": "± 4.8",
            "unit": "ns/op",
            "extra": "avg 527.4ns, min 505.0ns, p99 719.2ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 804.884,
            "range": "± 23.241",
            "unit": "ns/op",
            "extra": "avg 825.3ns, min 787.6ns, p99 950.3ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.338,
            "range": "± 0.015",
            "unit": "ns/op",
            "extra": "avg 12.5ns, min 12.2ns, p99 15.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 105.107,
            "range": "± 1.582",
            "unit": "ns/op",
            "extra": "avg 108.3ns, min 102.2ns, p99 187.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13621,
            "range": "± 1172",
            "unit": "ns/op",
            "extra": "avg 14801.7ns, min 11207.0ns, p99 32799.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6188.779,
            "range": "± 83.585",
            "unit": "ns/op",
            "extra": "avg 6190.6ns, min 5946.1ns, p99 6400.5ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 13879.807,
            "range": "± 53.846",
            "unit": "ns/op",
            "extra": "avg 13921.3ns, min 13779.3ns, p99 14036.2ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 17786.85,
            "range": "± 149.469",
            "unit": "ns/op",
            "extra": "avg 17863.4ns, min 17644.4ns, p99 18149.8ns"
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
          "id": "4c024d517ad2db81b17161606e912cf70d50b0f1",
          "message": "chore(plugin-discord): release @tagscript/plugin-discord@5.0.0",
          "timestamp": "2026-09-01T00:34:32+05:30",
          "tree_id": "9f942dd117b9c638c68b81c15f4831fe352c2883",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/4c024d517ad2db81b17161606e912cf70d50b0f1"
        },
        "date": 1788203177729,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 305.452,
            "range": "± 13.477",
            "unit": "ns/op",
            "extra": "avg 323.8ns, min 298.5ns, p99 582.6ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 462.116,
            "range": "± 8.874",
            "unit": "ns/op",
            "extra": "avg 473.7ns, min 450.8ns, p99 584.7ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 618.658,
            "range": "± 5.948",
            "unit": "ns/op",
            "extra": "avg 630.7ns, min 598.4ns, p99 707.1ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 719.696,
            "range": "± 22.525",
            "unit": "ns/op",
            "extra": "avg 747.8ns, min 711.6ns, p99 982.1ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 750.304,
            "range": "± 357.37",
            "unit": "ns/op",
            "extra": "avg 894.1ns, min 703.0ns, p99 1369.3ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2408.644,
            "range": "± 121.014",
            "unit": "ns/op",
            "extra": "avg 2460.2ns, min 2291.6ns, p99 2887.1ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1180.809,
            "range": "± 63.106",
            "unit": "ns/op",
            "extra": "avg 1232.0ns, min 1116.9ns, p99 1655.5ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 82.243,
            "range": "± 1.712",
            "unit": "ns/op",
            "extra": "avg 84.3ns, min 79.9ns, p99 159.8ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 72.824,
            "range": "± 1.925",
            "unit": "ns/op",
            "extra": "avg 76.1ns, min 71.2ns, p99 147.1ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 138.605,
            "range": "± 1.886",
            "unit": "ns/op",
            "extra": "avg 145.0ns, min 134.7ns, p99 222.4ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2074.476,
            "range": "± 7.372",
            "unit": "ns/op",
            "extra": "avg 2068.6ns, min 1995.2ns, p99 2114.3ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5701,
            "range": "± 761",
            "unit": "ns/op",
            "extra": "avg 6598.8ns, min 4709.0ns, p99 19146.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2171.089,
            "range": "± 53.963",
            "unit": "ns/op",
            "extra": "avg 2177.1ns, min 2040.0ns, p99 2406.6ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1754.348,
            "range": "± 65.987",
            "unit": "ns/op",
            "extra": "avg 1767.3ns, min 1627.7ns, p99 1999.6ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 4872.759,
            "range": "± 74.756",
            "unit": "ns/op",
            "extra": "avg 4881.0ns, min 4692.6ns, p99 5212.8ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 2906.943,
            "range": "± 61.685",
            "unit": "ns/op",
            "extra": "avg 2927.7ns, min 2780.0ns, p99 3158.8ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4141.986,
            "range": "± 50.69",
            "unit": "ns/op",
            "extra": "avg 4159.9ns, min 3997.1ns, p99 4381.3ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6222.704,
            "range": "± 97.337",
            "unit": "ns/op",
            "extra": "avg 6272.9ns, min 6089.7ns, p99 6553.5ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 1878.422,
            "range": "± 45.147",
            "unit": "ns/op",
            "extra": "avg 1876.7ns, min 1737.9ns, p99 2108.3ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2056.867,
            "range": "± 43.864",
            "unit": "ns/op",
            "extra": "avg 2061.9ns, min 1917.4ns, p99 2262.6ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2518.607,
            "range": "± 50.717",
            "unit": "ns/op",
            "extra": "avg 2526.6ns, min 2376.0ns, p99 2722.6ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2353.49,
            "range": "± 61.247",
            "unit": "ns/op",
            "extra": "avg 2361.0ns, min 2245.9ns, p99 2530.9ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3362.907,
            "range": "± 65.638",
            "unit": "ns/op",
            "extra": "avg 3361.5ns, min 3171.2ns, p99 3598.5ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3375.551,
            "range": "± 38.057",
            "unit": "ns/op",
            "extra": "avg 3383.2ns, min 3228.2ns, p99 3540.4ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 4755.62,
            "range": "± 70.534",
            "unit": "ns/op",
            "extra": "avg 4787.5ns, min 4691.9ns, p99 4939.1ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 1836.609,
            "range": "± 36.641",
            "unit": "ns/op",
            "extra": "avg 1824.4ns, min 1733.2ns, p99 1939.6ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2333.956,
            "range": "± 48.805",
            "unit": "ns/op",
            "extra": "avg 2329.6ns, min 2198.9ns, p99 2492.2ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4422.551,
            "range": "± 63.098",
            "unit": "ns/op",
            "extra": "avg 4437.0ns, min 4146.4ns, p99 4780.7ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 2838.468,
            "range": "± 57.869",
            "unit": "ns/op",
            "extra": "avg 2846.9ns, min 2711.2ns, p99 3017.5ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 2989.697,
            "range": "± 78.828",
            "unit": "ns/op",
            "extra": "avg 3004.7ns, min 2816.4ns, p99 3211.4ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.551,
            "range": "± 0.455",
            "unit": "ns/op",
            "extra": "avg 35.6ns, min 33.2ns, p99 80.1ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.555,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.6ns, p99 4.9ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.725,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 9.9ns, min 9.7ns, p99 12.1ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.337,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 4.4ns, min 4.3ns, p99 6.5ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 440.958,
            "range": "± 28.864",
            "unit": "ns/op",
            "extra": "avg 462.9ns, min 427.5ns, p99 592.0ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4283.708,
            "range": "± 60.966",
            "unit": "ns/op",
            "extra": "avg 4289.4ns, min 4120.9ns, p99 4432.2ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 21157.954,
            "range": "± 280.588",
            "unit": "ns/op",
            "extra": "avg 21422.5ns, min 20827.7ns, p99 22264.2ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 14445.449,
            "range": "± 79.915",
            "unit": "ns/op",
            "extra": "avg 14479.1ns, min 14233.4ns, p99 14706.0ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 17420.721,
            "range": "± 237.686",
            "unit": "ns/op",
            "extra": "avg 17420.3ns, min 16706.5ns, p99 17714.6ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 199633,
            "range": "± 8496",
            "unit": "ns/op",
            "extra": "avg 206759.1ns, min 181419.0ns, p99 308356.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 15614.981,
            "range": "± 411.661",
            "unit": "ns/op",
            "extra": "avg 15956.9ns, min 15408.8ns, p99 17109.3ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1907.285,
            "range": "± 25.208",
            "unit": "ns/op",
            "extra": "avg 1924.9ns, min 1880.2ns, p99 2050.8ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4019.853,
            "range": "± 61.494",
            "unit": "ns/op",
            "extra": "avg 4031.8ns, min 3865.6ns, p99 4197.6ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 120.993,
            "range": "± 4.689",
            "unit": "ns/op",
            "extra": "avg 137.5ns, min 113.7ns, p99 219.2ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 476.037,
            "range": "± 14.278",
            "unit": "ns/op",
            "extra": "avg 495.8ns, min 463.3ns, p99 664.4ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 3086,
            "range": "± 571",
            "unit": "ns/op",
            "extra": "avg 3836.1ns, min 2204.0ns, p99 12463.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 4455.368,
            "range": "± 46.202",
            "unit": "ns/op",
            "extra": "avg 4459.6ns, min 4328.5ns, p99 4672.8ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 8335,
            "range": "± 1232",
            "unit": "ns/op",
            "extra": "avg 9552.3ns, min 6472.0ns, p99 24666.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 21386.819,
            "range": "± 195.659",
            "unit": "ns/op",
            "extra": "avg 21538.0ns, min 21146.3ns, p99 22016.4ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 33633,
            "range": "± 3457",
            "unit": "ns/op",
            "extra": "avg 36900.4ns, min 27071.0ns, p99 73337.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 14838.319,
            "range": "± 162.518",
            "unit": "ns/op",
            "extra": "avg 14891.0ns, min 14477.5ns, p99 15180.2ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 20511.908,
            "range": "± 449.259",
            "unit": "ns/op",
            "extra": "avg 20810.5ns, min 20130.1ns, p99 21829.5ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 201016,
            "range": "± 8025",
            "unit": "ns/op",
            "extra": "avg 207657.3ns, min 189685.0ns, p99 275134.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 229229,
            "range": "± 10289",
            "unit": "ns/op",
            "extra": "avg 240794.0ns, min 208250.0ns, p99 784347.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 3126,
            "range": "± 451",
            "unit": "ns/op",
            "extra": "avg 3629.8ns, min 2445.0ns, p99 11272.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3080.622,
            "range": "± 43.462",
            "unit": "ns/op",
            "extra": "avg 3115.4ns, min 2961.3ns, p99 3540.3ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1773.833,
            "range": "± 35.985",
            "unit": "ns/op",
            "extra": "avg 1767.7ns, min 1637.9ns, p99 1916.1ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3002.143,
            "range": "± 56.813",
            "unit": "ns/op",
            "extra": "avg 3004.9ns, min 2858.8ns, p99 3161.4ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2308.284,
            "range": "± 47.577",
            "unit": "ns/op",
            "extra": "avg 2311.7ns, min 2156.9ns, p99 2518.6ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3385.314,
            "range": "± 39.248",
            "unit": "ns/op",
            "extra": "avg 3396.4ns, min 3275.6ns, p99 3597.8ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1720.17,
            "range": "± 45.811",
            "unit": "ns/op",
            "extra": "avg 1728.3ns, min 1626.4ns, p99 1897.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6632,
            "range": "± 712",
            "unit": "ns/op",
            "extra": "avg 7371.2ns, min 5530.0ns, p99 19777.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3068.1,
            "range": "± 45.972",
            "unit": "ns/op",
            "extra": "avg 3081.0ns, min 2965.1ns, p99 3224.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3517.847,
            "range": "± 45.564",
            "unit": "ns/op",
            "extra": "avg 3524.5ns, min 3415.3ns, p99 3710.1ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 10101.232,
            "range": "± 197.2",
            "unit": "ns/op",
            "extra": "avg 10167.3ns, min 9982.8ns, p99 10335.6ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 13030.988,
            "range": "± 291.959",
            "unit": "ns/op",
            "extra": "avg 13125.1ns, min 12834.3ns, p99 13521.2ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.475,
            "range": "± 0",
            "unit": "ns/op",
            "extra": "avg 0.5ns, min 0.5ns, p99 4.9ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.1,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 5.5ns, min 5.0ns, p99 8.7ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 1.942,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 2.6ns, min 1.9ns, p99 10.5ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.091,
            "range": "± 1.561",
            "unit": "ns/op",
            "extra": "avg 7.9ns, min 5.3ns, p99 17.9ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.419,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 8.9ns, min 6.5ns, p99 13.0ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.664,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 10.8ns, min 10.5ns, p99 13.4ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 5.271,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 5.3ns, min 5.1ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.378,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 10.5ns, min 10.2ns, p99 13.0ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.31,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 5.2ns, p99 7.6ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.14,
            "range": "± 0.024",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 8.1ns, p99 10.5ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.528,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 6.6ns, min 6.5ns, p99 9.0ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 8.497,
            "range": "± 2.214",
            "unit": "ns/op",
            "extra": "avg 9.8ns, min 8.4ns, p99 15.5ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 596.953,
            "range": "± 8.191",
            "unit": "ns/op",
            "extra": "avg 615.4ns, min 588.3ns, p99 899.0ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 892.349,
            "range": "± 27.623",
            "unit": "ns/op",
            "extra": "avg 909.4ns, min 870.1ns, p99 1033.2ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.389,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 12.6ns, min 12.4ns, p99 15.4ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 103.886,
            "range": "± 1.651",
            "unit": "ns/op",
            "extra": "avg 106.3ns, min 101.8ns, p99 176.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 15269,
            "range": "± 1262",
            "unit": "ns/op",
            "extra": "avg 16599.1ns, min 12623.0ns, p99 37070.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 5948.109,
            "range": "± 59.792",
            "unit": "ns/op",
            "extra": "avg 5948.1ns, min 5812.6ns, p99 6164.0ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 13698.237,
            "range": "± 93.15",
            "unit": "ns/op",
            "extra": "avg 13727.3ns, min 13651.0ns, p99 13808.7ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 17714.736,
            "range": "± 332.012",
            "unit": "ns/op",
            "extra": "avg 17846.0ns, min 17423.2ns, p99 18329.3ns"
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
          "id": "9c377377eb613f578fd06955dcb5a37450e2930a",
          "message": "feat: use the same grammar in docs",
          "timestamp": "2026-09-02T07:42:37+05:30",
          "tree_id": "535f23de65d1dab7a4591df186ce729ead47a43b",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/9c377377eb613f578fd06955dcb5a37450e2930a"
        },
        "date": 1788315267128,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 323.641,
            "range": "± 73.481",
            "unit": "ns/op",
            "extra": "avg 367.5ns, min 315.3ns, p99 696.8ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 476.488,
            "range": "± 8.682",
            "unit": "ns/op",
            "extra": "avg 492.5ns, min 464.8ns, p99 583.1ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 624.649,
            "range": "± 12.856",
            "unit": "ns/op",
            "extra": "avg 643.4ns, min 615.0ns, p99 729.4ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 747.277,
            "range": "± 72.49",
            "unit": "ns/op",
            "extra": "avg 773.6ns, min 731.5ns, p99 904.4ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 714.406,
            "range": "± 69.425",
            "unit": "ns/op",
            "extra": "avg 738.8ns, min 696.8ns, p99 870.2ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2317.987,
            "range": "± 34.04",
            "unit": "ns/op",
            "extra": "avg 2314.3ns, min 2215.0ns, p99 2435.6ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1147.122,
            "range": "± 57.666",
            "unit": "ns/op",
            "extra": "avg 1164.4ns, min 1095.1ns, p99 1320.7ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 82.131,
            "range": "± 1.531",
            "unit": "ns/op",
            "extra": "avg 84.4ns, min 78.9ns, p99 160.3ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 87.114,
            "range": "± 1.863",
            "unit": "ns/op",
            "extra": "avg 91.1ns, min 84.9ns, p99 165.0ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 159.649,
            "range": "± 1.976",
            "unit": "ns/op",
            "extra": "avg 166.2ns, min 154.5ns, p99 240.1ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2291.337,
            "range": "± 20.996",
            "unit": "ns/op",
            "extra": "avg 2293.3ns, min 2230.1ns, p99 2371.1ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5539,
            "range": "± 711",
            "unit": "ns/op",
            "extra": "avg 6354.4ns, min 4257.0ns, p99 15653.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2392.98,
            "range": "± 75.52",
            "unit": "ns/op",
            "extra": "avg 2415.9ns, min 2235.5ns, p99 2725.8ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 1967.545,
            "range": "± 38.952",
            "unit": "ns/op",
            "extra": "avg 1967.4ns, min 1831.0ns, p99 2173.3ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 5167.242,
            "range": "± 176.287",
            "unit": "ns/op",
            "extra": "avg 5206.2ns, min 4899.5ns, p99 5573.5ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3194.794,
            "range": "± 38.238",
            "unit": "ns/op",
            "extra": "avg 3207.0ns, min 3041.5ns, p99 3584.9ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4445.72,
            "range": "± 82.547",
            "unit": "ns/op",
            "extra": "avg 4487.1ns, min 4213.2ns, p99 4807.5ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6645.707,
            "range": "± 103.002",
            "unit": "ns/op",
            "extra": "avg 6665.1ns, min 6452.0ns, p99 6848.5ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 2083.064,
            "range": "± 49.693",
            "unit": "ns/op",
            "extra": "avg 2085.6ns, min 1943.9ns, p99 2228.0ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2343.011,
            "range": "± 49.236",
            "unit": "ns/op",
            "extra": "avg 2350.0ns, min 2203.0ns, p99 2476.0ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2794.37,
            "range": "± 73.984",
            "unit": "ns/op",
            "extra": "avg 2819.0ns, min 2662.3ns, p99 3030.2ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2665.475,
            "range": "± 28.375",
            "unit": "ns/op",
            "extra": "avg 2660.4ns, min 2502.3ns, p99 2848.8ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3643.508,
            "range": "± 102.863",
            "unit": "ns/op",
            "extra": "avg 3672.6ns, min 3475.8ns, p99 3887.9ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3575.832,
            "range": "± 50.4",
            "unit": "ns/op",
            "extra": "avg 3589.1ns, min 3488.6ns, p99 3718.1ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5262.47,
            "range": "± 93.298",
            "unit": "ns/op",
            "extra": "avg 5326.4ns, min 5107.7ns, p99 5737.9ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 2035.655,
            "range": "± 33.981",
            "unit": "ns/op",
            "extra": "avg 2018.6ns, min 1887.1ns, p99 2166.3ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2569.448,
            "range": "± 36.938",
            "unit": "ns/op",
            "extra": "avg 2564.7ns, min 2431.7ns, p99 2687.4ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4830.167,
            "range": "± 111.692",
            "unit": "ns/op",
            "extra": "avg 4846.1ns, min 4603.5ns, p99 5073.1ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 3235.928,
            "range": "± 48.443",
            "unit": "ns/op",
            "extra": "avg 3226.5ns, min 3090.7ns, p99 3391.4ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3194.03,
            "range": "± 49.185",
            "unit": "ns/op",
            "extra": "avg 3196.3ns, min 3045.1ns, p99 3307.2ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.348,
            "range": "± 0.531",
            "unit": "ns/op",
            "extra": "avg 35.7ns, min 32.6ns, p99 78.3ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.538,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.922,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 15.1ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.89,
            "range": "± 0.073",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.5ns, p99 7.1ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 463.932,
            "range": "± 74.578",
            "unit": "ns/op",
            "extra": "avg 487.9ns, min 453.4ns, p99 578.4ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4765.868,
            "range": "± 76.486",
            "unit": "ns/op",
            "extra": "avg 4778.2ns, min 4603.2ns, p99 4932.3ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 23143.035,
            "range": "± 191.009",
            "unit": "ns/op",
            "extra": "avg 23477.2ns, min 22754.4ns, p99 24533.9ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 15787.698,
            "range": "± 228.237",
            "unit": "ns/op",
            "extra": "avg 15871.6ns, min 15522.3ns, p99 16067.4ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 17612.389,
            "range": "± 596.624",
            "unit": "ns/op",
            "extra": "avg 17825.3ns, min 16979.7ns, p99 18471.2ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 217343,
            "range": "± 7180",
            "unit": "ns/op",
            "extra": "avg 226337.4ns, min 203051.0ns, p99 343710.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 20029.647,
            "range": "± 260.511",
            "unit": "ns/op",
            "extra": "avg 20437.0ns, min 19900.6ns, p99 21619.5ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 2414.077,
            "range": "± 23.071",
            "unit": "ns/op",
            "extra": "avg 2450.7ns, min 2383.8ns, p99 2805.8ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4543.49,
            "range": "± 62.224",
            "unit": "ns/op",
            "extra": "avg 4539.6ns, min 4333.6ns, p99 4734.6ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 156.208,
            "range": "± 5.005",
            "unit": "ns/op",
            "extra": "avg 173.5ns, min 141.2ns, p99 264.6ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 501.749,
            "range": "± 15.724",
            "unit": "ns/op",
            "extra": "avg 522.9ns, min 490.6ns, p99 631.8ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 3045,
            "range": "± 610",
            "unit": "ns/op",
            "extra": "avg 3727.0ns, min 2013.0ns, p99 11848.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 4897.662,
            "range": "± 38.639",
            "unit": "ns/op",
            "extra": "avg 4864.5ns, min 4712.3ns, p99 5009.1ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 7381,
            "range": "± 1001",
            "unit": "ns/op",
            "extra": "avg 8595.5ns, min 5428.0ns, p99 21192.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 23124.86,
            "range": "± 142.338",
            "unit": "ns/op",
            "extra": "avg 23058.8ns, min 22562.8ns, p99 23300.7ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 31647,
            "range": "± 3004",
            "unit": "ns/op",
            "extra": "avg 34540.8ns, min 25167.0ns, p99 57596.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 15919.049,
            "range": "± 183.097",
            "unit": "ns/op",
            "extra": "avg 15965.8ns, min 15608.4ns, p99 16133.7ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 21792.74,
            "range": "± 241.624",
            "unit": "ns/op",
            "extra": "avg 21940.8ns, min 21116.3ns, p99 22348.2ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 218124,
            "range": "± 7792",
            "unit": "ns/op",
            "extra": "avg 227227.2ns, min 203943.0ns, p99 308409.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 251724,
            "range": "± 9454",
            "unit": "ns/op",
            "extra": "avg 264288.8ns, min 227037.0ns, p99 980537.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 3064,
            "range": "± 752",
            "unit": "ns/op",
            "extra": "avg 3941.2ns, min 2293.0ns, p99 12999.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3471.407,
            "range": "± 106.528",
            "unit": "ns/op",
            "extra": "avg 3501.3ns, min 3333.9ns, p99 3713.2ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1945.061,
            "range": "± 28.302",
            "unit": "ns/op",
            "extra": "avg 1941.9ns, min 1849.4ns, p99 2077.4ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3297.675,
            "range": "± 78.478",
            "unit": "ns/op",
            "extra": "avg 3331.4ns, min 3199.5ns, p99 3526.3ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2535.915,
            "range": "± 32.587",
            "unit": "ns/op",
            "extra": "avg 2524.6ns, min 2407.8ns, p99 2690.2ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3733.723,
            "range": "± 43.406",
            "unit": "ns/op",
            "extra": "avg 3745.3ns, min 3666.9ns, p99 3872.8ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1953.68,
            "range": "± 36.338",
            "unit": "ns/op",
            "extra": "avg 1954.9ns, min 1842.9ns, p99 2106.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6650,
            "range": "± 1042",
            "unit": "ns/op",
            "extra": "avg 7942.6ns, min 5097.0ns, p99 27110.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3731.748,
            "range": "± 22.331",
            "unit": "ns/op",
            "extra": "avg 3726.3ns, min 3558.7ns, p99 3866.9ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3916.534,
            "range": "± 36.866",
            "unit": "ns/op",
            "extra": "avg 3931.6ns, min 3843.9ns, p99 4076.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 10652.884,
            "range": "± 131.895",
            "unit": "ns/op",
            "extra": "avg 10737.5ns, min 10552.4ns, p99 11016.5ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 14589.053,
            "range": "± 253.089",
            "unit": "ns/op",
            "extra": "avg 14885.1ns, min 14069.1ns, p99 15450.5ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.536,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 2.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.658,
            "range": "± 0.047",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 5.6ns, p99 9.6ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.154,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 2.8ns, min 2.1ns, p99 6.2ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 10.137,
            "range": "± 0.024",
            "unit": "ns/op",
            "extra": "avg 9.1ns, min 5.8ns, p99 12.5ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.135,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 8.2ns, min 6.6ns, p99 10.6ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.584,
            "range": "± 0.059",
            "unit": "ns/op",
            "extra": "avg 10.7ns, min 10.4ns, p99 13.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 5.044,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 5.1ns, min 5.0ns, p99 7.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.548,
            "range": "± 0.063",
            "unit": "ns/op",
            "extra": "avg 10.7ns, min 10.4ns, p99 13.0ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.592,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 5.7ns, min 5.5ns, p99 7.7ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.934,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 9.1ns, min 8.8ns, p99 11.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.078,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 6.2ns, min 6.0ns, p99 8.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.431,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 9.6ns, min 9.3ns, p99 13.7ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 509.828,
            "range": "± 3.88",
            "unit": "ns/op",
            "extra": "avg 521.3ns, min 500.6ns, p99 619.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 873.092,
            "range": "± 24.177",
            "unit": "ns/op",
            "extra": "avg 897.5ns, min 848.5ns, p99 1115.6ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.34,
            "range": "± 0.02",
            "unit": "ns/op",
            "extra": "avg 12.5ns, min 12.2ns, p99 15.2ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 106.772,
            "range": "± 1.748",
            "unit": "ns/op",
            "extra": "avg 110.6ns, min 103.8ns, p99 201.2ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13740,
            "range": "± 1172",
            "unit": "ns/op",
            "extra": "avg 14969.1ns, min 11266.0ns, p99 34161.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6617.726,
            "range": "± 54.85",
            "unit": "ns/op",
            "extra": "avg 6643.9ns, min 6436.3ns, p99 6902.2ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 14995.941,
            "range": "± 165.307",
            "unit": "ns/op",
            "extra": "avg 15136.0ns, min 14674.3ns, p99 15618.5ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 19150.406,
            "range": "± 137.634",
            "unit": "ns/op",
            "extra": "avg 19276.0ns, min 18859.0ns, p99 19419.2ns"
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
          "id": "4502d9ccdecefd17204ec372bf0fbb0acf5e1168",
          "message": "fix: token fixes",
          "timestamp": "2026-09-02T07:45:53+05:30",
          "tree_id": "4e44b0e127396856214d5de9044dc9ae428cfaac",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/4502d9ccdecefd17204ec372bf0fbb0acf5e1168"
        },
        "date": 1788315459786,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 329.997,
            "range": "± 5.871",
            "unit": "ns/op",
            "extra": "avg 356.7ns, min 324.1ns, p99 683.2ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 526.444,
            "range": "± 89.183",
            "unit": "ns/op",
            "extra": "avg 568.6ns, min 505.0ns, p99 925.3ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 676.388,
            "range": "± 9.116",
            "unit": "ns/op",
            "extra": "avg 697.0ns, min 656.7ns, p99 797.1ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 817.594,
            "range": "± 87.627",
            "unit": "ns/op",
            "extra": "avg 849.3ns, min 804.1ns, p99 1073.6ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 796.111,
            "range": "± 18.125",
            "unit": "ns/op",
            "extra": "avg 820.0ns, min 775.6ns, p99 917.9ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2537.358,
            "range": "± 36.536",
            "unit": "ns/op",
            "extra": "avg 2529.9ns, min 2423.1ns, p99 2836.0ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1256.827,
            "range": "± 91.017",
            "unit": "ns/op",
            "extra": "avg 1290.2ns, min 1223.5ns, p99 1408.3ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 83.963,
            "range": "± 1.487",
            "unit": "ns/op",
            "extra": "avg 86.7ns, min 80.8ns, p99 180.7ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 75.15,
            "range": "± 2.363",
            "unit": "ns/op",
            "extra": "avg 79.5ns, min 72.4ns, p99 174.5ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 144.886,
            "range": "± 1.744",
            "unit": "ns/op",
            "extra": "avg 152.5ns, min 139.7ns, p99 253.3ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2251.854,
            "range": "± 13.749",
            "unit": "ns/op",
            "extra": "avg 2247.0ns, min 2139.1ns, p99 2301.4ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 6443,
            "range": "± 1040",
            "unit": "ns/op",
            "extra": "avg 7619.2ns, min 4959.0ns, p99 22893.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2591.38,
            "range": "± 56.114",
            "unit": "ns/op",
            "extra": "avg 2708.8ns, min 2446.9ns, p99 3944.2ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 2140.847,
            "range": "± 25.781",
            "unit": "ns/op",
            "extra": "avg 2168.9ns, min 1993.4ns, p99 3001.7ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 5571.643,
            "range": "± 89.625",
            "unit": "ns/op",
            "extra": "avg 5601.8ns, min 5418.1ns, p99 5999.6ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3454.255,
            "range": "± 43.265",
            "unit": "ns/op",
            "extra": "avg 3451.4ns, min 3299.5ns, p99 3554.6ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 5041.797,
            "range": "± 72.116",
            "unit": "ns/op",
            "extra": "avg 5012.8ns, min 4708.4ns, p99 5221.8ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 7339.074,
            "range": "± 60.987",
            "unit": "ns/op",
            "extra": "avg 7353.7ns, min 7209.1ns, p99 7540.4ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 2319.091,
            "range": "± 49.28",
            "unit": "ns/op",
            "extra": "avg 2294.8ns, min 2132.9ns, p99 2548.8ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2475.281,
            "range": "± 40.085",
            "unit": "ns/op",
            "extra": "avg 2472.5ns, min 2330.9ns, p99 2713.1ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 3019.345,
            "range": "± 49.911",
            "unit": "ns/op",
            "extra": "avg 3047.7ns, min 2876.6ns, p99 3488.8ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2878.812,
            "range": "± 25.644",
            "unit": "ns/op",
            "extra": "avg 2862.6ns, min 2746.2ns, p99 2961.2ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 4028.731,
            "range": "± 62.366",
            "unit": "ns/op",
            "extra": "avg 4013.5ns, min 3772.7ns, p99 4129.1ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 4080.848,
            "range": "± 25.553",
            "unit": "ns/op",
            "extra": "avg 4062.8ns, min 3924.0ns, p99 4156.8ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5811.044,
            "range": "± 49.409",
            "unit": "ns/op",
            "extra": "avg 5810.4ns, min 5714.5ns, p99 5886.3ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 2315.948,
            "range": "± 45.317",
            "unit": "ns/op",
            "extra": "avg 2276.5ns, min 2149.4ns, p99 2393.1ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2859.151,
            "range": "± 46.998",
            "unit": "ns/op",
            "extra": "avg 2855.5ns, min 2721.9ns, p99 2992.0ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 5176.138,
            "range": "± 197.469",
            "unit": "ns/op",
            "extra": "avg 5242.3ns, min 5023.7ns, p99 5616.1ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 3508.173,
            "range": "± 44.214",
            "unit": "ns/op",
            "extra": "avg 3510.9ns, min 3313.5ns, p99 3739.7ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3545.501,
            "range": "± 29.717",
            "unit": "ns/op",
            "extra": "avg 3582.8ns, min 3409.6ns, p99 4257.0ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 34.234,
            "range": "± 0.631",
            "unit": "ns/op",
            "extra": "avg 36.7ns, min 33.4ns, p99 80.3ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.558,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 0.7ns, min 0.6ns, p99 4.8ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.649,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 9.9ns, min 9.6ns, p99 14.7ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.344,
            "range": "± 0.01",
            "unit": "ns/op",
            "extra": "avg 4.4ns, min 4.3ns, p99 6.5ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 465.646,
            "range": "± 34.24",
            "unit": "ns/op",
            "extra": "avg 496.1ns, min 451.2ns, p99 721.1ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4824.522,
            "range": "± 65.384",
            "unit": "ns/op",
            "extra": "avg 4829.5ns, min 4621.1ns, p99 5030.5ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 23853.544,
            "range": "± 371.269",
            "unit": "ns/op",
            "extra": "avg 24273.4ns, min 23443.9ns, p99 24870.2ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 16229.533,
            "range": "± 128.012",
            "unit": "ns/op",
            "extra": "avg 16410.4ns, min 16073.1ns, p99 16723.8ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 18444.34,
            "range": "± 135.529",
            "unit": "ns/op",
            "extra": "avg 18484.7ns, min 18080.8ns, p99 18848.8ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 219624,
            "range": "± 10680",
            "unit": "ns/op",
            "extra": "avg 232320.8ns, min 198875.0ns, p99 428497.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 15953.128,
            "range": "± 76.739",
            "unit": "ns/op",
            "extra": "avg 16097.9ns, min 15816.1ns, p99 16152.4ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 1924.864,
            "range": "± 29.817",
            "unit": "ns/op",
            "extra": "avg 1960.5ns, min 1900.5ns, p99 2300.9ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4491.144,
            "range": "± 84.855",
            "unit": "ns/op",
            "extra": "avg 4500.5ns, min 4358.2ns, p99 4636.6ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 143.904,
            "range": "± 4.978",
            "unit": "ns/op",
            "extra": "avg 161.7ns, min 131.4ns, p99 262.8ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 501.042,
            "range": "± 10.061",
            "unit": "ns/op",
            "extra": "avg 522.2ns, min 490.2ns, p99 636.6ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 3596,
            "range": "± 742",
            "unit": "ns/op",
            "extra": "avg 4569.4ns, min 2404.0ns, p99 17674.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 5038.486,
            "range": "± 59.849",
            "unit": "ns/op",
            "extra": "avg 4989.9ns, min 4775.0ns, p99 5136.7ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 10159,
            "range": "± 3657",
            "unit": "ns/op",
            "extra": "avg 12631.4ns, min 7043.0ns, p99 39244.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 23355.719,
            "range": "± 38.364",
            "unit": "ns/op",
            "extra": "avg 23393.4ns, min 23149.6ns, p99 23620.1ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 37782,
            "range": "± 5179",
            "unit": "ns/op",
            "extra": "avg 42789.4ns, min 30257.0ns, p99 94858.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 16111.19,
            "range": "± 184.16",
            "unit": "ns/op",
            "extra": "avg 16263.3ns, min 15810.6ns, p99 16527.6ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 22688.969,
            "range": "± 192.76",
            "unit": "ns/op",
            "extra": "avg 23435.5ns, min 22208.8ns, p99 25700.8ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 216528,
            "range": "± 10099",
            "unit": "ns/op",
            "extra": "avg 225713.8ns, min 201299.0ns, p99 276881.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 253748,
            "range": "± 11722",
            "unit": "ns/op",
            "extra": "avg 265314.9ns, min 223501.0ns, p99 949748.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 3527,
            "range": "± 811",
            "unit": "ns/op",
            "extra": "avg 4549.8ns, min 2685.0ns, p99 18094.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3477.084,
            "range": "± 39.146",
            "unit": "ns/op",
            "extra": "avg 3495.1ns, min 3392.4ns, p99 3639.2ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 2005.926,
            "range": "± 27.772",
            "unit": "ns/op",
            "extra": "avg 1995.2ns, min 1892.8ns, p99 2152.1ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3411.472,
            "range": "± 28.087",
            "unit": "ns/op",
            "extra": "avg 3415.9ns, min 3332.2ns, p99 3523.2ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2633.932,
            "range": "± 43.759",
            "unit": "ns/op",
            "extra": "avg 2635.9ns, min 2500.0ns, p99 2776.6ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3860.064,
            "range": "± 33.097",
            "unit": "ns/op",
            "extra": "avg 3853.2ns, min 3731.9ns, p99 3960.0ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 2012.652,
            "range": "± 35.47",
            "unit": "ns/op",
            "extra": "avg 2000.8ns, min 1903.7ns, p99 2087.9ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 7284,
            "range": "± 1082",
            "unit": "ns/op",
            "extra": "avg 8374.1ns, min 5962.0ns, p99 24046.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3641.671,
            "range": "± 43.067",
            "unit": "ns/op",
            "extra": "avg 3643.3ns, min 3479.3ns, p99 3828.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 4106.504,
            "range": "± 45.54",
            "unit": "ns/op",
            "extra": "avg 4124.9ns, min 4000.5ns, p99 4425.3ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 11042.707,
            "range": "± 35.978",
            "unit": "ns/op",
            "extra": "avg 11031.1ns, min 10940.7ns, p99 11092.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 15240.156,
            "range": "± 837.532",
            "unit": "ns/op",
            "extra": "avg 15591.9ns, min 14647.7ns, p99 16152.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.475,
            "range": "± 0",
            "unit": "ns/op",
            "extra": "avg 0.5ns, min 0.5ns, p99 4.9ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.046,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 4.9ns, p99 8.5ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 1.942,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 2.6ns, min 1.9ns, p99 6.3ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 7.866,
            "range": "± 2.094",
            "unit": "ns/op",
            "extra": "avg 8.0ns, min 5.4ns, p99 12.3ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 11.227,
            "range": "± 0.257",
            "unit": "ns/op",
            "extra": "avg 11.4ns, min 6.5ns, p99 14.5ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.026,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 10.2ns, min 9.9ns, p99 13.1ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 5.271,
            "range": "± 0.012",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 4.8ns, p99 7.9ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 10.002,
            "range": "± 0.015",
            "unit": "ns/op",
            "extra": "avg 10.2ns, min 9.9ns, p99 13.0ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.318,
            "range": "± 0.022",
            "unit": "ns/op",
            "extra": "avg 5.4ns, min 5.3ns, p99 7.9ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.348,
            "range": "± 0.034",
            "unit": "ns/op",
            "extra": "avg 8.5ns, min 8.2ns, p99 11.3ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.531,
            "range": "± 0.005",
            "unit": "ns/op",
            "extra": "avg 6.7ns, min 6.5ns, p99 10.4ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 8.495,
            "range": "± 0.039",
            "unit": "ns/op",
            "extra": "avg 8.7ns, min 8.4ns, p99 11.4ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 604.402,
            "range": "± 6.125",
            "unit": "ns/op",
            "extra": "avg 619.4ns, min 597.2ns, p99 746.8ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 928.694,
            "range": "± 12.313",
            "unit": "ns/op",
            "extra": "avg 950.2ns, min 904.7ns, p99 1093.3ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.389,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 12.6ns, min 12.4ns, p99 16.8ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 109.099,
            "range": "± 1.871",
            "unit": "ns/op",
            "extra": "avg 112.5ns, min 105.8ns, p99 211.3ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 16150,
            "range": "± 1523",
            "unit": "ns/op",
            "extra": "avg 17608.1ns, min 12764.0ns, p99 42981.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6691.513,
            "range": "± 62.117",
            "unit": "ns/op",
            "extra": "avg 6709.2ns, min 6558.7ns, p99 6892.8ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 15767.754,
            "range": "± 118.294",
            "unit": "ns/op",
            "extra": "avg 15762.5ns, min 15434.7ns, p99 15932.5ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 21115.332,
            "range": "± 211.426",
            "unit": "ns/op",
            "extra": "avg 21153.0ns, min 20486.1ns, p99 21544.9ns"
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
          "id": "84444898599ce2c02b6fe4c3d7e7c84fe65a2149",
          "message": "feat: playground",
          "timestamp": "2026-09-02T08:04:20+05:30",
          "tree_id": "9c87994134c068530eb3e2ff49d2c08644759625",
          "url": "https://github.com/imranbarbhuiya/TagScript/commit/84444898599ce2c02b6fe4c3d7e7c84fe65a2149"
        },
        "date": 1788316567126,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "tagscript / lexer / declaration only",
            "value": 315.791,
            "range": "± 4.392",
            "unit": "ns/op",
            "extra": "avg 333.3ns, min 308.4ns, p99 656.9ns"
          },
          {
            "name": "tagscript / lexer / parenthesis parameter",
            "value": 488.01,
            "range": "± 66.005",
            "unit": "ns/op",
            "extra": "avg 516.9ns, min 479.4ns, p99 709.2ns"
          },
          {
            "name": "tagscript / lexer / dot parameter",
            "value": 626.542,
            "range": "± 9.506",
            "unit": "ns/op",
            "extra": "avg 642.5ns, min 616.0ns, p99 724.3ns"
          },
          {
            "name": "tagscript / lexer / payload",
            "value": 752.916,
            "range": "± 66.618",
            "unit": "ns/op",
            "extra": "avg 775.0ns, min 738.4ns, p99 897.3ns"
          },
          {
            "name": "tagscript / lexer / parameter and payload",
            "value": 732.624,
            "range": "± 66.47",
            "unit": "ns/op",
            "extra": "avg 786.8ns, min 708.3ns, p99 1674.6ns"
          },
          {
            "name": "tagscript / lexer / nested braces in payload",
            "value": 2354.875,
            "range": "± 24.95",
            "unit": "ns/op",
            "extra": "avg 2341.7ns, min 2265.3ns, p99 2417.1ns"
          },
          {
            "name": "tagscript / lexer / escaped characters",
            "value": 1159.047,
            "range": "± 72.536",
            "unit": "ns/op",
            "extra": "avg 1185.3ns, min 1128.1ns, p99 1307.9ns"
          },
          {
            "name": "tagscript / node tree / no tags",
            "value": 83.485,
            "range": "± 1.555",
            "unit": "ns/op",
            "extra": "avg 85.4ns, min 81.0ns, p99 162.7ns"
          },
          {
            "name": "tagscript / node tree / one tag",
            "value": 87.422,
            "range": "± 1.998",
            "unit": "ns/op",
            "extra": "avg 92.1ns, min 84.7ns, p99 170.8ns"
          },
          {
            "name": "tagscript / node tree / nested tags",
            "value": 162.762,
            "range": "± 2.643",
            "unit": "ns/op",
            "extra": "avg 181.9ns, min 157.7ns, p99 318.7ns"
          },
          {
            "name": "tagscript / node tree / fifty tags",
            "value": 2329.412,
            "range": "± 21.786",
            "unit": "ns/op",
            "extra": "avg 2393.6ns, min 2227.0ns, p99 3557.7ns"
          },
          {
            "name": "tagscript / parsers / BreakParser",
            "value": 5899,
            "range": "± 1182",
            "unit": "ns/op",
            "extra": "avg 7049.5ns, min 4277.0ns, p99 19099.0ns"
          },
          {
            "name": "tagscript / parsers / DefineParser",
            "value": 2444.83,
            "range": "± 53.112",
            "unit": "ns/op",
            "extra": "avg 2469.7ns, min 2308.9ns, p99 3080.3ns"
          },
          {
            "name": "tagscript / parsers / FiftyFiftyParser",
            "value": 2064.942,
            "range": "± 60.973",
            "unit": "ns/op",
            "extra": "avg 2083.3ns, min 1913.6ns, p99 2390.2ns"
          },
          {
            "name": "tagscript / parsers / IfStatementParser",
            "value": 5401.118,
            "range": "± 42.055",
            "unit": "ns/op",
            "extra": "avg 5389.4ns, min 5178.1ns, p99 5630.5ns"
          },
          {
            "name": "tagscript / parsers / IncludesParser",
            "value": 3324.433,
            "range": "± 55.616",
            "unit": "ns/op",
            "extra": "avg 3333.6ns, min 3198.9ns, p99 3525.1ns"
          },
          {
            "name": "tagscript / parsers / IntersectionStatementParser",
            "value": 4612.069,
            "range": "± 46.51",
            "unit": "ns/op",
            "extra": "avg 4628.1ns, min 4475.5ns, p99 4869.7ns"
          },
          {
            "name": "tagscript / parsers / JSONVarParser",
            "value": 6977.466,
            "range": "± 39.39",
            "unit": "ns/op",
            "extra": "avg 6967.3ns, min 6810.2ns, p99 7109.2ns"
          },
          {
            "name": "tagscript / parsers / LooseVarsParser",
            "value": 2192.785,
            "range": "± 53.535",
            "unit": "ns/op",
            "extra": "avg 2177.4ns, min 2015.2ns, p99 2373.7ns"
          },
          {
            "name": "tagscript / parsers / OrdinalFormatParser",
            "value": 2415.42,
            "range": "± 49.919",
            "unit": "ns/op",
            "extra": "avg 2409.8ns, min 2248.5ns, p99 2556.7ns"
          },
          {
            "name": "tagscript / parsers / RandomParser",
            "value": 2928.348,
            "range": "± 44.462",
            "unit": "ns/op",
            "extra": "avg 2930.2ns, min 2772.1ns, p99 3121.0ns"
          },
          {
            "name": "tagscript / parsers / RangeParser",
            "value": 2751.339,
            "range": "± 25.05",
            "unit": "ns/op",
            "extra": "avg 2735.9ns, min 2632.7ns, p99 2856.4ns"
          },
          {
            "name": "tagscript / parsers / ReplaceParser",
            "value": 3893.182,
            "range": "± 116.692",
            "unit": "ns/op",
            "extra": "avg 3898.2ns, min 3668.1ns, p99 4111.0ns"
          },
          {
            "name": "tagscript / parsers / SliceParser",
            "value": 3807.496,
            "range": "± 54.728",
            "unit": "ns/op",
            "extra": "avg 3828.3ns, min 3693.3ns, p99 3948.4ns"
          },
          {
            "name": "tagscript / parsers / StopParser",
            "value": 5581.216,
            "range": "± 57.746",
            "unit": "ns/op",
            "extra": "avg 5577.3ns, min 5339.9ns, p99 5757.9ns"
          },
          {
            "name": "tagscript / parsers / StrictVarsParser",
            "value": 2157.691,
            "range": "± 57.049",
            "unit": "ns/op",
            "extra": "avg 2148.3ns, min 1993.1ns, p99 2322.8ns"
          },
          {
            "name": "tagscript / parsers / StringFormatParser",
            "value": 2654.537,
            "range": "± 52.706",
            "unit": "ns/op",
            "extra": "avg 2657.9ns, min 2525.4ns, p99 2810.1ns"
          },
          {
            "name": "tagscript / parsers / UnionStatementParser",
            "value": 4712.76,
            "range": "± 159.068",
            "unit": "ns/op",
            "extra": "avg 4751.6ns, min 4455.3ns, p99 5074.9ns"
          },
          {
            "name": "tagscript / parsers / UrlDecodeParser",
            "value": 3217.873,
            "range": "± 89.82",
            "unit": "ns/op",
            "extra": "avg 3244.8ns, min 3126.9ns, p99 3422.7ns"
          },
          {
            "name": "tagscript / parsers / UrlEncodeParser",
            "value": 3302.048,
            "range": "± 55.225",
            "unit": "ns/op",
            "extra": "avg 3298.9ns, min 3141.7ns, p99 3452.7ns"
          },
          {
            "name": "tagscript / transformers / StringTransformer",
            "value": 33.229,
            "range": "± 0.628",
            "unit": "ns/op",
            "extra": "avg 35.5ns, min 32.3ns, p99 76.2ns"
          },
          {
            "name": "tagscript / transformers / IntegerTransformer",
            "value": 0.538,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.6ns, min 0.5ns, p99 5.1ns"
          },
          {
            "name": "tagscript / transformers / SafeObjectTransformer",
            "value": 9.895,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 10.1ns, min 9.9ns, p99 12.4ns"
          },
          {
            "name": "tagscript / transformers / FunctionTransformer",
            "value": 4.863,
            "range": "± 0.007",
            "unit": "ns/op",
            "extra": "avg 4.9ns, min 4.2ns, p99 6.8ns"
          },
          {
            "name": "tagscript / interpreter / plain text, no tags",
            "value": 484.469,
            "range": "± 32.596",
            "unit": "ns/op",
            "extra": "avg 507.9ns, min 471.0ns, p99 610.3ns"
          },
          {
            "name": "tagscript / interpreter / single tag",
            "value": 4769.532,
            "range": "± 81.546",
            "unit": "ns/op",
            "extra": "avg 4808.5ns, min 4590.2ns, p99 5091.5ns"
          },
          {
            "name": "tagscript / interpreter / typical template",
            "value": 23191.945,
            "range": "± 638.889",
            "unit": "ns/op",
            "extra": "avg 23595.0ns, min 22861.1ns, p99 24406.0ns"
          },
          {
            "name": "tagscript / interpreter / nested tags",
            "value": 16053.885,
            "range": "± 72.678",
            "unit": "ns/op",
            "extra": "avg 16109.5ns, min 15858.2ns, p99 16400.3ns"
          },
          {
            "name": "tagscript / interpreter / deeply nested",
            "value": 18264.113,
            "range": "± 65.369",
            "unit": "ns/op",
            "extra": "avg 18278.9ns, min 17990.9ns, p99 18480.0ns"
          },
          {
            "name": "tagscript / interpreter / fifty tags",
            "value": 219951,
            "range": "± 7431",
            "unit": "ns/op",
            "extra": "avg 229547.6ns, min 203596.0ns, p99 402506.0ns"
          },
          {
            "name": "tagscript / interpreter / long text, few tags",
            "value": 22029.876,
            "range": "± 87.292",
            "unit": "ns/op",
            "extra": "avg 22373.7ns, min 21918.0ns, p99 23505.3ns"
          },
          {
            "name": "tagscript / interpreter / escaped braces only",
            "value": 2392.449,
            "range": "± 14.372",
            "unit": "ns/op",
            "extra": "avg 2432.1ns, min 2368.2ns, p99 2919.3ns"
          },
          {
            "name": "tagscript / interpreter / charLimit enforced",
            "value": 4437.225,
            "range": "± 36.72",
            "unit": "ns/op",
            "extra": "avg 4418.6ns, min 4265.7ns, p99 4580.3ns"
          },
          {
            "name": "tagscript / interpreter / construction, eighteen parsers",
            "value": 161.967,
            "range": "± 4.066",
            "unit": "ns/op",
            "extra": "avg 179.0ns, min 152.9ns, p99 265.3ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, plain text, no tags",
            "value": 457.231,
            "range": "± 8.896",
            "unit": "ns/op",
            "extra": "avg 474.7ns, min 445.3ns, p99 569.9ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, plain text, no tags",
            "value": 3115,
            "range": "± 571",
            "unit": "ns/op",
            "extra": "avg 3743.8ns, min 2083.0ns, p99 11077.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, single tag",
            "value": 4733.359,
            "range": "± 62.357",
            "unit": "ns/op",
            "extra": "avg 4721.9ns, min 4560.8ns, p99 4894.1ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, single tag",
            "value": 7511,
            "range": "± 1012",
            "unit": "ns/op",
            "extra": "avg 8577.1ns, min 5358.0ns, p99 21122.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, typical template",
            "value": 22838.436,
            "range": "± 172.349",
            "unit": "ns/op",
            "extra": "avg 23027.9ns, min 22445.8ns, p99 23888.8ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, typical template",
            "value": 31989,
            "range": "± 3214",
            "unit": "ns/op",
            "extra": "avg 35171.4ns, min 25479.0ns, p99 66690.0ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, nested tags",
            "value": 15742.748,
            "range": "± 710.732",
            "unit": "ns/op",
            "extra": "avg 16040.2ns, min 15437.8ns, p99 16836.8ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, nested tags",
            "value": 20865.759,
            "range": "± 8.179",
            "unit": "ns/op",
            "extra": "avg 21257.0ns, min 20614.0ns, p99 22609.2ns"
          },
          {
            "name": "tagscript / classic vs effect / classic, fifty tags",
            "value": 214152,
            "range": "± 6670",
            "unit": "ns/op",
            "extra": "avg 221472.0ns, min 200151.0ns, p99 282715.0ns"
          },
          {
            "name": "tagscript / classic vs effect / effect, fifty tags",
            "value": 249947,
            "range": "± 7761",
            "unit": "ns/op",
            "extra": "avg 261595.9ns, min 225389.0ns, p99 921647.0ns"
          },
          {
            "name": "plugin-discord / parsers / CooldownParser",
            "value": 3115,
            "range": "± 650",
            "unit": "ns/op",
            "extra": "avg 3901.8ns, min 2314.0ns, p99 12438.0ns"
          },
          {
            "name": "plugin-discord / parsers / DateFormatParser",
            "value": 3386.159,
            "range": "± 50.461",
            "unit": "ns/op",
            "extra": "avg 3409.3ns, min 3266.0ns, p99 3674.5ns"
          },
          {
            "name": "plugin-discord / parsers / DeleteParser",
            "value": 1892.023,
            "range": "± 51.961",
            "unit": "ns/op",
            "extra": "avg 1905.5ns, min 1778.2ns, p99 2103.2ns"
          },
          {
            "name": "plugin-discord / parsers / DenyParser",
            "value": 3248.804,
            "range": "± 71.653",
            "unit": "ns/op",
            "extra": "avg 3256.3ns, min 3067.4ns, p99 3445.3ns"
          },
          {
            "name": "plugin-discord / parsers / FilesParser",
            "value": 2480.147,
            "range": "± 59.071",
            "unit": "ns/op",
            "extra": "avg 2485.1ns, min 2349.0ns, p99 2654.9ns"
          },
          {
            "name": "plugin-discord / parsers / RequiredParser",
            "value": 3646.966,
            "range": "± 54.56",
            "unit": "ns/op",
            "extra": "avg 3657.5ns, min 3553.4ns, p99 3830.0ns"
          },
          {
            "name": "plugin-discord / parsers / SilentParser",
            "value": 1944.377,
            "range": "± 38.53",
            "unit": "ns/op",
            "extra": "avg 1948.9ns, min 1830.4ns, p99 2151.8ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, json payload",
            "value": 6600,
            "range": "± 1031",
            "unit": "ns/op",
            "extra": "avg 7844.6ns, min 5107.0ns, p99 24617.0ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, property form",
            "value": 3512.667,
            "range": "± 43.17",
            "unit": "ns/op",
            "extra": "avg 3517.1ns, min 3366.4ns, p99 3700.3ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, field form",
            "value": 3854.831,
            "range": "± 92.605",
            "unit": "ns/op",
            "extra": "avg 3918.5ns, min 3771.2ns, p99 4284.6ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, malformed json",
            "value": 10576.938,
            "range": "± 161.654",
            "unit": "ns/op",
            "extra": "avg 10679.6ns, min 10420.2ns, p99 10902.4ns"
          },
          {
            "name": "plugin-discord / embed / EmbedParser, many properties",
            "value": 14106.743,
            "range": "± 829.882",
            "unit": "ns/op",
            "extra": "avg 14617.2ns, min 13994.6ns, p99 15391.8ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, mention",
            "value": 0.631,
            "range": "± 0.002",
            "unit": "ns/op",
            "extra": "avg 0.7ns, min 0.6ns, p99 2.6ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, property",
            "value": 5.643,
            "range": "± 0.044",
            "unit": "ns/op",
            "extra": "avg 6.1ns, min 5.5ns, p99 9.8ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, mention",
            "value": 2.159,
            "range": "± 0.017",
            "unit": "ns/op",
            "extra": "avg 2.9ns, min 2.1ns, p99 10.5ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, property",
            "value": 8.638,
            "range": "± 1.448",
            "unit": "ns/op",
            "extra": "avg 8.6ns, min 5.8ns, p99 19.0ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, mention",
            "value": 8.176,
            "range": "± 0.012",
            "unit": "ns/op",
            "extra": "avg 8.3ns, min 7.1ns, p99 13.0ns"
          },
          {
            "name": "plugin-discord / transformers / RoleTransformer, property",
            "value": 10.873,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 11.0ns, min 10.5ns, p99 13.2ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, mention",
            "value": 4.878,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 5.0ns, min 4.8ns, p99 6.9ns"
          },
          {
            "name": "plugin-discord / transformers / ChannelTransformer, property",
            "value": 11.067,
            "range": "± 0.029",
            "unit": "ns/op",
            "extra": "avg 11.2ns, min 10.9ns, p99 13.5ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, mention",
            "value": 5.905,
            "range": "± 0.107",
            "unit": "ns/op",
            "extra": "avg 6.0ns, min 5.6ns, p99 8.2ns"
          },
          {
            "name": "plugin-discord / transformers / GuildTransformer, property",
            "value": 8.829,
            "range": "± 0.032",
            "unit": "ns/op",
            "extra": "avg 8.9ns, min 8.6ns, p99 11.2ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, mention",
            "value": 6.944,
            "range": "± 0.093",
            "unit": "ns/op",
            "extra": "avg 7.1ns, min 6.5ns, p99 10.9ns"
          },
          {
            "name": "plugin-discord / transformers / InteractionTransformer, property",
            "value": 9.416,
            "range": "± 0.027",
            "unit": "ns/op",
            "extra": "avg 9.5ns, min 9.3ns, p99 12.0ns"
          },
          {
            "name": "plugin-discord / transformers / UserTransformer, construction",
            "value": 510.607,
            "range": "± 4.196",
            "unit": "ns/op",
            "extra": "avg 527.2ns, min 503.9ns, p99 800.7ns"
          },
          {
            "name": "plugin-discord / transformers / MemberTransformer, construction",
            "value": 846.692,
            "range": "± 12.898",
            "unit": "ns/op",
            "extra": "avg 867.4ns, min 832.0ns, p99 1003.4ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, name",
            "value": 12.335,
            "range": "± 0.017",
            "unit": "ns/op",
            "extra": "avg 12.5ns, min 12.2ns, p99 17.0ns"
          },
          {
            "name": "plugin-discord / utils / resolveColor, hex",
            "value": 106.569,
            "range": "± 1.504",
            "unit": "ns/op",
            "extra": "avg 109.3ns, min 103.6ns, p99 190.1ns"
          },
          {
            "name": "plugin-discord / utils / resolveCommandOptions",
            "value": 13440,
            "range": "± 1162",
            "unit": "ns/op",
            "extra": "avg 14511.6ns, min 11137.0ns, p99 32860.0ns"
          },
          {
            "name": "plugin-discord / interpreter / mentions only",
            "value": 6468.114,
            "range": "± 68.154",
            "unit": "ns/op",
            "extra": "avg 6475.9ns, min 6316.8ns, p99 6702.9ns"
          },
          {
            "name": "plugin-discord / interpreter / embed plus actions",
            "value": 14838.118,
            "range": "± 150.796",
            "unit": "ns/op",
            "extra": "avg 14882.0ns, min 14526.7ns, p99 15200.0ns"
          },
          {
            "name": "plugin-discord / interpreter / realistic welcome tag",
            "value": 18839.554,
            "range": "± 60.562",
            "unit": "ns/op",
            "extra": "avg 18864.4ns, min 18665.8ns, p99 19008.1ns"
          }
        ]
      }
    ]
  }
}