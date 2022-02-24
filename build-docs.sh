#!/bin/bash
docker run --rm -t -v $(pwd)/mkdocs:/mkdocs douglampe/mkdocs:latest mkdocs build -d dist/docs
rm -rf ../docs
mv mkdocs/dist/docs ..
./node_modules/.bin/typedoc