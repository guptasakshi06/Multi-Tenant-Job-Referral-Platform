
const applicationQueue = require("./application.queue");

async function test(){
    await applicationQueue.add("test-job",{
        message : "Hello from BullMQ",
    });

    console.log(" Job added to queue");
    process.exit(0);
}

test();