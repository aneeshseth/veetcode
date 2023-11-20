import express from "express";
import Docker from "dockerode";
const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const id = "2b552705876b";
import cors from "cors";
import util from "util";
const setTimeoutPromise = util.promisify(setTimeout);
import amqp from "amqplib";

async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queue = "codeQueue";

    await channel.assertQueue(queue, { durable: false });

    return { connection, channel, queue };
  } catch (err) {
    throw err;
  }
}

async function start() {
  try {
    const rabbitMQ = await setupRabbitMQ();
    const { channel } = rabbitMQ;
  } catch (err) {
    console.error("Error setting up RabbitMQ:", err);
  }
}

start();

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

async function solveTestCases(code: string) {
  let testPass = true;
  docker.getContainer(id).start(async (err, data) => {
    if (err) throw err;
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
            });
            stream?.on("end", async () => {
              let newCode = code.replace(/g\//g, "");
              const testcasePromises = problems[0].testcases.map(
                async (testcase) => {
                  console.log("testcase ", testcase);
                  const updatedCode =
                    code + "\n" + `console.log(${testcase.functionCall})`;
                  const exec3 = await docker.getContainer(id).exec({
                    Cmd: ["node", "-e", `${updatedCode}`],
                    AttachStdout: true,
                    AttachStderr: true,
                  });
                  const startExec3 = await exec3.start(
                    {},
                    async (err, stream) => {
                      console.log("third command done");
                      stream?.on("data", async (chunk) => {
                        console.log("DATA");
                        const output = chunk.toString("utf8");
                        const executionResult = output
                          .replace(/\x1B\[[0-9;]*[mG]/g, "")
                          .replace(/[\r\n]/g, "")
                          .replace(/[^\w]/g, "");
                        console.log("execresult", executionResult);
                        const testresult = testcase.Output.replace(
                          /\x1B\[[0-9;]*[mG]/g,
                          ""
                        )
                          .replace(/[\r\n]/g, "")
                          .replace(/[^\w]/g, "");
                        console.log("test result", testresult);

                        if (testresult != executionResult) {
                          testPass = false;
                        }
                      });
                    }
                  );
                }
              );
              await Promise.all(testcasePromises);
            });
          });
          return testPass;
        }, 1000);
      });
    } catch (err) {
      console.log(err);
    }
  });
}

app.post("/", async (req, res) => {
  const { code } = req.body;
  const rabbitMQ = await setupRabbitMQ();
  const { channel } = rabbitMQ;
  const queue = "codeQueue";
  channel.sendToQueue(queue, Buffer.from(code));

  channel.consume(queue, async (msg) => {
    const code = msg?.content.toString();
    const status = await solveTestCases(code!);
    channel.ack(msg!);
    res.status(200).json({ msg: status });
  });
});

app.listen(3004, () => {
  console.log("running");
});
