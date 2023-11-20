import express from "express";
import Docker from "dockerode";
const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const id = "2b552705876b";
import cors from "cors";

app.use(cors());
const problems = [
  {
    title: "Two Sum",
    level: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      
      You can return the answer in any order.`,
    examples: [
      {
        Input: "nums = [2,7,11,15], target = 9",
        Output: "[0,1]",
      },
      {
        Input: "nums = [3,2,4], target = 6",
        Output: "[1,2]",
      },
      {
        Input: "nums = [3,3], target = 6",
        Output: "[0,1]",
      },
    ],
    boilerplateCode: `/**
    * @param {number[]} nums
    * @param {number} target
    * @return {number[]}
    */
   var twoSum = function(nums, target) {
       
   };`,
    testcases: [
      {
        functionCall: "twoSum([2,7,11,15],9)",
        Output: "[0,1]",
      },
      {
        functionCall: "twoSum([3,2,4],6)",
        Output: "[1,2]",
      },
    ],
  },
];

app.get("/problem", async (req, res) => {
  try {
    const title = problems[0]?.title;
    const description = problems[0]?.description;
    const level = problems[0]?.level;
    const examples = problems[0]?.examples;
    const boilerPlate = problems[0]?.boilerplateCode;
    res.status(200).json({
      title: title,
      description: description,
      level: level,
      examples: examples,
      boilerPlate: boilerPlate,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  const { code } = req.body;
  /*
  let code = `
  function sumArray() {
    console.log("hello world") //hello world
  }
  sumArray()`;
*/
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
