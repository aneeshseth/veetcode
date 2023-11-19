import express from "express";
import Docker from "dockerode";
const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const id = "2b552705876b";

app.post("/", async (req, res) => {
  let code = `/*
  h3rieuch
  */
  function sumArray() {
    console.log("hello world") //hello world
  }
  sumArray()`;
  docker.getContainer(id).start(async (err, data) => {
    if (err) throw err;
    console.log(data);
    try {
      const exec = await docker.getContainer(id).exec({
        Cmd: ["sh", "-c", `echo "${code}" > /data/foo`],
        AttachStdout: true,
        AttachStderr: true,
      });
      const startExec = await exec.start({}, async () => {
        console.log("First command done");
        setTimeout(async () => {
          const exec2 = await docker.getContainer(id).exec({
            Cmd: ["sh", "-c", `cat /data/foo`],
            AttachStdout: true,
            AttachStderr: true,
          });
          const startExec2 = await exec2.start({}, async (err, stream) => {
            let output = ``;
            console.log("Second command done");
            stream?.on("data", async (chunk) => {
              output = chunk.toString("utf8");
              console.log("output ", output);
              console.log("code ", code);
            });
            stream?.on("end", async () => {
              console.log("HELOO");
              let newCode = code.replace(/g\//g, "");
              const exec3 = await docker.getContainer(id).exec({
                Cmd: ["node", "-e", `${newCode}`],
                AttachStdout: true,
                AttachStderr: true,
              });
              const startExec3 = await exec3.start({}, async (err, stream) => {
                console.log("third command done");
                stream?.on("data", async (chunk) => {
                  const output = chunk.toString("utf8");
                  console.log("ouput for code ", output);
                });
              });
            });
          });
        }, 1000);
      });
    } catch (err) {
      console.log(err);
    }
  });
});

app.listen(3004, () => {
  console.log("running");
});
