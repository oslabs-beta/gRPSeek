# mkdir -p ./src/proto
# protoc -I=. ./proto*.proto \
#   --js_out=import_style=commonjs:./src \
#   --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src

# Path to this plugin (npm i ts-protoc-gen)
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-web:${OUT_DIR}" \
    