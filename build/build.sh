echo "compiling typescript..."
tsc

echo "copying input data..."
tar cf - days/**/*.txt | (cd ./dist; tar xf -)

echo "build complete!"
