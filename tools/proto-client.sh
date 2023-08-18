mkdir -p ./src/generated
protoc -I=. ./proto/*.proto \
  --js_out=import_style=commonjs:./src/generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/generated
