# Implementing a gRPC client and server in Typescript

This repo can be used as a template for using gRPC to generate TypeScript files for interacting with a gRPC server or client. Setup this process can be fiddly, hopefully in this repo will make it easier to understand.

# Instruction for client

Run following cmd (Note below protoc cmd is for windows machine, You need to update the path of protoc-gen-ts.cmd file in the cmd)

1)cd client
2)protoc --plugin=protoc-gen-ts="C:\Users\Admin\Documents\gRPC\my-grpc-working\client\node_modules\.bin\protoc-gen-ts.cmd" --js_out="import_style=commonjs,binary:src/protos/generated" --ts_out="service=grpc-web:src/protos/generated" src/protos/users.proto
3) <Move all the generated files from 'protos/generated/src/proto' to protos/generated and edit import path accordingly in users_pb_service.d.ts and users_pb_service.d.js files>
4) npm run start


# Instruction for server
1) Run cmd 'npm run build'. It will generate files in proto folder.
2) Open a powershell terminal and run cmd 'docker run -d -v ${PWD}/proxy/envoy.yaml:/etc/envoy/envoy.yaml:ro -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.14.1'. It will create and start docker image.
3) RUn cmd 'npm run server'
4) Go to brower and hit 'localhost:4200'. You are good to go.