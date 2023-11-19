"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dockerode_1 = __importDefault(require("dockerode"));
const app = (0, express_1.default)();
const docker = new dockerode_1.default({ socketPath: "/var/run/docker.sock" });
const id = "2b552705876b";
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let code = `/*
  h3rieuch
  */
  function sumArray() {
    console.log("hello world") //hello world
  }
  sumArray()`;
    docker.getContainer(id).start((err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        console.log(data);
        try {
            const exec = yield docker.getContainer(id).exec({
                Cmd: ["sh", "-c", `echo "${code}" > /data/foo`],
                AttachStdout: true,
                AttachStderr: true,
            });
            const startExec = yield exec.start({}, () => __awaiter(void 0, void 0, void 0, function* () {
                console.log("First command done");
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    const exec2 = yield docker.getContainer(id).exec({
                        Cmd: ["sh", "-c", `cat /data/foo`],
                        AttachStdout: true,
                        AttachStderr: true,
                    });
                    const startExec2 = yield exec2.start({}, (err, stream) => __awaiter(void 0, void 0, void 0, function* () {
                        let output = ``;
                        console.log("Second command done");
                        stream === null || stream === void 0 ? void 0 : stream.on("data", (chunk) => __awaiter(void 0, void 0, void 0, function* () {
                            output = chunk.toString("utf8");
                            console.log("output ", output);
                            console.log("code ", code);
                        }));
                        stream === null || stream === void 0 ? void 0 : stream.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
                            console.log("HELOO");
                            let newCode = code.replace(/g\//g, "");
                            const exec3 = yield docker.getContainer(id).exec({
                                Cmd: ["node", "-e", `${newCode}`],
                                AttachStdout: true,
                                AttachStderr: true,
                            });
                            const startExec3 = yield exec3.start({}, (err, stream) => __awaiter(void 0, void 0, void 0, function* () {
                                console.log("third command done");
                                stream === null || stream === void 0 ? void 0 : stream.on("data", (chunk) => __awaiter(void 0, void 0, void 0, function* () {
                                    const output = chunk.toString("utf8");
                                    console.log("ouput for code ", output);
                                }));
                            }));
                        }));
                    }));
                }), 1000);
            }));
        }
        catch (err) {
            console.log(err);
        }
    }));
}));
app.listen(3004, () => {
    console.log("running");
});
