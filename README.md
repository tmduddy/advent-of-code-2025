## Tyler's Advent of Code 2025
This time in Typescript!

linting from [GTS](https://github.com/google/gts)

### how 2 run
```shell
npm run day:new <number>
```
will create a new directory in the days folder with the provided number and fetch the input data.

You'll need a session cookie taken from a recently logged in browser session on adventofcode to accomplish this. You'll be prompted for one when running each day.

This also creates a `demo.txt` file that holds on to any demo data from the problem. 

```shell
npm run day:demo <number>
```

will execute the given day with demo data instead of the "real" input


```shell
npm run day <number>
```
will execute the given day with the proper puzzle input.

```shell
npm run day:debug <number>
```
will execute the given day with the proper puzzle input but allow debug logging.

To just build the files and copy over the input data use:
```shell
npm run compile
```

or 

```shell
./build.sh
```

### linting and formatting
I'm trying to stick to a consistent format, so I've installed `gts` from Google.
```shell
npx gts init
```
Set up all of the required config files and 
```
npm run lint
npm run fix
```
are maintaining the formatting. I'm leaving this exactly as-is with no customizations for ease of use.
