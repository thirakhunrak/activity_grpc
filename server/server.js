const PROTO_PATH = "./restaurant.proto";
const connectdb = require("../db/connect");
const Menu = require("../db/models/Menu");
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var restaurantProto = grpc.loadPackageDefinition(packageDefinition);


const server = new grpc.Server();
// const menu = [
//     {
//         id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
//         name: "Tomyam Gung",
//         price: 500
//     },
//     {
//         id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
//         name: "Somtam",
//         price: 60
//     },
//     {
//         id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
//         name: "Pad-Thai",
//         price: 120
//     }
// ];

server.addService(restaurantProto.RestaurantService.service, {
    getAllMenu: async (_, callback) => {
        const menu = await Menu.find();
        callback(null, { menu });
    },
    get: async (call, callback) => {
        const menuItem = await Menu.findById(call.request.id);

        if (menuItem) {
            callback(null, menuItem);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
    insert: async (call, callback) => {
        const Item = call.request;
        const menuItem = await Menu.create(Item);
        callback(null, menuItem);
    },
    update: async (call, callback) => {
        const ans = await Menu.findByIdAndUpdate(call.request.id, { name: call.request.name, price: call.request.price }, { new: true })

        if (ans) {
            callback(null, ans);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            });
        }
    },
    remove: async (call, callback) => {
        const ans = await Menu.findByIdAndDelete(call.request.id);
        console.log(ans);
        if (ans) {
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "NOT Found"
            });
        }
    }
});

const main = async () => {
    await connectdb();
    server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
    console.log("Server running at http://127.0.0.1:30043");
    server.start();
}
main();