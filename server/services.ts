import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  ServerWritableStream,
  ServerReadableStream,
} from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { users } from "./db";
import { User } from "../proto/users_pb";

export class UsersServer {

  getUsers(call: ServerWritableStream<Empty>) {
    console.log(`getUsers: streaming all users.`);
    console.log('uesers', users);
    for (const user of users) call.write(user);
    call.end();
  }

  createUser(call: ServerUnaryCall<Empty>, callback: sendUnaryData<Empty>) {
    console.log(`createUsers: creating new users.`);
    const user:any = call.request;
    if (!user.getId() || !user.getName() ||!user.getAge() || !user.getStatus()) {
      const error: ServiceError = {
        name: "User Detail Invalid",
        message: `User detail are invalid.`,
      };
      console.log(`Error : User detail are invalid !!!`);
      callback(error, null);
      return;
    }
    users.push(user);
    console.log(`new user created with name : ${user.getName()} (id: ${user.getId()}).`);
    callback(null, new Empty());
  }

}
