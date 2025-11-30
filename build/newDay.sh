ROOT_DIR="days"
if [ ! -d "$ROOT_DIR" ]; then
  echo "Root directory does not exist for some reason, creating a new one."
  mkdir $ROOT_DIR
fi

cd $ROOT_DIR

DIR="day$1"
if [ -d "$DIR" ]; then
  echo "Day $1 already exists, try again."
  exit 1
fi

# Create directory and files
mkdir $DIR
cd $DIR

# put the boilerplate code in the index.ts file
touch index.ts
cat ../../template.ts > index.ts

# curl the input data and put it in the input.txt file
touch demo.txt
touch input.txt
read -p "Enter session cookie: " SESSION
curl "https://adventofcode.com/2025/day/$1/input" -H "cookie: session=$SESSION" > input.txt
